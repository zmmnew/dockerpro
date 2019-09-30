import { Component, OnInit } from '@angular/core';
import {Md5} from 'ts-md5';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {HttpService} from '../../common/service/http-service.service';
import {appApis} from '../../common/constant/apis';
import {ROOT_URL} from '../../common/config/config';

@Component({
  selector: 'app-alogin',
  templateUrl: './alogin.component.html',
  styleUrls: ['./alogin.component.scss']
})
export class AloginComponent implements OnInit {
  validateForm: FormGroup;
  haxi=false;
  lspw;
  srcurls= ROOT_URL+appApis.get_gifcode.url;
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if(this.validateForm.status == 'VALID'){
      this.login();
    }
  }

  constructor(private modalService: NzModalService,private router: Router,private _message: NzMessageService,private fb: FormBuilder,private httpService: HttpService) {
  }

  ngOnInit(): void {
    if(localStorage.getItem('usname')){
      this.haxi = true;
      this.lspw = localStorage.getItem('userpw');
      this.validateForm = this.fb.group({
        userName: [''+ localStorage.getItem('usname'), [ Validators.required ] ],
        password: [ ''+ localStorage.getItem('userpw'), [ Validators.required ] ],
        code: [ null, [ Validators.required ] ],
        remember: [ true ]
      });
    }else{
      this.validateForm = this.fb.group({
        userName: [null, [ Validators.required ] ],
        password: [ null, [ Validators.required ] ],
        code: [ null, [ Validators.required ] ],
        remember: [ true ]
      });
    }

  }
  changepiccode(){
    this.srcurls=ROOT_URL +appApis.get_gifcode.url+'?'+Math.random();
  }
  login(){
    // console.log(this.validateForm.controls['password'].value,Md5.hashStr(this.validateForm.controls['password'].value));
    let pw;
    if(this.haxi && this.lspw == this.validateForm.controls['password'].value){
      pw = this.validateForm.controls['password'].value
    }else{
      pw =  Md5.hashStr(this.validateForm.controls['password'].value)
    }
    let getstr = {
      mobile:this.validateForm.controls['userName'].value,
      password:pw,
      captcha:this.validateForm.controls['code'].value,
    };
    this.httpService.post(appApis.admin_login.url, getstr,
      data => {
        if (data.code == 1){
          localStorage.setItem('adminid',data.data.id);
          localStorage.setItem('userInfo',JSON.stringify(data.data));
          localStorage.setItem('usname',this.validateForm.controls['userName'].value);
          localStorage.setItem('userpw',''+Md5.hashStr(this.validateForm.controls['password'].value));
          this._message.success(`登陆成功`);
          this.router.navigate(['/base']);
        }else if(data.code==2){
          this._message.error('密码错误');
        }else if(data.code==3){
          this._message.error('验证码错误');
        }else if(data.code==4){
          this._message.error('该用户被停用');
        }else if(data.code==5){
          this._message.error('该用户未审核，请等待审核通过再进行登录');
        }else if(data.code==6){
          this._message.error('该用户审核不通过，拒绝登陆');
        } else if(data.code==7){
          this._message.error('专家只能在活动开始的时间段内登陆');
        } else{
          this._message.error('该用户未进行注册');
        }
      },
      error => {
        console.error(error);
      });
  }
  forget(){
    this.modalService.info({
      nzTitle: '请联系管理员重置密码',
    });
  }
  zhuce(){
    this.router.navigate(['/aRegister']);
  }
}
