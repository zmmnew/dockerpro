import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../common/service/http-service.service';
import {HttpHeaders} from '@angular/common/http';
import {ROOT_URL} from '../../common/config/config';
import {Subscription} from 'rxjs';
import {ItemService} from './item.service';
import {appApis} from '../../common/constant/apis';
import {LoginBoxComponent} from '../layout/login-box/login-box.component';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
declare var bShare: any;
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  itemId=this.itemService.itemId;
  ShortUrl;
  url = ROOT_URL;
  actdel;
  subscription: Subscription;
  islogin;
  frontInfo;
  iswx = 0;
  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private httpService: HttpService,
    private itemService:ItemService,
    private modalService: NzModalService,
    private _message: NzMessageService,
  ) {
    this.subscription = this.itemService.getMessage().subscribe((itemId)=>{
      this.itemId = itemId?itemId:localStorage.getItem('actId');
      // console.log(this.itemId)
    });

  }

  ngOnInit() {
    this.frontInfo = JSON.parse(localStorage.getItem('frontUserInfo'));
    this.islogin = localStorage.getItem('frontID')? 1:0;
    this.is_weixn();
    this.getDel();
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    const postStr = {"url":this.url+'/#/front/item/detail'};
    this.httpService.post2('https://dwz.cn/admin/v2/create',postStr,{headers:httpOptions.headers.set('token', '521a27cd7e3be56af7806b4a756764fd')},
      data => {
        this.ShortUrl = data.ShortUrl;
        this.initShare();
        // console.log(data);
      },
      error => {
        if (error){ }
      });
  }
  is_weixn(){
    let ua = navigator.userAgent.toLowerCase();
    if(''+ ua.match(/MicroMessenger/i)=='micromessenger') {
      this.iswx = 1;
    } else {
      this.iswx = 0;
    }
  }
  todel(){
    this.modalService.confirm({
      nzTitle: '查看个人中心请前往app，是否去下载',
      nzOnOk: () => window.open('http://www.wenmind.com/app/index.html')
    });
  }
  toout(){
    localStorage.removeItem('frontID');
    localStorage.removeItem('frontUserInfo');
    this.islogin = localStorage.getItem('frontID')? 1:0;
    this.router.navigate(['/front/item/detail'],{queryParams:{id:''+localStorage.getItem('actId')}});
  }
  login(index){
    const modal = this.modalService.create({
      nzTitle:null,
      nzWidth:300,
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


  getDel(){
    // this.isSpinning = true;
    this.httpService.get(appApis.actDelbyid.url+'/'+ this.itemId,
      data => {
        // this.isSpinning = false;
        if (data.code == 1){
          this.actdel = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  initShare(){
    const str = `
     <script type="text/javascript"> bShare.init(); </script>
      <script type="text/javascript" charset="utf-8" src="http://static.bshare.cn/b/buttonLite.js#style=-1&amp;uuid=&amp;pophcol=2&amp;lang=zh"></script>
    `;
    $('#js').html(str);
    // console.log(this.ShortUrl);
    bShare.addEntry({
      title:'分享',
      url:'http://www.baidu.com',
      summary: '',
      pic: ''
    });
    // console.log(bShare.addEntry);
  }
}
