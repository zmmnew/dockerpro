import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../../common/service/http-service.service';
import {appApis} from '../../../common/constant/apis';
import {ActnumDelComponent} from '../act-user/actnum-del/actnum-del.component';
import {UserCheckComponent} from '../act-user/user-check/user-check.component';
import {Md5} from 'ts-md5';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {SignupNumComponent} from './signup-num/signup-num.component';

@Component({
  selector: 'app-front-user',
  templateUrl: './front-user.component.html',
  styleUrls: ['./front-user.component.scss']
})
export class FrontUserComponent implements OnInit {
  pagelist=[];
  loading;
  page = {
    total:1,
    index:1,
    size:15
  };
  username;
  Stauts=['全部','未审核','审核通过','审核不通过','已停用'];
  statusValue = '全部';
  signupCompt = SignupNumComponent;
  // actnumCompt = ActnumDelComponent;
  constructor(
    private modalService: NzModalService,
    private _message: NzMessageService,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.getPage();
  }
  // reset(){
  //   this.username='';
  //   this.statusValue = '全部';
  //   this.getPage();
  // }
  pageSizeChange(){
    setTimeout(()=>{this.getPage();},500)
  }
  reset(){
    this.username = '';
    this.getPage();
  }
  getPage(){
    this.loading = true;
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      // orderBy:'createTime desc',
      params:{
        name:this.username,
      }
    };
    this.httpService.post(appApis.fuser_page.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.page.total = data.data.total;
          this.pagelist = data.data.list;
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  showModal(tit,compt,info){
    const modal = this.modalService.create({
      nzTitle:tit,
      nzWidth:700,
      nzContent: SignupNumComponent,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        info:info,
      }
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.success){
        this.getPage();
      }
    });
  }

  delete(id){
    this.httpService.delete(appApis.actUser_delete.url+'/'+id,
      data => {
        if (data.code == 1){
          this._message.success('操作成功');
          this.getPage();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
}
