import { Component, OnInit } from '@angular/core';
import {appApis} from '../../../common/constant/apis';
import {HttpService} from '../../../common/service/http-service.service';
import {Router} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ReuploadComponent} from '../../item/reupload/reupload.component';

@Component({
  selector: 'app-my-act',
  templateUrl: './my-act.component.html',
  styleUrls: ['./my-act.component.scss']
})
export class MyActComponent implements OnInit {
  frontInfo;
  myactlist = [];
  constructor(
    private httpService: HttpService,
    private router:Router,
    private _message: NzMessageService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.frontInfo = JSON.parse(localStorage.getItem('frontUserInfo'));
    this.getMyact();
  }
  getMyact(){
    this.httpService.get(appApis.usersignUpList.url +'/'+ this.frontInfo.id,
      data => {
        if (data.code == 1){
          if(data.data){
            this.myactlist = data.data;
            this.myactlist.forEach((item)=>{
              this.httpService.get(appApis.getUserListByAId.url+'/'+item.id ,
                msg => {
                  if (msg.code == 1){
                    item.userBox = msg.data;
                  }
                },
                error => {
                  console.error(error);
                });
            });
            // console.log(this.myactlist);
          }

        }

      },
      error => {
        console.error(error);
      });
  }
  getUser(){

  }
  toupload(id,actid){
    this.router.navigate(['front/item/reload'],{queryParams:{id:id,actid:actid}});
  }

  deleteZuo(id){
    this.modalService.confirm({
      nzTitle: '是否删除该作品？',
      nzOnOk: () => this.deleteHttp(id)
    });

  }
  deleteHttp(id){
    this.httpService.delete(appApis.zuopin_delete.url +'/'+ id,
      data => {
        if (data.code == 1){
          this.getMyact();
          this._message.success('删除成功');
        }
      },
      error => {
        console.error(error);
      });
  }
  toOrderdel(id){
    this.router.navigate(['front/uc/myactDel'],{queryParams:{id:id}});//
  }
}
