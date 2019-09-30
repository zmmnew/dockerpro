import { Component, OnInit } from '@angular/core';
import {ALIURL, ROOT_URL} from '../../../common/config/config';
import {AddComponent} from '../../serve/online-act/add/add.component';
import {appApis} from '../../../common/constant/apis';
import {NoteComponent} from '../../serve/online-act/note/note.component';
import {HttpService} from '../../../common/service/http-service.service';
import {Method} from '../../../common/service/method';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {PremissComponent} from './premiss/premiss.component';
import {RoleAddComponent} from './role-add/role-add.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  page = {
    total:1,
    index:1,
    size:15
  };
  rolelist =[];
  rolename;
  loading = false;
  addCompt = RoleAddComponent;
  premissCompt = PremissComponent;
  constructor(
    private modalService: NzModalService,
    private _message: NzMessageService,
    private httpService: HttpService,
    private method:Method,
  ) { }

  ngOnInit() {
    this.getRolePage();
  }
  reset(){
    this.rolename='';
    this.getRolePage();
  }
  pageSizeChange() {
    this.loading = true;
    setTimeout(()=>{
      this.getRolePage();
    },500)
  }
  getRolePage(){
    this.loading = true;
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      orderBy:'createTime desc',
      params:{
        name:this.rolename,
      }
    };
    this.httpService.post(appApis.role_page.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.page.total = data.data.total;
          this.rolelist = data.data.list;
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  publish(info){
    if(info.copyrightInformation&&info.guideTitile&&info.guideContent){
      this.modalService.confirm({
        nzTitle: '你确定发布该活动吗',
        nzOnOk: () => this.surePub(info.id)
      });
    }else{
      this._message.error('活动发布前需填写报名指南和版权信息');
    }

  }
  surePub(id){
    let postStr = {
      id:id,
      status:'预告中'
    };
    this.httpService.put(appApis.onlineAct_update.url, postStr,
      data => {
        if (data.code == 1){
          this.getRolePage();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  showModal(tit,componet,type,info){
    const modal = this.modalService.create({
      nzTitle:tit,
      nzWidth:700,
      nzContent: componet,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        type:type,
        info:info
      }
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.success){
        this.getRolePage();
      }
    });
  }
  fileDelet(id){
    this.httpService.delete(appApis.role_delete.url+'/'+id,
      data => {
        this.loading = false;
        if (data.code == 1){
          this._message.success('操作成功');
          this.getRolePage();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
}
