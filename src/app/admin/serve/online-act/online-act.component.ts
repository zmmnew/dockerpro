import { Component, OnInit } from '@angular/core';
import {ALIURL, ROOT_URL} from '../../../common/config/config';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {HttpService} from '../../../common/service/http-service.service';
import {AddComponent} from './add/add.component';
import {appApis} from '../../../common/constant/apis';
import {NoteComponent} from './note/note.component';
import {SettingComponent} from './setting/setting.component';
import {Method} from '../../../common/service/method';
import {ActadminComponent} from './actadmin/actadmin.component';
import {Md5} from 'ts-md5';
import {InfoComponent} from './info/info.component';

@Component({
  selector: 'app-online-act',
  templateUrl: './online-act.component.html',
  styleUrls: ['./online-act.component.scss']
})
export class OnlineActComponent implements OnInit {
  rootUrl: string = ROOT_URL;
  deleteValue;
  page = {
    total:1,
    index:1,
    size:15
  };
  actlist =[];
  actStauts =['全部','准备中','预告中','报名中','评审中','结束'];
  statusValue='全部';
  actOff =[
    {label:'全部',value:'all'},
    {label:'已下线',value:true},
    {label:'未下线',value:false},
  ];
  admin = [
    {label:'全部',value:'all'},
    {label:'已绑定',value:1},
    {label:'未绑定',value:0},
  ];
  adminValue = 'all';
  offValue='all';
  deleteid;
  actname;
  // selectTime;
  loading = false;
  addAct = AddComponent;
  noteCompt = NoteComponent;
  setCompt = SettingComponent;
  actadmin=ActadminComponent;
  infoCompt = InfoComponent;
  isVisible = false;
  stopVisible = false;
  private aliUrl: string = ALIURL;
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
    // this.selectTime ='';
    this.statusValue = '全部';
    this.offValue = 'all';
    // this.adminValue = 'all';
    this.getActPage();
  }
  pageSizeChange() {
    this.loading = true;
    setTimeout(()=>{
      this.getActPage();
    },500)
  }
  getActPage(){
    // console.log(this.adminValue);
    this.loading = true;
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      orderBy:'createTime desc',
      params:{
        name:this.actname,
        // activityStartTime:this.selectTime?this.method.timeChange(this.selectTime[0],6):'',
        // activityEndTime:this.selectTime?this.method.timeChange(this.selectTime[1],6):'',
        status:this.statusValue == '全部'?'':this.statusValue,
        offline:this.offValue == 'all'?'':this.offValue,
        // hasAdmin:this.adminValue == 'all'?'':this.adminValue,
      }
    };
    this.httpService.post(appApis.onlineAct_page.url, postStr,
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
  publish(info){
    if(info.uploadStartTime && info.publicStartTime && info.reviewStartTime){
      if(info.copyrightInformation&&info.guideTitile&&info.guideContent){
        this.modalService.confirm({
          nzTitle: '你确定发布该活动吗',
          nzOnOk: () => this.surePub(info)
        });
      }else{
        this._message.error('活动发布前需填写报名指南和版权信息',{nzDuration: 5000});
      }
    }else{
      this._message.error('活动发布前需填写报名报名时间、评审时间和公示时间',{nzDuration: 5000});
    }


  }
  surePub(info){
    // if()
    let postStr = {
      id:info.id,
      publicStatus:true,
      status:'预告中'
    };
    this.httpService.put(appApis.onlineAct_update.url, postStr,
      data => {
        if (data.code == 1){
          this.getActPage();
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
      nzWidth:750,
      nzContent: componet,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        type:type,
        info:info,
        covery:info.coverage
      },
      nzOnCancel: () => this.getActPage()
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.success){
        this.getActPage();
      }
    });
  }
  actdet(id){
    this.isVisible = true;
    this.deleteid = id;
  }
  handleOk(){
    if(Md5.hashStr(this.deleteValue) == localStorage.getItem('userpw')){
      this.deleteact();
    }else{
      this._message.error('您输入的密码有误');
    }
  }
  handleCancel(){
    this.isVisible = false;
    this.deleteid = '';
    this.deleteValue = '';
  }
  deleteact(){
    this.httpService.delete(appApis.onlineAct_delete.url+'/'+this.deleteid,
      data => {
        if (data.code == 1){
          this._message.success('删除成功');
          this.isVisible = false;
          this.deleteid = '';
          this.deleteValue = '';
          this.getActPage();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  actStop(id){
    this.modalService.confirm({
      nzTitle: '活动下线后无法恢复，您确定继续下线吗？',
      nzOnOk: () => this.stop(id,1),
    });
  }
  stop(id,index){
    let putStr={
      id:id,
      offline:true,
      preserve:index
    };
    this.httpService.put(appApis.onlineAct_stop.url,putStr,
      data => {
        if (data.code == 1){
          this._message.success('操作成功');
          this.getActPage();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
}
