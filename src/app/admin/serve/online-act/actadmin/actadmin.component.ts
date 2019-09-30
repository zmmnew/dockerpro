import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../common/constant/apis';
import {HttpService} from '../../../../common/service/http-service.service';

@Component({
  selector: 'app-actadmin',
  templateUrl: './actadmin.component.html',
  styleUrls: ['./actadmin.component.scss']
})
export class ActadminComponent implements OnInit {
  @Input() info;
  page = {
    total:1,
    index:1,
    size:10
  };
  list;
  loading = false;
  constructor(private httpService: HttpService,) { }

  ngOnInit() {
      this.getlist();
  }
  pageSizeChange() {
    this.loading = true;
    setTimeout(()=>{
      this.getlist();
    },500)
  }
  getlist(){
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      orderBy:'createTime desc',
      params:{
        activityOnlineId:this.info.id,
      }
    };
    this.httpService.post(appApis.AdminGetActivityOnlinePage.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.page.total = data.data.total;
          this.list = data.data.list;
        }
      },
      error => {
        console.error(error);
      });
  }
}
