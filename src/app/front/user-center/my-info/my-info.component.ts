import { Component, OnInit } from '@angular/core';
import {appApis} from '../../../common/constant/apis';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {HttpService} from '../../../common/service/http-service.service';
import {Router} from '@angular/router';
import {InfostatusService} from '../../infostatus.service';

@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.component.html',
  styleUrls: ['./my-info.component.scss']
})
export class MyInfoComponent implements OnInit {
  myinfolist;
  frontInfo;
  isSpinning =true;
  page={size:10,index:1,total:0};
  constructor(
    private httpService: HttpService,
    private infostatusService:InfostatusService,
  ) { }

  ngOnInit() {
    this.frontInfo = JSON.parse(localStorage.getItem('frontUserInfo'));
    this.getinfo();
    this.infoReader();
  }
  getinfo(){
    this.isSpinning =true;
    let poststr = {
      "size": this.page.size,
      "current": this.page.index,
      "orderBy": "createTime desc",
      "params": {
        "userid": this.frontInfo.id
      }
    };
    this.httpService.post(appApis.mynotice.url,poststr,
      data => {
        this.isSpinning =false;
        if (data.code == 1){
          if(data.data){
            this.myinfolist = data.data.list;
            this.page.total = data.data.total;
          }

        }

      },
      error => {
        console.error(error);
      });
  }

  infoReader(){
    this.httpService.get(appApis.mynoticeReader.url+'/'+localStorage.getItem('frontID'),
      data => {
        if (data.code == 1){
          this.infostatusService.sendMessage(1);
          this.infostatusService.infostatus = 1;
        }

      },
      error => {
        console.error(error);
      });
  }
}
