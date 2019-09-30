import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {APP} from "../../config/config";
import {Md5} from "ts-md5";
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {appApis} from "../../constant/apis";
import {CropperComponent} from "../cropper/cropper.component";
import {HttpService} from '../../service/http-service.service';
let OSS = require('ali-oss');
@Component({
  selector: 'app-ali-upload',
  templateUrl: './ali-upload.component.html',
  styleUrls: ['./ali-upload.component.scss']
})
export class AliUploadComponent implements OnInit {
  uploadType;
  type; //上传文件类型；
  isCropper; //是否裁切；
  ratio; // 裁切比率；
  zuopin:false;
  @Input() set uploadAli(value){
    this.uploadType = value.isChunk;
    if(value.type){this.fileAccept = value.type;}
    this.isCropper = value.isCropper;
    this.ratio = value.ratio;
    this.zuopin = value.zuopin;
  }
  @Input() size;
  @Input() set accept(value){
    if(value){
      console.log(value);
      this.fileAccept='';
      this.filetype='';
      value =value.split(",");
      value.forEach((item)=>{
        if(item){
          this.fileAccept += '.'+item+',';
          this.filetype +=  item+',';
        }
      });
    }
    this.fileAccept =  this.fileAccept.substring(0,this.fileAccept.length-1);
    console.log(this.fileAccept);
  }
  fileAccept = '';
  filetype;
  blocks = []; //上传校验的分块
  fileblock = []; //存储的分块
  chunkSize = 5*1024*1024; //计算指纹分块大小 固定值不动
  uploadChunkSize = 3*1024*1024; //上传分块大小
  percent = 0; // 进度条
  isPercent = false; //是否显示进度条
  uploadStatus; //上传的状态
  stop = 0; // 中断或继续
  file = {}; // 上传的文件
  stopShow = 0; // 是否显示暂停或删除
  filename; // 文件名称
  subscribObj; //Subscription对象
  uploadSucess = false;
  app = APP; //app应用名
  fileFingerString='';
  calcelShow = 0;
  client;
  aliClient;
  isreader = 0;
  tempCheckpoint; //暂停上传的上传片数；
  isImgCute = 0;
  @Output() retupload= new EventEmitter();
  constructor(
    private modal: NzModalRef,
    private httpService: HttpService,
    private _message: NzMessageService,
    private modalService: NzModalService,
  ) { }
  ngOnInit() {
    if(localStorage.getItem('SecurityToken')){
      let time =  (new Date().getTime()-Number(localStorage.getItem('expireTime')) )/1000;
      if(time>3000){
        this.getSTS();
      }
    }else{
      this.getSTS();
    }
  }
  //选择文件
  uploadFile(event){
    console.log(this.fileAccept);
    this.clear();
    let file = event.target.files[0];
    this.file = file;
    this.filename = file.name;

    let filetype = file.name.split(".")[file.name.split(".").length - 1];
     if(this.size && file.size > this.size*1024*1024 ){
      $('#t4').val('');
      this.filename = '';
      return this._message.error('您选择的图片大小不符合要求，上传图片大小应在'+this.size +'M以内');
    }
    if(this.filetype && this.filetype.indexOf(filetype.toLowerCase()) == -1){
      $('#t4').val('');
      this.filename = '';
      return this._message.error('您选择的图片格式不符合要求，上传图片格式应为'+this.filetype);
    }
    if(this.zuopin){
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload =(e)=>{
        let image = new Image();
        image.src = e.target['result'];
        image.onload =()=> {
          if(image['height']/image['width'] !== 2 &&this.zuopin){
            $('#t4').val('');
            this.filename = '';
            return this._message.error('您选择的图片尺寸不符合要求，上传图片尺寸应为 宽/高=1/2')
          }
          //
          this.stopShow = 1;
          this.isreader = 1;
          this.cuteFile(0,file);
        };
      };
    }else{
      if(this.fileAccept.indexOf(file.type.split("/")[0]) == -1){
        $('#t4').val('');
        this.filename = '';
        return this._message.error('您选择的文件类型有误')
      }
      this.stopShow = 1;
      this.isreader = 1;
      if(file.type.split("/")[0] == 'image' && this.isCropper){
        this.modalService.confirm({
          nzTitle: '是否需要裁剪图片？',
          nzOnOk: () => this.openPicCrop(file),
          nzOnCancel: () => this.cuteFile(0,file)
        });
      }else{
        this.cuteFile(0,file);
      }
    }



  }
  //文件切片递归
  cuteFile(i,file){
    if(this.isreader){
      let blockNum = Math.ceil(file.size / this.chunkSize);
      let nextSize = Math.min((i+1) * this.chunkSize, file.size);
      let blockData  = file.slice(i * this.chunkSize, nextSize);
      let reader = new FileReader();
      reader.readAsText(blockData);
      let that = this;
      reader.onload = function() {
        if(reader.result){
          let blockMd5 = Md5.hashStr(reader.result.toString());
          that.blocks.push({i:i,rangeFingerprint:blockMd5,fileFingerprint:''});
          that.fileFingerString += blockMd5;
          $('.noteInfo').html('正在读取文件...已读取'+ Math.floor((i/blockNum) * 100)+ "%");
          if(that.blocks.length == blockNum){
            // console.log(that.blocks,that.fileFingerString);
            let fileMD5 = Md5.hashStr(that.fileFingerString);
            file.filemd5 = fileMD5;
            that.blocks.forEach(item=>{ item.fileFingerprint = fileMD5});
            that.fileCheak(fileMD5,file);
          }else{
            that.cuteFile(that.blocks.length,file);
          }
        }
      };
    }
  }
  //检验文件
  fileCheak(fileMD5,file){
    $('.noteInfo').html('正在校验文件...');
    this.calcelShow =1;
    this.isreader = 0;
    this.subscribObj =this.httpService.get(appApis.isFingerprint_ali.url+'/'+ fileMD5 + '/' + this.app,
      data => {
        if (data.code == 0){
            this.isPercent = true;
            this.client = data.data;
            if(this.uploadType && file.size > this.chunkSize ) {
              this.uploadAliChunk(file);
            }else{
              this.filesimpleUpload(file);
            }
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
            this.uploadSecond(getstr);

          }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  getSTS(){
    this.httpService.get(appApis.alists.url,
      data => {
          if(data.code == 1 && data.data){
            localStorage.setItem('SecurityToken',data.data.SecurityToken);
            localStorage.setItem('AccessKeyId',data.data.AccessKeyId);
            localStorage.setItem('AccessKeySecret',data.data.AccessKeySecret);
            localStorage.setItem('expireTime', ''+ new Date().getTime());
            // this.uploadAliChunk(file);
          }else{
            this._message.error('权限请求失败，请重试');
          }
      },
      error => {
        console.error(error);
      });
  }
  //切片上传
  uploadAliChunk(file){
    // this.aliClient=null;
    $('.noteInfo').html('正在上传...');
    let oss = {
      region: 'oss-cn-beijing',
      stsToken:localStorage.getItem('SecurityToken'),
      accessKeyId: localStorage.getItem('AccessKeyId'),
      accessKeySecret: localStorage.getItem('AccessKeySecret'),
      bucket: 'dev-test-bucket',
    };
    this.aliClient = new OSS(oss);
    this.multipartUploadaaa(file);
  }
  multipartUploadaaa(file) {
    try{
      let fileName = file.filemd5 +'.'+ file.name.split(".")[file.name.split(".").length - 1];
      let result = this.aliClient.multipartUpload(this.client.key+'/'+fileName, file,
        {
          progress:(p, checkpoint)=> {
            // 断点记录点。 浏览器重启后无法直接继续上传，需用户手动触发进行设置。
            this.percent = Number((p * 100).toFixed(0));
            this.tempCheckpoint = checkpoint;
          },
          partSize:this.uploadChunkSize,
          checkpoint:this.tempCheckpoint,
          parallel:1,
        }).then((res)=> {
        $('.noteInfo').html('上传完成');
        let getstr = {
          name: fileName,
          fingerprint: file.filemd5,
          suffix: '.' + file.name.split(".")[file.name.split(".").length - 1],
          type: file.type.split("/")[0] ? file.type.split("/")[0] : 'other',
          size: file.size,
          browser: localStorage.getItem('browser'),
          path: res.name,
          app: this.app //虚拟文件夹名称（可以是多级）+ /+文件名（文件指纹）+ /+后缀
        };
        //调用秒传接口 把文件信息发送给服务端
        this.uploadSecond(getstr);
      })
    } catch(e){
    }

  }
  // 简单文件上传
  filesimpleUpload(file){
    $('.noteInfo').html('正在上传...');
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
    this.httpUpload(formData,file,fileName);
  }


  httpUpload(formData,file,fileName){
    this.subscribObj = this.httpService.uploadAli(this.client.host, formData,
      data => {
      // console.log(data);
        this.isPercent = true;
        if (data.type === HttpEventType.UploadProgress) { //1  上传进度
          let mathpre = Math.floor((data.loaded / data.total)*100) ;
          if(mathpre < 99){ this.percent = mathpre }
        }
        if (data.type === HttpEventType.DownloadProgress) { //3  上传完成
          this.percent = 99;
        }
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
            this.uploadSecond(getstr);
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  // 文件秒传
  uploadSecond(getStr){
    this.httpService.post(appApis.uploadSecd_Ali.url, getStr,
      data => {
        this.statusUpload(data);
      },
      error => {
        console.error(error);
      });
  }
  // 暂停
  interrupt(){
    this.stop = 1;
    $('.noteInfo').html('暂停上传...');
    // console.log(this.aliClient.cancel());
    this.aliClient.cancel();
  }
  // 继续
  continues(){
    this.stop = 0;
    $('.noteInfo').html('正在上传...');
    this.uploadAliChunk(this.file);
  }
  //删除文件
  cancalUpload(){
    this.subscribObj.unsubscribe();
    if(this.uploadType && this.aliClient){
      this.aliClient.cancel();
    }
    $('.noteInfo').html('正在删除...');
    setTimeout(()=>{
        this.stopShow = 0;                                                //return
        this.calcelShow = 0;
        // this.aliClient = null;
        this.tempCheckpoint = {};
        $('.noteInfo').html('');
        this._message.success('已删除');
        this.clear();
      }
      ,1000)
  }
  // 置空处理
  clear(){
    this.isreader = 0;
    this.filename ='';
    this.blocks=[];
    this.fileblock = [];
    this.isPercent = false;
    this.percent = 0;
    this.file = {};
    this.percent = 0;
    this.stop = 0;
    this.fileFingerString = '';
    this.uploadStatus = 'active';
    // this.aliClient = null;
    $('.noteInfo').html('');
  }
  //上传完成后的统一处理
  statusUpload(data){
    this.percent = 100;
    if(data.code == 1){
      $('.noteInfo').html('上传完成');
      this._message.success('上传完成');
      this.uploadSucess = true;                                                 //return
      this.uploadStatus = 'success';
      this.tempCheckpoint={};
      this.calcelShow = 0;
      $('progress').fadeOut(500);
      setTimeout(()=>{
          this.filename ='';
          this.stopShow = 0;                                      //return
          $('.noteInfo').html('');
          this.retupload.emit(data.data);
        }
        ,1500)
    }else{
      $('.noteInfo').html(data.message);
      this._message.error(data.message);
      this.uploadStatus = 'exception';
    }
  }
  // 弹框消失
  nzOnCancel(){
    if(this.stopShow){
      this.modalService.confirm({
        nzTitle: '有上传任务未完成，是否取消上传任务并关闭页面？',
        nzOnOk: () => {
          if(this.isreader){
            this.isreader = 0;
          }
          if(this.subscribObj){this.subscribObj.unsubscribe();}

          this.isreader = 0;
          this.modal.destroy({ success: this.uploadSucess })
        }
      });
    }else{
      this.isreader = 0;
      this.modal.destroy({ success: this.uploadSucess});
    }

  }

  //      图片裁剪
  //子弹窗-图片剪裁
  openPicCrop(file) {
    const modal = this.modalService.create({
      nzTitle: '图片裁剪',
      nzWidth:700,
      nzClosable:false,
      nzContent:CropperComponent,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        info:file, ratio:this.ratio
      }
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.img){
        let reader = new FileReader();
        reader.readAsText(result.img);
        reader.onload =()=> {
          if (reader.result) {
            let cropperMd5 = Md5.hashStr(reader.result.toString());
            $('.noteInfo').html('正在上传...');
            let fileName = cropperMd5 +'.'+ result.img.type.split("/")[1];
            this.cropUpload(this.file,fileName,result.img,cropperMd5);
          }
        }
      }
      if(result&& result.cancel){
        this.cuteFile(0,this.file);
      }
    });
  }
  cropUpload(file,fileName,imgcrop,cropperMd5){
    this.subscribObj =this.httpService.get(appApis.isFingerprint_ali.url+'/'+ cropperMd5 + '/' + this.app,
      data => {
        if (data.code == 0 || data.code == 1){
          this.isPercent = true;
          this.client = data.data;
          this.imgcropupload(file,fileName,imgcrop,cropperMd5);
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  imgcropupload(file,fileName,imgcrop,cropperMd5){
    $('.noteInfo').html('正在上传...');
    let obj = {
      name:fileName,
      key:this.client.key+'/'+fileName,
      policy:this.client.policy,
      OSSAccessKeyId:this.client.accessid,
      success_action_status:200,
      signature:this.client.signature,
      file:imgcrop
    };
    let formData = new FormData();
    formData.append('name', fileName); // 通过append向form对象添加数据
    formData.append('key', this.client.key+'/'+fileName);
    formData.append('policy', this.client.policy);
    formData.append('OSSAccessKeyId', this.client.accessid);
    formData.append('success_action_status', ''+200);
    formData.append('signature', this.client.signature);
    formData.append('file', imgcrop, fileName);// 通过append向form对象添加数据
    this.subscribObj = this.httpService.uploadAli(this.client.host, formData,
      data => {
        // console.log(data);
        this.isPercent = true;
        if (data.type === HttpEventType.UploadProgress) { //1  上传进度
          let mathpre = Math.floor((data.loaded / data.total)*100) ;
          if(mathpre < 99){ this.percent = mathpre }
        }
        if (data.type === HttpEventType.DownloadProgress) { //3  上传完成
          this.percent = 99;
        }
        if (data.type === HttpEventType.Response) { //4  上传完成响应
          if(data.status == 200){
            let getstr ={
              name:fileName,
              fingerprint:cropperMd5,
              suffix:imgcrop.type.split("/")[1],
              type:imgcrop.type.split("/")[1],
              size:imgcrop.size,
              browser:localStorage.getItem('browser'),
              path:this.client.key+'/'+fileName,
              app:this.app,
            };
            this.uploadSecond(getstr);
          }
        }
      },
      error => {
        console.error(error);
      });
  }
}
