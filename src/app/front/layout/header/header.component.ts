import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {HttpService} from '../../../common/service/http-service.service';
import {LoginBoxComponent} from '../login-box/login-box.component';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {InfostatusService} from '../../infostatus.service';
import {appApis} from '../../../common/constant/apis';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  islogin = 0;
  frontInfo;
  infostatus;
  subscription: Subscription;
  constructor(
    private modalService: NzModalService,
    private _message: NzMessageService,
    private httpService: HttpService,
    private router:Router,
    private infostatusService:InfostatusService,
  ) {
    this.subscription = this.infostatusService.getMessage().subscribe((infostatus)=>{
      // console.log(this.infostatus);
      this.infostatus = infostatus;
    });
  }

  ngOnInit() {
    this.getinfo();
    this.islogin = localStorage.getItem('frontID')? 1:0;
  }
  getinfo(){
    let poststr = {
      "size": 5,
      "current": 1,
      "orderBy": "status asc,createTime desc",
      "params": {
        "userid": localStorage.getItem('frontID')
      }
    };
    this.httpService.post(appApis.mynotice.url,poststr,
      data => {
        if (data.code == 1){
          if(data.data && data.data.list.length>0){
            if(data.data.list[0].status == 0){
              this.infostatusService.sendMessage(0);
              this.infostatusService.infostatus = 0;
            }
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  login(index){
    const modal = this.modalService.create({
      nzTitle:null,
      nzWidth:440,
      nzClosable:false,
      nzContent: LoginBoxComponent,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        login:index,
      }
    });
    modal.afterClose.subscribe((result) =>{
      if(result&&result.success){
        this.islogin = localStorage.getItem('frontID')? 1:0;
        this.frontInfo = JSON.parse(localStorage.getItem('frontUserInfo'))
      }
    });
  }
  logout(){
    localStorage.removeItem('frontID');
    localStorage.removeItem('frontUserInfo');
    this.islogin = localStorage.getItem('frontID')? 1:0;
    this.router.navigate(['/front/item/detail'],{queryParams:{id:''+localStorage.getItem('actId')}});
  }
  touc(){
    this.router.navigate(['front/uc']);
  }
  todel(){
    location.href='http://www.wenmind.com/front/#/indexMid';
    // this.router.navigate(['/front/item/detail'],{queryParams:{id:''+localStorage.getItem('actId')}});
  }
}
