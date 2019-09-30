import { Component, OnInit } from '@angular/core';
import {appApis} from '../../../common/constant/apis';
import {HttpService} from '../../../common/service/http-service.service';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.scss']
})
export class CenterComponent implements OnInit {
  frontInfo;
  constructor(

  ) { }

  ngOnInit() {
    this.frontInfo = JSON.parse(localStorage.getItem('frontUserInfo'))
  }


}
