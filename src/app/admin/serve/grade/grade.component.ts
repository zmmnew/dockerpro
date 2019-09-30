import { Component, OnInit } from '@angular/core';
import {ApplyComponent} from '../act-apply/apply/apply.component';
import {Method} from '../../../common/service/method';
import {HttpService} from '../../../common/service/http-service.service';
import {UploadActComponent} from '../act-apply/upload-act/upload-act.component';
import {appApis} from '../../../common/constant/apis';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {AddGradeComponent} from './add-grade/add-grade.component';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit {
  page = {
    total:1,
    index:1,
    size:15
  };
  actdel;
  userInfo;
  zuolist =[];
  selact = '图片征集';
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
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // console.log(this.userInfo);
    this.getactdel();
    this.findActName();
    this.getPage();
  }
  getactdel(){
    this.httpService.get(appApis.actDelbyid.url+'/'+ this.userInfo.activityOnlineId,
      data => {
        if (data.code == 1){
          if(data.data){
            this.selact = data.data.type;
          }

        }
      },
      error => {
        console.error(error);
      });
  }
  reset(){
    this.actname='';
    this.selectTime ='';
    this.statusValue = '全部';
    this.applyValue = '全部';
    this.getPage();
  }
  pageSizeChange() {
    this.loading = true;
    setTimeout(()=>{
      this.getPage();
    },500)
  }
  findActName(){
    this.httpService.get(appApis.actDelbyid.url+'/'+ JSON.parse(localStorage.getItem('userInfo')).activityOnlineId,
      data => {
        if (data.code == 1){
          this.actdel = data.data;
        }
      },
      error => {
        console.error(error);
      });
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
      orderBy:'starMark desc,createTime desc',
      params:{
        activityOnlineId:JSON.parse(localStorage.getItem('userInfo')).activityOnlineId,
        region:this.userInfo.region,
        userId:localStorage.getItem('adminid')

      }
    };
    this.httpService.post(appApis.grade_zuopinPage.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1 && data.data){
          this.page.total = data.data.total;
          this.zuolist = data.data.list;
        }
      },
      error => {
        console.error(error);
      });
  }


  showModal(tit,info,type){
    const modal = this.modalService.create({
      nzTitle:tit,
      nzWidth:700,
      nzContent: AddGradeComponent,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        info:info,
        type:type
      },
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.success){
        this.getPage();
      }
    });
  }
}
