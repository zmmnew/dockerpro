import { Component, OnInit } from '@angular/core';
import {appApis} from '../../../common/constant/apis';
import {HttpService} from '../../../common/service/http-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  visitNum = 0;
  constructor(
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.getNum();
  }
  getNum(){
    this.httpService.get(appApis.visitorNum.url,
      data => {
        if (data.code == 1){
          this.visitNum = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
}
