import { Component, OnInit } from '@angular/core';
import {appApis} from '../../../common/constant/apis';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {HttpService} from '../../../common/service/http-service.service';
import {Method} from '../../../common/service/method';
import {Md5} from 'ts-md5';
import {UserCheckComponent} from './user-check/user-check.component';
import {ActnumDelComponent} from './actnum-del/actnum-del.component';

@Component({
  selector: 'app-act-user',
  templateUrl: './act-user.component.html',
  styleUrls: ['./act-user.component.scss']
})
export class ActUserComponent implements OnInit {
  pagelist=[];
  loading;
  page = {
    total:1,
    index:1,
    size:15
  };
  username;
  Stauts=['全部','未审核','审核通过','审核不通过','已停用'];
  statusValue = '全部';
  checkCompt = UserCheckComponent;
  actnumCompt = ActnumDelComponent;
  constructor(
    private modalService: NzModalService,
    private _message: NzMessageService,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.getPage();
  }
  reset(){
    this.username='';
    this.statusValue = '全部';
    this.getPage();
  }
  pageSizeChange(){
    setTimeout(()=>{this.getPage();},500)
  }
  getPageone(){
    this.page.index = 1;
    this.getPage();
  }
  getPage(){
    this.loading = true;
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      orderBy:'createTime desc',
      params:{
        name:this.username,
        role: "活动管理员",
        status:this.statusValue=='全部'?'':this.statusValue
      }
    };
    this.httpService.post(appApis.actUser_admin.url, postStr,
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
  showModal(tit,compt,type,info){
    const modal = this.modalService.create({
      nzTitle:tit,
      nzWidth:700,
      nzContent: compt,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        info:info,
        type:type
      }
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.success){
        this.getPage();
      }
    });
  }
  sureRepw(info){
    this.modalService.confirm({
      nzTitle: '<p>你确定将该管理员密码重置为123456吗？</p>',
      nzOnOk: () => this.repw(info.id)
    });
  }
  repw(id){
    let postStr = {
      id:id,
      password:Md5.hashStr('123456'),
    };
    this.httpService.put(appApis.actUser_update.url,postStr,
      data => {
        if (data.code == 1){
          this._message.success('操作成功');
          this.getPage();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  sureStop(info){
    this.modalService.confirm({
      nzTitle: '<p>你确定停用该管理员吗？</p>',
      nzOnOk: () => this.stopUser(info)
    });
  }
  sureOpen(info){
    this.modalService.confirm({
      nzTitle: '<p>你确定启用该管理员吗？</p>',
      nzOnOk: () => this.stopUser(info)
    });
  }
  stopUser(info){
    // console.log(info.deleted);
    let postStr = {
      id:info.id,
      deleted:info.deleted==1?0:1,
    };
    this.httpService.put(appApis.actUser_update.url,postStr,
      data => {
        if (data.code == 1){
          this._message.success('操作成功');
          this.getPage();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  sureDelete(info){
    this.modalService.confirm({
      nzTitle: '<p>该管理员绑定了如下活动，删除后绑定的活动将会自动解除，确定继续删除吗？</p>',
      nzContent: '<b>'+info.name+'</b>',
      nzOnOk: () => this.delete(info.id)
    });
  }
  delete(id){
    this.httpService.delete(appApis.actUser_delete.url+'/'+id,
      data => {
        if (data.code == 1){
          this._message.success('操作成功');
          this.getPage();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
}
