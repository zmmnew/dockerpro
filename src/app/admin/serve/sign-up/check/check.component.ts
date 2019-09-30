import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../common/constant/apis';
import {HttpService} from '../../../../common/service/http-service.service';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {ALIURL} from '../../../../common/config/config';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {
  @Input() info;
  @Input() type;
  deleteValue;
  isVisible = false;
  aliURL = ALIURL;
  constructor(
    private _message: NzMessageService,
    private httpService: HttpService,
    private modal: NzModalRef,
  ) { }

  ngOnInit() {
    // console.log(this.info);
  }
  save(status){
    let postStr =  {
      id:this.info.id,
      worksStats:'审核通过',
      mobile:this.info.mobile,
      userId:this.info.userId,
      name:this.info.name,
      activityOnlineId:this.info.activityOnlineId
    };
    this.httpService.put(appApis.upload_update.url,postStr,
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
  nopass(){
    this.isVisible = true;
  }
  handleCancel(){
    this.isVisible = false;
    this.deleteValue = '';
  }
  handleOk(){
    let postStr =  {
      id:this.info.id,
      worksStats:'审核不通过',
      reason:this.deleteValue,
      mobile:this.info.mobile,
      userId:this.info.userId,
      name:this.info.name,
      activityOnlineId:this.info.activityOnlineId
    };
    this.httpService.put(appApis.upload_update.url,postStr,
      data => {
        if (data.code == 1){
          this.isVisible = false;
          this.deleteValue = '';
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
}
