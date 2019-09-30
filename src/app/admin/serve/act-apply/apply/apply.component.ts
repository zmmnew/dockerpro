import {Component, Input, OnInit} from '@angular/core';
import {REGION_IMG, REGION_VIDEO} from '../../../../common/constant/region';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {HttpService} from '../../../../common/service/http-service.service';
import {appApis} from '../../../../common/constant/apis';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {
  actInfo;
  applyId;
  @Input() set info(value){
    if(value){
      this.actInfo = value;
      this.findApply();
      this.actname = value.name;
      if(value.type == '图片征集'){
        this.actname = '内部征集';
        this.regionBox =REGION_IMG;
      }else{
        this.actname = '少儿大赛';
        this.regionBox =REGION_VIDEO;
      }
    }
  };
  actname;
  regionBox = [];
  selregion;
  constructor(
    private _message: NzMessageService,
    private modal: NzModalRef,
    private httpService: HttpService,
    ) { }

  ngOnInit() {
  }

  save(){
    if(this.applyId){
      this.update();
    }else{
      this.apply();
    }

  }
  findApply(){
    let postStr =  {
      "userAdminId":localStorage.getItem('adminid'),
      "activityOnlineId":this.actInfo.id,
    };
    this.httpService.post(appApis.find_actapply.url,postStr ,
      data => {
        if (data.code == 1){
          if(data.data !==null){
            this.applyId = data.data.id;
            this.selregion = data.data.region;
          }
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  apply(){
    let postStr =  {
      "userAdminId":localStorage.getItem('adminid'),
      "activityOnlineId":this.actInfo.id,
      "region":this.selregion,
      status:'未赋权',
      role:'活动管理员'
    };
    this.httpService.post(appApis.actapply_add.url,postStr ,
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
    // console.log(this.actInfo.id);
    let postStr =  {
      id:this.applyId,
      "userAdminId":localStorage.getItem('adminid'),
      "activityOnlineId":this.actInfo.id,
      "region":this.selregion,
      status:'未赋权'
    };
    this.httpService.put(appApis.actapply_update.url,postStr ,
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
