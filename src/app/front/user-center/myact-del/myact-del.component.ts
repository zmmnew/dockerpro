import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../../common/service/http-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemService} from '../../item/item.service';
import {appApis} from '../../../common/constant/apis';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-myact-del',
  templateUrl: './myact-del.component.html',
  styleUrls: ['./myact-del.component.scss']
})
export class MyactDelComponent implements OnInit {
  signupId;
  signupdel;
  userBox;
  isplay=false;
  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private _message: NzMessageService,
    private modalService: NzModalService,
    private router:Router,
  ) {
    route.queryParams.subscribe(queryParams => {
      this.signupId = queryParams.id;
    });
  }

  ngOnInit() {
    this.getDel();
    this.getUser();
  }
  toplay(){
    this.isplay = true;
  }
  getDel(){
    this.httpService.get(appApis.userSignUp_del.url+'/'+ this.signupId,
      data => {
        if (data.code == 1){
          this.signupdel = data.data;
          this.signupdel.videoTime = this.formatSeconds(this.signupdel.videoTime)

        }
      },
      error => {
        console.error(error);
      });
  }
  getUser(){
    this.httpService.get(appApis.getUserListByAId.url+'/'+this.signupId,
      data => {
        if (data.code == 1){
          this.userBox = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  toupload(id,actid){
    this.router.navigate(['front/item/reload'],{queryParams:{id:id,actid:actid}});
  }
  // reupload(id){
  //   this.httpService.delete(appApis.zuopin_delete.url +'/'+ id,
  //     data => {
  //       if (data.code == 1){
  //         this.router.navigate(['/front/item/enter'],{queryParams:{id:''+localStorage.getItem('actId')}});
  //       }
  //     },
  //     error => {
  //       console.error(error);
  //     });
  //
  // }
  deleteZuo(id){
    this.modalService.confirm({
      nzTitle: '是否删除该作品？',
      nzOnOk: () => this.deleteHttp(id)
    });

  }
  deleteHttp(id){
    this.httpService.delete(appApis.zuopin_delete.url +'/'+ id,
      data => {
        if (data.code == 1){
          this.getDel();
          this._message.success('删除成功');
        }
      },
      error => {
        console.error(error);
      });
  }
  //时长转换
  formatSeconds(value) {
    if(value){
      let secondTime = Math.floor(value);// 秒
      let minuteTime = 0;// 分
      let hourTime = 0;// 小时
      if (secondTime > 60) {
        minuteTime = Math.floor(secondTime / 60);
        secondTime = Math.floor(secondTime % 60);
        if (minuteTime > 60) {
          hourTime = Math.floor(minuteTime / 60);
          minuteTime = Math.floor(minuteTime % 60);
        }
      }
      // let result = "" + Math.floor(secondTime) + "秒";
      let s = Math.floor(secondTime)>=10?Math.floor(secondTime):'0'+ Math.floor(secondTime);
      let m = Math.floor(minuteTime)>=10?Math.floor(minuteTime):'0'+ Math.floor(minuteTime);
      let h = Math.floor(hourTime)>=10?Math.floor(hourTime):'0'+ Math.floor(hourTime);
      if(minuteTime == 0){
        return '00:00:'+s;
      }else if(hourTime == 0){
        return '00:'+m+":"+ s ;
      }else{
        return  "" + h+':'+m+":"+ s ;
      }
    }
  }
}
