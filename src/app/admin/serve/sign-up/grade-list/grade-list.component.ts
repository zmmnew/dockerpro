import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from '../../../../common/service/http-service.service';
import {appApis} from '../../../../common/constant/apis';

@Component({
  selector: 'app-grade-list',
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.scss']
})
export class GradeListComponent implements OnInit {
  pagelist = [];
  @Input() info;
  loading = true;
  page = {
    total:0,
    index:1,
    size:15
  };
  constructor(
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.getPage()
  }
  getPage(){
    this.httpService.get(appApis.gradePage.url+'/'+this.info.id,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.pagelist = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
}
