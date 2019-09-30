import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {EditorComponent} from '../../../../common/share/editor';
import {ALIURL} from '../../../../common/config/config';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {HttpService} from '../../../../common/service/http-service.service';
import {appApis} from '../../../../common/constant/apis';
import {DatePipe} from '@angular/common';
import {Method} from '../../../../common/service/method';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  actType;
  actId;
  uploadtype = false;
  @Input() set type(value){
    this.actType = value;
    if(value == 1){this.uploadtype = true}
  };
  @Input() set covery(value){
    if(value){
      value = JSON.parse(value);
      value.forEach((item)=>{
        this.cityOptions.forEach((i)=>{
          if(item==i.value){i.checked = true;}
        })
      })
    }
  }
  @Input() set info(value){
    if(value){
      // console.log(value.coverage);
      this.actId = value.id;
      this.imgPath = value.thumbnail;
      this.imgBanner = value.banner;
      this.actName = value.name;
      this.endtime = this.method.time(value.activityEndTime);
      this.editorContent = value.description;
      this.uploadType = value.type;
    }
  };
  imgPath;
  imgBanner;
  actName;
  endtime;
  disabled = false;
  editorContent;
  private aliUrl: string = ALIURL;
  uploadParamsImg = {
    isChunk:false,
    type:'image/*',
    isCropper:true,
    ratio:5/4
  };
  uploadfile = {
    isChunk:true,
    isCropper:false,
  };
  uploadParamsBanner = {
    isChunk:false,
    type:'image/*',
    isCropper:true,
    ratio:12/4
  };
  uploadType='视频征集';
  @ViewChild(EditorComponent) editor: EditorComponent;
  allChecked = false;
  indeterminate = true;
  cityOptions = [
    { label: '济南市', value: '370100', checked: false },
    { label: '青岛市', value: '370200', checked: false },
    { label: '淄博市', value: '370300', checked: false },
    { label: '枣庄市', value: '370400', checked: false },
    { label: '东营市', value: '370500', checked: false },
    { label: '烟台市', value: '370600', checked: false },
    { label: '潍坊市', value: '370700', checked: false },
    { label: '济宁市', value: '370800', checked: false },
    { label: '泰安市', value: '370900', checked: false },
    { label: '威海市', value: '371000', checked: false },
    { label: '日照市', value: '371100', checked: false },
    { label: '临沂市', value: '371300', checked: false },
    { label: '德州市', value: '371400', checked: false },
    { label: '聊城市', value: '371500', checked: false },
    { label: '滨州市', value: '371600', checked: false },
    { label: '菏泽市', value: '371700', checked: false },
  ];
  citySelect = [];
  _indeterminate=false;
  _allChecked =false;
  imgfile;
  constructor(
    private _message: NzMessageService,
    private modal: NzModalRef,
    private httpService: HttpService,
    private datePipe: DatePipe,
    private method:Method,
  ) { }

  ngOnInit() {
  }
  save(){
    this.publishTopic(); //编辑器调用方法
    this.citySelect=[];
    this.cityOptions.forEach(item=>{
      if(item.checked){
        this.citySelect.push(item.value)
      }
    });
    if(this.actType == 0){
      this.changeType();
    }else if(this.actType == 1){
      this.update();
    }

  }
  copyPath(){
    this._message.success('复制成功');
  }
  changeType(){
    let postStr;
    if(this.imgBanner &&this.imgPath &&this.actName &&this.endtime){
      if(this.uploadType =='视频征集'){
        postStr =  {
          thumbnail:this.imgPath,
          banner:this.imgBanner,
          name:this.actName,
          activityEndTime: this.method.timeChange(this.endtime, 6),
          description:this.editorContent,
          coverage:JSON.stringify(this.citySelect),
          type: this.uploadType,
          format:'mp4,',
          retransmit:'1',
          numberOfWorks:1,
          ispublic:true,
          publicHide:true,
          publicContent:'全部审核通过的作品',
          size:500,
          limitVideoTime:120,
          scoringSettings:'十分制，保留两位小数'
        };
      }else{
        postStr =  {
          thumbnail:this.imgPath,
          banner:this.imgBanner,
          name:this.actName,
          activityEndTime: this.method.timeChange(this.endtime, 6),
          description:this.editorContent,
          coverage:JSON.stringify(this.citySelect),
          type: this.uploadType,
          format:'jpg,',
          retransmit:'1',
          numberOfWorks:1,
          ispublic:true,
          publicHide:true,
          publicContent:'全部审核通过的作品',
          size:20,
          scoringSettings:'十分制，保留两位小数'
        };
      }
      this.addAct(postStr);
    }else{
      this._message.error('请填写完整信息');
    }


  }
  addAct(postStr){
    // let postStr =  {
    //   thumbnail:this.imgPath,
    //   banner:this.imgBanner,
    //   name:this.actName,
    //   activityEndTime: this.method.timeChange(this.endtime, 6),
    //   description:this.editorContent,
    //   coverage:JSON.stringify(this.citySelect),
    //   type: this.uploadType
    // };
    this.httpService.post(appApis.onlineAct_add.url,postStr ,
      data => {
        if (data.code == 1){
          this.modal.destroy({ success: true });
          this._message.success('操作成功');
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  update(){
    let postStr =  {
      id:this.actId,
      thumbnail:this.imgPath,
      banner:this.imgBanner,
      name:this.actName,
      activityEndTime:this.method.timeChange(this.endtime, 6),
      description:this.editorContent,
      coverage:JSON.stringify(this.citySelect),
    };
    this.httpService.put(appApis.onlineAct_update.url,postStr,
      data => {
        if (data.code == 1){
          this.modal.destroy({ success: true });
          this._message.success('操作成功');
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  cancel(){
    this.modal.destroy();
  }
  //==========上传图片====================
  //上传完成图片
  retImg(event){
    console.log(event);
    this.imgPath =this.aliUrl+ event;
  }
  retBanner(event){
    this.imgBanner =this.aliUrl+ event;
  }
  refile(event){
    this.imgfile=this.aliUrl+ event;
    // console.log(this.imgfile);
  }
  //===============编辑器==================
  publishTopic() {
    this.editor.clickHandle();
  }
  PostData(event):void {
    this.editorContent = event;
  }
//  ==========选择框=============
  updateAllChecked(value) {
    this.indeterminate = false;
    if (value) {
      this.cityOptions.forEach(data => data.checked = true);
    } else {
      this.cityOptions.forEach(data => data.checked = false);
    }
    this.updateSingleChecked();
  }

  updateSingleChecked(): void {
    const allChecked = this.cityOptions.every(value => value.checked === true);
    const allUnChecked = this.cityOptions.every(value => !value.checked);
    this._allChecked = allChecked;

    this._indeterminate = (!allChecked) && (!allUnChecked);
    // this._disabledButton = !this.options.some(value => value.checked);
  }
}
