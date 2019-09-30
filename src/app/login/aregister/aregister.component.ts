import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {HttpService} from '../../common/service/http-service.service';
import {appApis} from '../../common/constant/apis';
import {REGION_IMG} from '../../common/constant/region';
import {Md5} from 'ts-md5';
import {ROOT_URL} from '../../common/config/config';
import {BehaviorSubject, Observable} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-aregister',
  templateUrl: './aregister.component.html',
  styleUrls: ['./aregister.component.scss']
})
export class AregisterComponent implements OnInit {
  validateForm: FormGroup;
  count=0;
  region = REGION_IMG.slice(1);
  unitName;
  reason;
  srcurls= ROOT_URL+appApis.get_gifcode.url;
  isLoading = false;
  searchChange$ = new BehaviorSubject('');
  constructor(
    private router: Router,private _message: NzMessageService,private fb: FormBuilder,private httpService: HttpService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [ Validators.required,this.nameCheck] ],
      userphone:[null, [ Validators.required ,this.phoneCheck] ],
      password: [ null, [ Validators.required,this.pwCheck] ],
      repw: [ null, [ Validators.required,this.repwCheck ] ],
      reason:[null, [ Validators.required ] ],
      unitName:[null,  [ Validators.required ]],
      code: [ null, [ Validators.required ] ],
      picCode: [ null, [ Validators.required ] ],
    });
  }
  nameCheck = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value.length <2 || control.value.length >8) {
      return { required: true };
    }
    return {};
  };
  phoneCheck= (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value.length >11) {
      return { required: true };
    }
    return {};
  };
  pwCheck= (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value.length <6 ||control.value.length >16) {
      return { required: true };
    }
    return {};
  };
  repwCheck = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !==this.validateForm.controls['password'].value ) {
      return { required: true };
    }
    return {};
  };
  onSearch(value: string): void {
    this.searchChange$.next(value);
  }
  getCaptcha(){
    if(this.validateForm.controls['userphone'].value && this.validateForm.controls['userName'].value && this.validateForm.controls['picCode'].value){
      if(this.count == 0){
        this.checkPhoneOne();
      }
    }else{
      this.validateForm.controls['userphone'].markAsDirty();
      this.validateForm.controls['userphone'].updateValueAndValidity();
      this.validateForm.controls['userName'].markAsDirty();
      this.validateForm.controls['userName'].updateValueAndValidity();
      this.validateForm.controls['picCode'].markAsDirty();
      this.validateForm.controls['picCode'].updateValueAndValidity();
    }
  }
  checkPhoneOne(){
    this.isLoading = true;
    this.httpService.get(appApis.checkMobile.url+'/'+ this.validateForm.controls['userphone'].value,
      data => {
        this.isLoading = false;
        if (data.code == 0){
          this.getSmsCode();
        }else if(data.code == 1){
          this._message.error(data.message);
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
      picCaptcha:this.validateForm.controls['picCode'].value,
      type:'用户注册验证码',
      phoneNumber:this.validateForm.controls['userphone'].value,
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

  changepiccode(){
    this.srcurls=ROOT_URL +appApis.get_gifcode.url+'?'+Math.random();
  }
  register(){
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if(this.validateForm.status == 'VALID'){
      this.httpReg();
    }

  }
  httpReg(){
    let region = this.validateForm.controls['unitName'].value;
    let postStr = {
      name:this.validateForm.controls['userName'].value,
      mobile:this.validateForm.controls['userphone'].value,
      // unitName:region[region.length-1].split(',')[1],
      description:this.validateForm.controls['reason'].value,
      password:Md5.hashStr(this.validateForm.controls['password'].value),
      region:this.validateForm.controls['unitName'].value,
      captcha:this.validateForm.controls['code'].value,
      role:'活动管理员'
    };
    this.httpService.post(appApis.admin_register.url, postStr,
      data => {
        if (data.code == 1){
          this._message.success('提交成功，请等待审核');
          this.login();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  login(){
    this.router.navigate(['/aLogin']);
  }


}
