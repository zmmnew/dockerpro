import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {appApis} from '../../../../common/constant/apis';
import {HttpService} from '../../../../common/service/http-service.service';
import {ROOT_URL} from '../../../../common/config/config';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  validateForm: FormGroup;
  passwordVisible = false;
  count = 0;
  srcurls= ROOT_URL+appApis.get_gifcode.url;
  isLoading = false;
  @Output() outLogin = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private httpService: HttpService,
    private _message: NzMessageService) { }

  ngOnInit() {
    console.log(document.body.clientWidth);
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
        this.isLoading = false;
        if (data.code == 0){
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
      type:'用户注册验证码',
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
  // cheakphone(){
  //   this.httpService.get(appApis.front_phoneOne.url+'/'+ this.validateForm.controls['userName'].value,
  //     data => {
  //       if (data.code == 1){
  //
  //       }else{
  //         this._message.error( );
  //       }
  //     },
  //     error => {
  //       console.error(error);
  //     });
  // }

  register(){
    let postStr = {
      name:this.validateForm.controls['userName'].value,
      password:Md5.hashStr(this.validateForm.controls['password'].value),
      captcha:this.validateForm.controls['code'].value,
      sign:document.body.clientWidth>1000 ?'pc':''
    };
    this.httpService.post(appApis.front_register.url, postStr,
      data => {
        if (data.code == 1){
          this.outLogin.emit(1);
          this._message.success('注册成功');
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
