import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../../common/service/http-service.service';
import {appApis} from '../../../common/constant/apis';

@Component({
  selector: 'app-reupload',
  templateUrl: './reupload.component.html',
  styleUrls: ['./reupload.component.scss']
})
export class ReuploadComponent implements OnInit {
  signupId;
  actdel;
  signupdel;
  userBox;
  actid;
  videoWork;
  duration;
  params = {
    isChunk:true,
    type:'video/*',
  };
  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private _message: NzMessageService,
    // private modalService: NzModalService,
    private router:Router,
  ) {
    route.queryParams.subscribe(queryParams => {
      this.signupId = queryParams.id;
      this.actid =  queryParams.actid
    });
  }

  ngOnInit() {
    this.getActDel();
    this.getDel();
    this.getUser();
  }
  getActDel(){
    this.httpService.get(appApis.actDelbyid.url+'/'+ this.actid,
      data => {
        if (data.code == 1){
          if(data.data){
            this.actdel = data.data;

          }
        }
      },
      error => {
        console.error(error);
      });
  }
  getDel(){
    this.httpService.get(appApis.userSignUp_del.url+'/'+ this.signupId,
      data => {
        if (data.code == 1){
          this.signupdel = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  getUser(){
    this.httpService.get(appApis.getUserListByAId.url+'/'+this.signupId,
      data => {
        if (data.code == 1){
          this.userBox = data.data;
        }
      },
      error => {
        console.error(error);
      });
  }
  videoChange(event){
    this.videoWork = event.videoId;
    this.duration = event.duration;
    console.log(event);
  }
  toupload(){
    if(!this.videoWork){
      return this._message.error('请选择需要重传的作品');
    }
    let postStr =  {
      id:this.signupId,
      videoTime:this.duration,
      videoId:this.videoWork,
      worksStats:'待审核'
    };
    this.httpService.put(appApis.upload_update.url,postStr ,
      data => {
        if (data.code == 1){
          this._message.success('作品已提交，请等待审核');
          this.router.navigate(['front/item/detail'],{queryParams:{id:''+ this.actid}});
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
}
