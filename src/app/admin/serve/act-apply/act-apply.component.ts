import { Component, OnInit } from '@angular/core';
import {appApis} from '../../../common/constant/apis';
import {Method} from '../../../common/service/method';
import {HttpService} from '../../../common/service/http-service.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ApplyComponent} from './apply/apply.component';
import {UploadActComponent} from './upload-act/upload-act.component';

@Component({
  selector: 'app-act-apply',
  templateUrl: './act-apply.component.html',
  styleUrls: ['./act-apply.component.scss']
})
export class ActApplyComponent implements OnInit {
  page = {
    total:1,
    index:1,
    size:15
  };
  actlist =[];
  actStauts =['全部','准备中','预告中','报名中','评审中','结束'];
  statusValue='全部';
  apply =['全部','未申请','待赋权','已驳回','已赋权'];
  applyValue='全部';
  actname;
  selectTime;
  loading = false;
  applyCompt = ApplyComponent;
  uploadCompt = UploadActComponent;
  constructor(
    private modalService: NzModalService,
    private _message: NzMessageService,
    private httpService: HttpService,
    private method:Method,
  ) { }

  ngOnInit() {
    this.getActPage();
  }
  reset(){
    this.actname='';
    this.selectTime ='';
    this.statusValue = '全部';
    this.applyValue = '全部';
    this.getActPage();
  }
  pageSizeChange() {
    this.loading = true;
    setTimeout(()=>{
      this.getActPage();
    },500)
  }
  getActPage(){
    this.loading = true;
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      orderBy:'createTime desc',
      params:{
        userAdminId:localStorage.getItem('adminid'),
        name:this.actname,
        activityStartTime:this.selectTime?this.method.timeChange(this.selectTime[0],6):'',
        activityEndTime:this.selectTime?this.method.timeChange(this.selectTime[1],6):'',
        status:this.statusValue == '全部'?'':this.statusValue,
        applyStatus:this.applyValue == '全部'?'':this.applyValue,
      }
    };
    this.httpService.post(appApis.actapply_page.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.page.total = data.data.total;
          this.actlist = data.data.list;
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }

  showModal(tit,compt,info,width){
    const modal = this.modalService.create({
      nzTitle:tit,
      nzWidth:width,
      nzContent: compt,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        info:info,
      },
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.success){
        this.getActPage();
      }
    });
  }

}
