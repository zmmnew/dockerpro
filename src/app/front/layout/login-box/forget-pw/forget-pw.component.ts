import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {appApis} from '../../../../common/constant/apis';
import {ROOT_URL} from '../../../../common/config/config';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../../common/service/http-service.service';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-forget-pw',
  templateUrl: './forget-pw.component.html',
  styleUrls: ['./forget-pw.component.scss']
})
export class ForgetPwComponent implements OnInit {
  validateForm: FormGroup;
  passwordVisible = false;
  count = 0;
  isLoading;
  srcurls= ROOT_URL+appApis.get_gifcode.url;
  @Output() outLogin = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private httpService: HttpService,
    private _message: NzMessageService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      piccode:[null,[ Validators.required ]],
      code: [ null, [ Validators.required ] ],
      remember: [ true ]
    });
  }
  changepiccode(){
    this.srcurls=ROOT_URL +appApis.get_gifcode.url+'?'+Math.random();
  }
  getCaptcha(){
    if(this.validateForm.controls['userName'].value&&this.validateForm.controls['piccode'].value){
      if(this.count == 0){
        this.checkPhoneOne();
      }
    }else{
      this.validateForm.controls['userName'].markAsDirty();
      this.validateForm.controls['userName'].updateValueAndValidity();
      this.validateForm.controls['piccode'].markAsDirty();
      this.validateForm.controls['piccode'].updateValueAndValidity();
    }
  }
  checkPhoneOne(){
    this.isLoading = true;
    this.httpService.get(appApis.front_phoneOne.url+'/'+ this.validateForm.controls['userName'].value,
      data => {
        if (data.code == 1){
          this.getSmsCode();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  getSmsCode(){
    this.isLoading = true;
    let postStr = {
      picCaptcha:this.validateForm.controls['piccode'].value,
      type:'修改密码验证码',
      phoneNumber:this.validateForm.controls['userName'].value,
      fingerprint:localStorage.getItem('browser'),
    };
    this.httpService.post(appApis.get_smscode.url, postStr,
      data => {
        this.isLoading = false;
        if (data.code == 1){
          this._message.success('获取成功');
          let timer;
          this.count = 60;
          timer = setInterval((()=>{
            this.count-=1;
            if(this.count == 0){
              clearInterval(timer);
            }
          }),1000)
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if(this.validateForm.status == 'VALID'){
      this.register();
    }
  }
  register(){
    let postStr = {
      name:this.validateForm.controls['userName'].value,
      password:Md5.hashStr(this.validateForm.controls['password'].value),
      captcha:this.validateForm.controls['code'].value,
    };
    this.httpService.put(appApis.front_updatePw.url, postStr,
      data => {
        if (data.code == 1){
          this._message.success('操作成功');
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
  tologin(){
    this.outLogin.emit(1);
  }
}
