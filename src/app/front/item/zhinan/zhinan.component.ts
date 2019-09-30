import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../common/service/http-service.service';
import {ItemService} from '../item.service';
import {appApis} from '../../../common/constant/apis';

@Component({
  selector: 'app-zhinan',
  templateUrl: './zhinan.component.html',
  styleUrls: ['./zhinan.component.scss']
})
export class ZhinanComponent implements OnInit {
  actId;
  actdel;
  isSpinning=false;
  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private itemService:ItemService
  ) {
    route.queryParams.subscribe(queryParams => {
      this.actId = queryParams.id;
      this.getDel();
    });
  }

  ngOnInit() {

  }
  getDel(){
    this.isSpinning = true;
    this.httpService.get(appApis.actDelbyid.url+'/'+ this.actId,
      data => {
        this.isSpinning = false;
        if (data.code == 1){
          this.actdel = data.data;
          $('.desc').append(this.actdel.guideContent);
        }
      },
      error => {
        console.error(error);
      });
  }
}
