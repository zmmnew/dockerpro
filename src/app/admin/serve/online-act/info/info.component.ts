import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {HttpService} from '../../../../common/service/http-service.service';
import {appApis} from '../../../../common/constant/apis';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  actinfo;
  @Input() set info(value){
    this.actinfo = value;
    if(value.auditSuccessNotice){this.auditSuccessNotice = true; this.mapOfCheckedId.one=true}
    if(value.auditFailNotice){this.auditFailNotice = true;  this.mapOfCheckedId.two=true}
    if(value.publicNotice){this.publicNotice = true;  this.mapOfCheckedId.three=true}
  };
  list = [
    {id:'one',condition:'作品审核通过',type:'短信+系统消息',content:'参赛者您好，您的作品《XXX》已通过审核'},
    {id:'two',condition:'作品审核不通过',type:'短信+系统消息',content:'参赛者您好，您的作品《XXX》未通过审核，请在个人中心查看详情'},
    {id:'three',condition:'作品入围且进入公示期',type:'短信+系统消息',content:'参赛者您好，您的作品《XXX》已入围，决赛信息请查看活动公告'},
  ];
  mapOfCheckedId: { [key: string]: boolean } = {};
  isAllDisplayDataChecked = false;
  isIndeterminate = false;

  auditSuccessNotice = false;
  auditFailNotice=false;
  publicNotice=false;
  constructor(
    private _message: NzMessageService,
    private modal: NzModalRef,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
  }
  refreshStatus(): void {
    // console.log(this.mapOfCheckedId);
    this.isAllDisplayDataChecked = this.list.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.list.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }
  save(){
    // console.log(this.list);
    for (let index in this.mapOfCheckedId){
      if(index == 'one'){
        if(this.mapOfCheckedId[index]){
          this.auditSuccessNotice = true;
        }else{
          this.auditSuccessNotice = false;
        }
      }
      if(index == 'two' ){
        if(this.mapOfCheckedId[index]){
          this.auditFailNotice = true;
        }else{
          this.auditFailNotice = false;
        }
      }
      if(index == 'three'){
        if(this.mapOfCheckedId[index]){
          this.publicNotice = true;
        }else{
          this.publicNotice = false;
        }
      }

    }

    let poststr = {
      id:this.actinfo.id,
      auditSuccessNotice:this.auditSuccessNotice,
      auditFailNotice:this.auditFailNotice,
      publicNotice:this.publicNotice,
    };
    this.httpService.put(appApis.onlineAct_update.url,poststr ,
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
}
