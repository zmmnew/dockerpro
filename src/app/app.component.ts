import {Component, OnInit} from '@angular/core';
import Fingerprint from "fingerprintjs";
import {appApis} from './common/constant/apis';
import {HttpService} from './common/service/http-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private httpService: HttpService,
  ) { }
  ngOnInit(): void {
    let fingerprint = new Fingerprint().get();
    localStorage.setItem('browser',fingerprint);
    this.getSTS();
  }
  getSTS(){
    this.httpService.get(appApis.alists.url,
      data => {
        if(data.code == 1 && data.data){
          localStorage.setItem('SecurityToken',data.data.SecurityToken);
          localStorage.setItem('AccessKeyId',data.data.AccessKeyId);
          localStorage.setItem('AccessKeySecret',data.data.AccessKeySecret);
          localStorage.setItem('expireTime', ''+ new Date().getTime());
        }
      },
      error => {
        console.error(error);
      });
  }
}
