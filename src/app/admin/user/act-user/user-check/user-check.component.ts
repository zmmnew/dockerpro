import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../common/constant/apis';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {HttpService} from '../../../../common/service/http-service.service';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-user-check',
  templateUrl: './user-check.component.html',
  styleUrls: ['./user-check.component.scss']
})
export class UserCheckComponent implements OnInit {
  @Input() info;
  disabled = true;
  isVisible = false;
  reason;
  constructor(
    private modalService: NzModalService,
    private _message: NzMessageService,
    private httpService: HttpService,
    private modal: NzModalRef,
  ) { }

  ngOnInit() {
  }
  save(){
    let postStr = {
      id:this.info.id,
      status:'审核通过',
    };
    this.httpService.put(appApis.actUser_update.url, postStr,
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
    this.isVisible = true;
  }
  handleOk(){
    let postStr = {
      id:this.info.id,
      reason:this.reason,
      status:'审核不通过',
    };
    this.httpService.put(appApis.actUser_update.url, postStr,
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
  handleCancel(){
    this.reason = '';
    this.isVisible = false;
  }
}
