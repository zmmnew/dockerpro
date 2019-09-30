import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../common/constant/apis';
import {HttpService} from '../../../../common/service/http-service.service';

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.scss']
})
export class AuthorListComponent implements OnInit {
  @Input() info;
  @Input() type;
  loading = false;
  page = {
    total:1,
    index:1,
    size:15
  };
  pagelist = [];
  constructor(
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.getPage();
    // console.log(this.info);
  }
  getPage(){
    this.loading = true;
    this.httpService.get(appApis.getUserListByAId.url+'/'+ this.info.id,
      data => {
        this.loading = false;
        if (data.code == 1){
          if(data.data){
            // this.page.total = data.data.total;
            this.pagelist = data.data;
          }
        }
      },
      error => {
        console.error(error);
      });
  }

}
