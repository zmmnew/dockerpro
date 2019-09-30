import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../../../common/service/http-service.service';
import {appApis} from '../../../../common/constant/apis';
import {ALIURL} from '../../../../common/config/config';

@Component({
  selector: 'app-pub-del',
  templateUrl: './pub-del.component.html',
  styleUrls: ['./pub-del.component.scss']
})
export class PubDelComponent implements OnInit {
  url='https://dev-test-bucket.oss-cn-beijing.aliyuncs.com/test/1c5c50c92bc354c5569d536587f21702.mp4';
  pubId;
  pubdel;
  isSpinning=false;
  username = '';
  aliUrl = ALIURL;
  constructor(
    private router:Router,
    private httpService: HttpService,
    private route: ActivatedRoute,
  ) {
    route.queryParams.subscribe(queryParams => {
      this.pubId = queryParams.id;
      this.getDel();
      this.getUser();
    });
  }

  ngOnInit() {
  }
  getDel(){
    this.isSpinning = true;
    this.httpService.get(appApis.userSignUp_del.url+'/'+ this.pubId,
      data => {
        this.isSpinning = false;
        if (data.code == 1){
          this.pubdel = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  getUser(){
    this.username='';
    this.httpService.get(appApis.getUserListByAId.url+'/'+this.pubId ,
      data => {
        if (data.code == 1){
          data.data.forEach((item)=>{
            this.username +=item.nickName+', ';
          })

        }
      },
      error => {
        console.error(error);
      });
  }
}
