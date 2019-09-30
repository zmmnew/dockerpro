import {Component, Input, OnInit} from '@angular/core';
import {REGION_IMG, REGION_VIDEO} from '../../../../../../common/constant/region';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {HttpService} from '../../../../../../common/service/http-service.service';
import {appApis} from '../../../../../../common/constant/apis';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-add-ex',
  templateUrl: './add-ex.component.html',
  styleUrls: ['./add-ex.component.scss']
})
export class AddExComponent implements OnInit {
  @Input() type;
  expId;
  actInfo;
  @Input() set info(value){
    this.expId =value.id;
    this.ename =value.name;
    this.zhang =value.mobile;
    this.unitName = value.region;
  };
  @Input() set act(value){
    // console.log(value);
      this.actInfo = value;
      if(value.type == '视频征集'){
        this.region =REGION_VIDEO;
      }else{
        this.region = REGION_IMG;
      }
  };
  region=[];
  unitName;
  disabled = false;
  ename='';
  zhang;
  pw;
  constructor(private _message: NzMessageService,private modal: NzModalRef,private httpService: HttpService,) { }

  ngOnInit() {
  }
  save(){
    if(this.type == 0){
      if(this.ename&& this.zhang&&this.pw&&this.unitName){
        this.add();
      }else{
        this._message.success('请填写完整信息');
      }
    }else{
      if(this.ename&& this.zhang){
        this.update();
      }else{
        this._message.success('请填写完整信息');
      }
    }

  }
  add(){
    let region = this.unitName;
    let postStr =  {
      name:this.ename,
      mobile:this.zhang,
      // unitName:region[region.length-1].split(',')[1],
      password:Md5.hashStr(this.pw),
      region:this.unitName,
      role:'专家',
      activityOnlineId:this.actInfo.id,
      status:'审核通过'
    };
    this.httpService.post(appApis.userAdminAdd.url,postStr ,
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
    let region = this.unitName;
    let postStr =  {
      id:this.expId,
      name:this.ename,
      mobile:this.zhang,
      region:this.unitName,
    };
    this.httpService.put(appApis.userAdminUpdate.url,postStr ,
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
