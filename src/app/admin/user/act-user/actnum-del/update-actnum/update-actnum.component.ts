import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../../common/constant/apis';
import {HttpService} from '../../../../../common/service/http-service.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-update-actnum',
  templateUrl: './update-actnum.component.html',
  styleUrls: ['./update-actnum.component.scss']
})
export class UpdateActnumComponent implements OnInit {
  @Input() info;
  rolelist;
  roleId;
  constructor(
    private _message: NzMessageService,
    private httpService: HttpService,
    private modal: NzModalRef,
  ) { }

  ngOnInit() {
    this.getRolePage();
  }
  getRolePage(){
    let postStr = {
      current:1,
      size:50,
      orderBy:'createTime desc',
      params:{}
    };
    this.httpService.post(appApis.role_page.url, postStr,
      data => {
        if (data.code == 1){
          this.rolelist = data.data.list;
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  giveRole(){
    let postStr = {
      id:this.info.id,
      activityOnlineId:this.info.activityOnlineId,
      userAdminId:this.info.userAdminId,
      status:'已赋权',
      roleId:this.roleId
    };
    this.httpService.put(appApis.actUser_admin_update.url, postStr,
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
