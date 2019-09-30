import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../common/constant/apis';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {DatePipe} from '@angular/common';
import {HttpService} from '../../../../common/service/http-service.service';
import {Method} from '../../../../common/service/method';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
  roleName;
  roleId;
  @Input() type;
  @Input() set info(value){
    this.roleName = value.name;
    this.roleId =  value.id;
  };
  constructor(
    private _message: NzMessageService,
    private modal: NzModalRef,
    private httpService: HttpService,
    private method:Method,
  ) { }

  ngOnInit() {
  }
  save(){
    if(this.roleName){
      if(this.type == 0){
        this.addRole();
      }else if(this.type == 1){
        this.uploadRole();
      }
    }else{
      this._message.error('请填写完整信息');
    }
  }
  addRole(){
    let postStr =  {
      name:this.roleName
    };
    this.httpService.post(appApis.role_add.url,postStr ,
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
  uploadRole(){
    let postStr =  {
      id:this.roleId,
      name:this.roleName
    };
    this.httpService.put(appApis.role_update.url,postStr ,
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
