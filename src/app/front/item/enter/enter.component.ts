import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {appApis} from '../../../common/constant/apis';
import {ItemService} from '../item.service';
import {HttpService} from '../../../common/service/http-service.service';
import {Router} from '@angular/router';
import {LoginBoxComponent} from '../../layout/login-box/login-box.component';

@Component({
  selector: 'app-enter',
  templateUrl: './enter.component.html',
  styleUrls: ['./enter.component.scss']
})
export class EnterComponent implements OnInit {
  frontInfo;
  multipleValue;
  selAge=1;
  isSpinning = false;
  cityOfOption=['淄博赛区','烟台赛区','枣庄赛区'];
  step=1;
  group = [{id:1,name:'6-9岁'},{id:2,name:'10-12岁'}];
  selgroup = '6-9岁';
  zuoId;
  actId;
  actdel;
  openImg = 2;
  constructor(
    private _message: NzMessageService,
    private itemService:ItemService,
    private httpService: HttpService,
    private router:Router,
    private modalService: NzModalService
    ) {
    if(this.itemService.itemId){
      this.actId = this.itemService.itemId;
    }else{
      this.actId = localStorage.getItem('actId');
      this.itemService.sendMessage(this.actId);
      this.itemService.itemId = this.actId;
    }
    // this.getDel();
  }

  ngOnInit() {
    scroll(0,0);
    this.frontInfo = JSON.parse(localStorage.getItem('frontUserInfo'));
    this.getDel();
  }
  getDel(){
    this.isSpinning = true;
    this.httpService.get(appApis.actDelbyid.url+'/'+ this.actId,
      data => {
         this.isSpinning = false;
        if (data.code == 1){
          if(data.data){
            this.actdel = data.data;
            if(!data.offline){
              if(data.data.status == '预告中'){
                this.openImg = 0
              }
              if(data.data.status == '报名中'){
                  this.openImg = 1;
              }
              if(data.data.status == '评审中' || data.data.status == '结束' || data.data.status == '筛选中' ||data.data.status == '公示中'){
                this.openImg = 2
              }
            }else{
              this.openImg = 2
            }
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  succadd(event){
    if(event.add){
      this.step = 1;
      this.openImg = 1;
      this._message.success('作品已提交，请等待审核');
      this.router.navigate(['front/item/detail'],{queryParams:{id:''+localStorage.getItem('actId')}});
      this.is_weixn();
    }

  }
  is_weixn(){
    let ua = navigator.userAgent.toLowerCase();
    if(''+ ua.match(/MicroMessenger/i)=='micromessenger') {
      setTimeout(()=>{
        this.modalService.confirm({
          nzTitle: '下载app即可体验更多精彩内容，是否去下载',
          nzOnOk: () => window.open('http://www.wenmind.com/app/index.html')
        });
      },1500);
    }
  }
  togroup(info){
    this.selAge = info.id;
    this.selgroup = info.name;
  }
  next() {
    if (localStorage.getItem('frontID')) {
      if (this.multipleValue && this.selgroup) {
        this.step = 2;
      } else {
        this._message.error('赛区或组别不能为空');
      }
    }else{
      this._message.error('你还未登录，请先登录再报名该活动');
      // login(index){
      //   const modal = this.modalService.create({
      //     nzTitle:null,
      //     nzWidth:300,
      //     nzClosable:false,
      //     nzContent: LoginBoxComponent,
      //     nzFooter: null,
      //     nzMaskClosable:false,
      //     nzComponentParams: {
      //       login:1,
      //     }
      //   });
      //   modal.afterClose.subscribe((result) =>{
      //     if(result&&result.success){
      //       this.islogin = localStorage.getItem('frontID')? 1:0;
      //       this.frontInfo = JSON.parse(localStorage.getItem('frontUserInfo'))
      //     }
      //   });
      // }
    }
  }

}
