import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
// import {RegisterComponent} from '../register/register.component';
import {appApis} from '../../../../common/constant/apis';
import {Md5} from 'ts-md5';
import {HttpService} from '../../../../common/service/http-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  passwordVisible = false;
  @Output() outLogin = new EventEmitter();
  haxi;
  lspw;
  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private httpService: HttpService,
    private _message: NzMessageService,
    private router:Router,
  ) { }

  ngOnInit() {
    if(localStorage.getItem('frontName')){
      this.haxi = true;
      this.lspw = localStorage.getItem('frontPw');
      this.validateForm = this.fb.group({
        userName: [''+ localStorage.getItem('frontName'), [ Validators.required ] ],
        password: [ ''+ localStorage.getItem('frontPw'), [ Validators.required ] ],
        remember: [ true ]
      });
    }else{
      this.validateForm = this.fb.group({
        userName: [null, [ Validators.required ] ],
        password: [ null, [ Validators.required ] ],
        remember: [ true ]
      });
    }

  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if(this.validateForm.status == 'VALID'){
      this.login();
    }
  }
  login(){
    let pw;
    if(this.haxi && this.lspw == this.validateForm.controls['password'].value){
      pw = this.validateForm.controls['password'].value
    }else{
      pw =  Md5.hashStr(this.validateForm.controls['password'].value)
    }
    let postStr = {
      name:this.validateForm.controls['userName'].value,
      password:pw
    };
    this.httpService.post(appApis.front_login.url, postStr,
      data => {
        if (data.code == 1){
          this._message.success('登陆成功');
          if(this.validateForm.controls['remember'].value==true && !this.haxi){
            localStorage.setItem('frontName',this.validateForm.controls['userName'].value);
            localStorage.setItem('frontPw',pw);
          }
          localStorage.setItem('frontUserInfo',JSON.stringify(data.data));
          localStorage.setItem('frontID',data.data.id);
          this.router.navigate(['/front/item/detail'],{queryParams:{id:''+localStorage.getItem('actId')}});
          this.outLogin.emit(4);
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  close(){
    this.modal.destroy();
  }
  toregister(){
    this.outLogin.emit(2);
  }
  toforget(){
    this.outLogin.emit(3);
  }
}
