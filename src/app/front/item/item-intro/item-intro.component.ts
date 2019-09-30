import { Component, OnInit } from '@angular/core';
import {appApis} from '../../../common/constant/apis';
import {Md5} from 'ts-md5';
import {HttpService} from '../../../common/service/http-service.service';
import {ActivatedRoute} from '@angular/router';
import {ItemService} from '../item.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-item-intro',
  templateUrl: './item-intro.component.html',
  styleUrls: ['./item-intro.component.scss']
})
export class ItemIntroComponent implements OnInit {
  actId;
  actdel;
  isSpinning=false;
  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private itemService:ItemService,
    private titleService: Title
  ) {
    route.queryParams.subscribe(queryParams => {
      this.actId = queryParams.id;
      if(queryParams.info){
        if(queryParams.info == 'nologin'){
          localStorage.removeItem('frontID');
          localStorage.removeItem('frontUserInfo');
        }else{
          localStorage.setItem('frontID',queryParams.info);
          localStorage.setItem('frontUserInfo',queryParams.infodel);
        }
      }
      localStorage.setItem('actId',this.actId);
      this.getDel();
      this.itemService.sendMessage(this.actId);
      this.itemService.itemId = this.actId;
    });
  }

  ngOnInit() {
    scroll(0,0);

  }
  getDel(){
    this.isSpinning = true;
    this.httpService.get(appApis.actDelbyid.url+'/'+ this.actId,
      data => {
      this.isSpinning = false;
        if (data.code == 1){
          this.actdel = data.data;
          $('.desc').append(this.actdel.description?this.actdel.description:'暂无活动介绍');
          // console.log(this.actdel.description);
          this.titleService.setTitle(this.actdel.name);
        }
      },
      error => {
        console.error(error);
      });
  }
}
