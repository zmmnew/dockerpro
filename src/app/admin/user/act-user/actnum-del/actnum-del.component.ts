import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../common/constant/apis';
import {HttpService} from '../../../../common/service/http-service.service';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {UpdateActnumComponent} from './update-actnum/update-actnum.component';

@Component({
  selector: 'app-actnum-del',
  templateUrl: './actnum-del.component.html',
  styleUrls: ['./actnum-del.component.scss']
})
export class ActnumDelComponent implements OnInit {
  @Input() type;
  statusType;
  @Input() info;
  deleteValue;
  isVisible=false;
  loading = true;
  page = {
    total:1,
    index:1,
    size:15
  };
  applyJson;
  pagelist = [];
  constructor(
    private modalService: NzModalService,
    private _message: NzMessageService,
    private httpService: HttpService,
    private modal: NzModalRef,
  ) { }

  ngOnInit() {
    if(this.type == 1){
      this.statusType = '未赋权';
    }else if(this.type == 2){
      this.statusType = '已赋权';
    }else{
      this.statusType = '已驳回';
    }
    this.getPage();
  }
  getPage(){
    this.loading = true;
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      params:{
        "userAdminId": this.info.id,
        "status": this.statusType
      }
    };
    this.httpService.post(appApis.adminapplyAct.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.page.total = data.data.total;
          this.pagelist = data.data.list;
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  act_update(info){
    this.modalService.confirm({
      nzTitle: '<p>你确定要为该活动赋权吗？</p>',
      nzOnOk: () => this.updateHttp(info)
    });
  }
  updateHttp(info){
    let postStr = {
      id:info.id,
      activityOnlineId:info.activityOnlineId,
      userAdminId:info.userAdminId,
      status:'已赋权',
      role:'活动管理员'
    };
    this.httpService.put(appApis.actUser_admin_update.url, postStr,
      data => {
        this.loading = false;
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
  notAgree(info){
    this.applyJson = info;
    this.isVisible = true;
  }
  handleCancel(){
    this.isVisible =false;
    this.applyJson = {};
  }
  noagreeHttp(){
    let postStr = {
      id:this.applyJson.id,
      activityOnlineId:this.applyJson.activityOnlineId,
      userAdminId:this.applyJson.userAdminId,
      status:'已驳回',
      reason:this.deleteValue
    };
    this.httpService.put(appApis.actUser_admin_update.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.isVisible = false;
          this.getPage();
          this._message.success('操作成功');
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  open(info){
    const modal = this.modalService.create({
      nzTitle:'修改',
      nzWidth:650,
      nzContent: UpdateActnumComponent,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        info:info,
      }
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.success){
        this.getPage();
      }
    });
  }
}
