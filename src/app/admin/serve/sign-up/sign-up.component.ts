import { Component, OnInit } from '@angular/core';
import {Md5} from 'ts-md5';
import {appApis} from '../../../common/constant/apis';
import {Method} from '../../../common/service/method';
import {HttpService} from '../../../common/service/http-service.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {CheckComponent} from './check/check.component';
import {AuthorListComponent} from './author-list/author-list.component';
import { saveAs } from "file-saver";
import {GradeListComponent} from './grade-list/grade-list.component';
import * as Http from 'http';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  checkCompt = CheckComponent;
   authCompt = AuthorListComponent;
  gradeCompt = GradeListComponent;
  downurl;
  page = {
    total:1,
    index:1,
    size:15
  };
  zuolist =[];
  userInfo;
  selact;
  zuoStauts =['全部','待审核','审核通过','审核不通过','已入围'];
  starStauts = [
    {label:'全部',value:'全部'},{label:'是',value:1},{label:'否',value:0}
  ];
  starStautsvalue='';
  starValue='全部';
  statusValue='全部';
  apply =['全部','未申请','待赋权','已驳回','已赋权'];
  applyValue='全部';
  actname='';
  selectTime;
  loading = false;
  isVisible=false;
  deleteid;
  deleteValue;
  applyRegion;
  adminapplylist;
  isregion = false;
  regionlist = ['全部','烟台赛区','淄博赛区','枣庄赛区'];
  groupValue ='全部';
  groupStauts = ['全部','6-9岁','10-12岁'];
  participationValue ='全部';
  groupparticipation = ['全部','个人','组合'];

  selregion='全部';
  sortValue: string | null = 'desc';
  sortKey: string | null = 'createTime';
  acttype;
  constructor(
    private modalService: NzModalService,
    private _message: NzMessageService,
    private httpService: HttpService,
    private method:Method,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo.id == 1){
      this.getActPage();
    }else{
      this.isregion = true;
      this.getAdminapplyPage();
    }

  }
  sort(sort: { key: string; value: string }): void {

    this.sortKey = sort.key;
    this.sortValue = sort.value;
    console.log(this.sortKey );
    console.log(this.sortKey );
    
    this.getPage();
  }
  reset(){
    this.page.index = 1;
    this.actname='';
    this.selectTime ='';
    this.statusValue = '全部';
    this.selregion = '全部';
    this.applyValue = '全部';
    this.groupValue = '全部';
    this.participationValue = '全部';
    this.starValue = '全部';
    this.getPage();
  }
  pageSizeChange() {
    this.loading = true;
    setTimeout(()=>{
      this.getPage();
    },500)
  }
  getActPage(){
    this.loading = true;
    let postStr = {
      current:1,
      size:20,
      orderBy:'createTime desc',
      params:{ }
    };
    this.httpService.post(appApis.onlineAct_page.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.adminapplylist = data.data.list;
          this.selact = this.adminapplylist[0].id;
          this.acttype = this.adminapplylist[0].type;
          this.getPage();
        }
      },
      error => {
        console.error(error);
      });
  }
  getAdminapplyPage(){
    let postStr = {
      current:1,
      size:20,
      params:{
        "userAdminId": localStorage.getItem('adminid'),
        "status": '已赋权'
      }
    };
    this.httpService.post(appApis.adminapplyAct.url, postStr,
      data => {
        if (data.code == 1){
          this.adminapplylist = data.data.list;
          this.selact = this.adminapplylist[0].activityOnlineId;
          this.acttype = this.adminapplylist[0].activityType;
          this.applyRegion = this.adminapplylist[0].region;
          this.getPage();
        }
      },
      error => {
        console.error(error);
      });
  }
  selchange(){
    // console.log( this.adminapplylist);
    if(this.userInfo.id != 1){
      this.adminapplylist.forEach((item,index)=>{
        if(item.activityOnlineId == this.selact){
          this.acttype = item.activityType;
          this.applyRegion = this.adminapplylist[index].region;

        }
      });
    }else{
      // console.log('111');
      // this.isregion = false;
      this.adminapplylist.forEach((item,index)=>{
        if(item.id == this.selact){
          this.acttype = item.type
        }
      });
    }
    // console.log( this.adminapplylist);
    // console.log(this.selact);
    // console.log(this.acttype);
    this.getPage();
  }
  getPageone(){
    this.page.index = 1;
    this.getPage();
  }
  getPage(){
    this.loading = true;
    let postStr;
    console.log(this.sortKey);
    if(this.sortValue=='ascend'){
      this.sortValue='asc'
    }
    if(this.sortValue=='descend'){
      this.sortValue='desc'
    }
    if(this.sortValue==null){
      this.sortValue='desc';
      this.sortKey = 'createTime';
    }
 
    if(this.starValue == '全部'?'':this.starValue =='1'){
      this.starStautsvalue='starMark desc,';
    }else{
      this.starStautsvalue=''
    }
 
    if(this.userInfo.id == 1){
      postStr = {
        current:this.page.index,
        size:this.page.size,
        orderBy:this.starStautsvalue+this.sortKey+' '+this.sortValue,
        params:{
          worksStats:this.statusValue == '全部'?'':this.statusValue,
          name:this.actname,
          group:this.groupValue == '全部'?'':this.groupValue,
          groupType: this.participationValue == '全部'?'':this.participationValue,
          region:this.selregion == '全部'?'':this.selregion,
          starMark:this.starValue == '全部'?'':this.starValue,
          activityOnlineId:this.selact
        }
      };
    }else{
      postStr = {
        current:this.page.index,
        size:this.page.size,
        orderBy:'starMark desc,'+this.sortKey+' '+this.sortValue ,
        params:{
          worksStats:this.statusValue == '全部'?'':this.statusValue,
          starMark:this.starValue == '全部'?'':this.starValue,
          group:this.groupValue == '全部'?'':this.groupValue,
          groupType: this.participationValue == '全部'?'':this.participationValue,
          name:this.actname,
          region:this.applyRegion,
          activityOnlineId:this.selact
        }
      };
    }
    this.httpService.post(appApis.zuopin_page.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.page.total = data.data.total;
          this.zuolist = data.data.list;
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
      },
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.success){
        this.getPage();
      }
    });
  }

  win(info){
    this.modalService.confirm({
      nzTitle: '你确定入围所选作品吗',
      nzOnOk: () => this.winHttp(info,'已入围')
    });
  }
  clearWin(info){
    this.modalService.confirm({
      nzTitle: '你确定撤销该入围作品吗',
      nzOnOk: () => this.winHttp(info,'审核通过')
    });
  }
  winHttp(info,status){
    let postStr =  {
      id:info.id,
      worksStats:status,
      mobile:info.mobile,
      userId:info.userId,
      name:info.name,
      activityOnlineId:info.activityOnlineId
    };
    this.httpService.put(appApis.upload_update.url,postStr,
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
  signDelete(id){
    this.isVisible = true;
    this.deleteid = id;
  }
  handleOk(){
    if(Md5.hashStr(this.deleteValue) == localStorage.getItem('userpw')){
      this.deleteHttp();
    }else{
      this._message.error('您输入的密码有误');
    }
  }
  handleCancel(){
    this.isVisible = false;
    this.deleteid = '';
    this.deleteValue = '';
  }

  deleteHttp(){
    this.httpService.delete(appApis.upload_delete.url+'/'+this.deleteid,
      data => {
        if (data.code == 1){
          this._message.success('删除成功');
          this.isVisible = false;
          this.deleteid = '';
          this.deleteValue = '';
          this.getPage();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  setstar(id,num){
    let poststr = {
      id:id,
      starMark:num
    };
    this.httpService.put(appApis.starSett.url,poststr,
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
  export() {
    if(this.zuolist.length>0){
      let postStr;
      if (this.userInfo.id == 1) {
        let statusValue = this.statusValue == '全部' ? '' : this.statusValue;
        let starValue = this.starValue == '全部' ? '' : this.starValue;
        // star:this.starStauts == '全部'?'':this.starStauts,
        let groupValue=this.groupValue == '全部'?'':this.groupValue;
        let groupType=this.participationValue == '全部'?'':this.participationValue;
        let selregion = this.selregion == '全部' ? '' : this.selregion;
        postStr = 'orderBy=' + 'starMark desc,'+this.sortKey + ' ' + this.sortValue + '&worksStats=' + statusValue+'&group=' + groupValue +'&groupType=' + groupType+ '&activityOnlineId=' + this.selact + '&name=' + this.actname + '&region=' + selregion + '&starMark=' + starValue;
      } else {
        let groupValue=this.groupValue == '全部'?'':this.groupValue;
        let groupType=this.participationValue == '全部'?'':this.participationValue;
        let statusValue = this.statusValue == '全部' ? '' : this.statusValue;
        let starValue = this.starValue == '全部' ? '' : this.starValue;
        let selregion = this.selregion == '全部' ? '' : this.selregion;
        postStr = 'orderBy=' + 'starMark desc,'+this.sortKey + ' ' + this.sortValue + '&worksStats=' + statusValue +'&group=' + groupValue+'&groupType=' + groupType+ '&activityOnlineId=' + this.selact + '&name=' + this.actname + '&region=' + this.applyRegion + '&starMark=' + starValue;
      }
      console.log(postStr);
      window.open(appApis.exportExcel.url + '?' + postStr);
    }else{
      this._message.error('没有数据无法导出');
    }

  }

}
