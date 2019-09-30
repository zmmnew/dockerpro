import { Component, Input, Output, EventEmitter, ElementRef, OnInit, Renderer,NO_ERRORS_SCHEMA} from '@angular/core';
import {ALIURL, APP, ROOT_URL} from '../../config/config';
import {appApis} from "../../constant/apis";
import {HttpEventType} from "@angular/common/http";
import {HttpService} from '../../service/http-service.service';
import {Md5} from 'ts-md5';
import {NzMessageService} from 'ng-zorro-antd';
declare let wangEditor:any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  editor:any;
  private aliUrl: string = ALIURL;
  // private imgUrl: string = ROOT_URL + appApis.upload_file.url;
  @Input() content;
  @Input() disable;
  app = APP; //app应用名
  client;
  isSpinning = false;
  @Output() onPostData = new EventEmitter();
  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private httpService: HttpService,
    private _message: NzMessageService,
  ) { }
  ngOnInit() {
    // setTimeout(()=>{
      this.editorInit();
    // },500);
  }
  editorInit(){
    let element = this.el.nativeElement.querySelector('#editorElem');
    this.editor = new wangEditor(element);
    this.editor.customConfig.pasteFilterStyle = false;
    this.editor.customConfig.pasteTextHandle = function (content) {
      console.log(content);
      // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
      return content
    };
    this.editor.customConfig.customUploadImg = (files, insert) =>{
      // console.log(files[0]);
      this.checkfile(files[0],insert);
    };
    this.editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      // 'emoticon',  // 表情
      'image',  // 插入图片
      'table',  // 表格
      // 'video',  // 插入视频
      'code',  // 插入代码
      // 'undo',  // 撤销
      // 'redo'  // 重复
    ];
    this.editor.create();
    //内容显示
    if(this.content){
      this.editor.txt.html(this.content);
    }
    //是否可以编辑
    if(this.disable == true){
      $('.w-e-text').attr("contenteditable", "false");
    }
  }
  checkfile(file,insert){
    this.isSpinning = true;
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = ()=> {
      if(reader.result){
        file.filemd5 =  Md5.hashStr(reader.result.toString());
        this.checkhttp(file,insert);
      }
    };

  }
  checkhttp(file,insert){
    this.httpService.get(appApis.isFingerprint_ali.url+'/'+ file.filemd5 + '/' + this.app,
      data => {
        if (data.code == 0){
          this.client = data.data;
          this.filesimpleUpload(file,insert);
        }else if(data.code == 1){
          let getstr ={
            name:data.data.name,
            fingerprint:data.data.fingerprint,
            suffix:data.data.suffix,
            type:data.data.type,
            size:data.data.size,
            browser:data.data.browser,
            path:data.data.path,
            app:data.data.app
          };
          this.uploadSecond(getstr,insert);

        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  //简单文件上传
  filesimpleUpload(file,insert){
    let fileName = file.filemd5 +'.'+ file.name.split(".")[file.name.split(".").length - 1];
    let obj = {
      name:fileName,
      key:this.client.key+'/'+fileName,
      policy:this.client.policy,
      OSSAccessKeyId:this.client.accessid,
      success_action_status:200,
      signature:this.client.signature,
      file:file
    };
    let formData = new FormData();
    formData.append('name', fileName); // 通过append向form对象添加数据
    formData.append('key', this.client.key+'/'+fileName);
    formData.append('policy', this.client.policy);
    formData.append('OSSAccessKeyId', this.client.accessid);
    formData.append('success_action_status', ''+200);
    formData.append('signature', this.client.signature);
    formData.append('file', file, fileName);// 通过append向form对象添加数据
    this.httpUpload(formData,file,fileName,insert);
  }
  httpUpload(formData,file,fileName,insert){
    this.httpService.uploadAli(this.client.host, formData,
      data => {
        if (data.type === HttpEventType.Response) { //4  上传完成响应
          if(data.status == 200){
            let getstr ={
              name:fileName,
              fingerprint:file.filemd5,
              suffix:'.'+fileName.split(".")[1],
              type:file.type.split("/")[0]?file.type.split("/")[0]:'other',
              size:file.size,
              browser:localStorage.getItem('browser'),
              path:this.client.key+'/'+fileName,
              app:this.app,
            };
            this.uploadSecond(getstr,insert);
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  // 文件秒传
  uploadSecond(getStr,insert){
    this.httpService.post(appApis.uploadSecd_Ali.url, getStr,
      data => {
        insert(this.aliUrl + data.data);
        this.isSpinning = false;
      },
      error => {
        console.error(error);
      });
  }
  clickHandle() {
    let data = this.editor.txt.html();
    this.onPostData.emit(data);
    console.log(data);
    return data
  }
//   removeWordXml(text){
//     let html = text;
//     html = html.replace(/<\/?SPANYES[^>]*>/gi, "");//  Remove  all  SPAN  tags
//     // html = html.replace(/<(\w[^>]*)  class=([^|>]*)([^>]*)/gi, "<$1$3");  //  Remove  Class  attributes
//     // html = html.replace(/<(\w[^>]*)  style="([^"]*)"([^>]*)/gi, "<$1$3");  //  Remove  Style  attributes
//     html = html.replace(/<(\w[^>]*)  lang=([^|>]*)([^>]*)/gi, "<$1$3");//  Remove  Lang  attributes
//     html = html.replace(/<\\?\?xml[^>]*>/gi, "");//  Remove  XML  elements  and  declarations
//     html = html.replace(/<\/?\w+:[^>]*>/gi, "");//  Remove  Tags  with  XML  namespace  declarations:  <o:p></o:p>
//     html = html.replace(/&nbsp;/, "");//  Replace  the  &nbsp;
//     html = html.replace(/\n(\n)*( )*(\n)*\n/gi, '\n');
//     //  Transform  <P>  to  <DIV>
//     // var  re  =  new  RegExp("(<P)([^>]*>.*?)(<//P>)","gi")  ;            //  Different  because  of  a  IE  5.0  error
// //        html = html.replace(re, "<div$2</div>");
//     return html;
//   }
}
