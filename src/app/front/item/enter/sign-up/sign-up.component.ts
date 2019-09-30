import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {appApis} from '../../../../common/constant/apis';
import {HttpService} from '../../../../common/service/http-service.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ItemService} from '../../item.service';
import {ReaderComponent} from '../reader/reader.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  zuoId;
  validateForm: FormGroup;
  radioValue= '1';
  @Input() group;
  @Input() region;
  @Output() issuccess = new EventEmitter();
  @Input() actdel;
  userBox = [];
  tag;
  groupIndex = 1;
  fontNum = 0;
  ageNum = 6;
  params = {
    isChunk:true,
    type:'video/mp4',
  };
  videoWork;
  duration;
  birth;
  isage = 1;
  frontInfo;
  isSpinning = false;
  constructor(private modalService: NzModalService,private itemService:ItemService,private router:Router,private _message: NzMessageService,private fb: FormBuilder,private httpService: HttpService) { }

  ngOnInit() {
    this.frontInfo = JSON.parse(localStorage.getItem('frontUserInfo'));
    // console.log(this.frontInfo.name);
    scroll(0,0);
    this.validateForm = this.fb.group({
      groupType: ['个人', [ Validators.required ] ],
      name: [ null, [ Validators.required,this.nameCheck ] ],
      userName: [ null, [ Validators.required ] ],
      gender: [ '男', [ Validators.required ] ],
      school: [ null, [ Validators.required ] ],
      tel: [ ''+this.frontInfo.name, [ Validators.required] ],
      remember:[ true, [ Validators.required,this.remCheck  ]  ],
      // remember: [ true ]
    });
    if(this.group == '6-9岁'){
      this.ageNum = 6;
      this.birth='2013-01-01'
    }else{
      this.ageNum = 10;
      this.birth='2008-07-02'
    }
  }
  nameCheck = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value.length >20) {
      return { required: true };
    }
    return {};
  };
  telCheck = (control: FormControl): { [s: string]: boolean } => {
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!control.value) {
      return { required: true };
    } else if (!myreg.test(control.value)) {
      return { required: true };
    }
    return {};
  };
  remCheck= (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value==false) {
      return { required: true };
    }
    return {};
  };
  submite(){
    if(this.group == '6-9岁'){
      if(this.ageNum < 6 || this.ageNum > 9 ) {
        return this._message.error('您的年龄不在所选组别内，请选择别的组别');
      }
    }else{
      if(this.ageNum < 10 || this.ageNum > 12 ){
        return this._message.error('您的年龄不在所选组别内，请选择别的组别');
      }
    }
    if(this.groupIndex == 1){ //个人
      this.userBox = [];
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[ i ].markAsDirty();
        this.validateForm.controls[ i ].updateValueAndValidity();
      }
      if(this.validateForm.status == 'VALID'){
        let userbox = {
          nickName:this.validateForm.controls['userName'].value,
          gender:this.validateForm.controls['gender'].value,
          age:this.ageNum,
          school:this.validateForm.controls['school'].value,
          birthday:this.birth,
        };
        this.userBox.push(userbox);
        if(this.userBox && this.videoWork){
          this.checkone();
        }else{
          this._message.error('请上传视频作品');
        }
      }
    }else{  //组合
      this.validateForm.get('school').setValue(' ');
      this.validateForm.get('userName').setValue(' ');
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[ i ].markAsDirty();
        this.validateForm.controls[ i ].updateValueAndValidity();
      }
      if(this.validateForm.status == 'VALID'){
          if(this.userBox.length<2|| this.userBox.length>3){
            this._message.error('一个组合最多三个人，最少两人');
          }else{
            if(this.videoWork){
              this.checkMobile();
            }else{
              this._message.error('请上传视频作品');
            }

          }
      }
    }

  }
  userChange(event){
    if(event.user){
      this.userBox = event.user;
    }
  }
  checkone(){
    this.isSpinning = true;
    let postStr =  {
      checkUser:''+ this.validateForm.controls['userName'].value+'-'+this.validateForm.controls['gender'].value+'-'+this.ageNum+'-'+this.actdel.id,
    };
    this.httpService.post(appApis.frontcheckuser.url,postStr ,
      data => {
        this.isSpinning = false;
        if (data.code == 1){
          this.checkMobile();
        }else{
          this._message.error('该用户已报名，不可重复报名');
        }
      },
      error => {
        console.error(error);
      });
  }
  checkMobile(){
    this.isSpinning = true;
    this.httpService.get(appApis.frontcheckmobile.url+'/'+this.validateForm.controls['tel'].value ,
      data => {
        this.isSpinning = false;
        if (data.code == 1){
          this.signStep1();
        }else{
          this._message.error('一个手机号只允许报名两次');
        }
      },
      error => {
        console.error(error);
      });
  }
  signStep1(){
    this.isSpinning = true;
      let postStr =  {
        activityOnlineId:this.itemService.itemId?this.itemService.itemId:localStorage.getItem('actId'),
        activityType:'视频征集',
        region:this.region,
        group:this.group,
        userId:JSON.parse(localStorage.getItem('frontID')),
        name:this.validateForm.controls['name'].value,
        // works:this.videoWork,
        videoTime:this.duration,
        videoId:this.videoWork,
        groupType:this.validateForm.controls['groupType'].value,
        mobile:this.validateForm.controls['tel'].value,
      };
      this.httpService.post(appApis.upload_add.url,postStr ,
        data => {
          this.isSpinning = false;
          if (data.code == 1){
            this.zuoId = data.data.id;
            this.addUser();
          }else{
            this._message.error(data.message);
          }
        },
        error => {
          console.error(error);
        });
  }

  addUser() {
    if (this.userBox) {
      this.isSpinning = true;
      this.userBox.forEach((item,index) => {
        // index++;
        let postStr =  {
          signUpId:this.zuoId,
          nickName:item.nickName,
          gender:item.gender,
          age:item.age,
          school:item.school,
          birthday:item.birthday,
          checkUser:''+ item.nickName + '-' + item.gender +'-' + item.age + '-' + this.actdel.id
        };
        this.httpService.post(appApis.user_useradd.url,postStr ,
          data => {
            this.isSpinning = false;
            if (data.code == 1){
              if((index+1) == this.userBox.length){
                this.issuccess.emit({add:true});
              }
            }else{
              this.delete(this.zuoId);
              this._message.error('用户信息有误，请重新填写');
              return false;
            }
          },
          error => {
            console.error(error);
          });
      });

    }
  }
  delete(id){
    this.isSpinning = true;
    this.httpService.delete(appApis.zuopin_delete.url+'/'+id,
      data => {
        this.isSpinning = false;
        if (data.code == 1){

        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  videoChange(event){
    this.videoWork = event.videoId;
    this.duration = event.duration
  }
  clear(){
    this.router.navigate(['front/item/detail'],{queryParams:{id:this.itemService.itemId?this.itemService.itemId:localStorage.getItem('actId')}});
  }
  birthday(event){
    this.birth = event.birthday;
    this.ageNum = event.age;
    if(this.group == '6-9岁'){
      if(this.ageNum < 6 || this.ageNum > 9 ){
        this.isage = 0;
        return this._message.error('您的年龄不在所选组别内，请选择别的组别');

      }else{
        this.isage = 1;
      }

    }else{

      if(this.ageNum < 10 || this.ageNum > 12 ){
        this.isage = 0;
        return this._message.error('您的年龄不在所选组别内，请选择别的组别');
      }else{
        this.isage = 1;
      }
    }
  }
  change(){
    this.userBox = [];
    if(this.validateForm.controls['groupType'].value == '个人'){
      this.groupIndex = 1;
      this.tag = [];
    }else{
      this.groupIndex = 2;

    }
  }
  nameChange(){
    this.fontNum = this.validateForm.controls['name'].value.length;
    if(this.fontNum >20){
      this.validateForm.controls['name'].markAsDirty();
      this.validateForm.controls['name'].updateValueAndValidity();
    }
  }
  toreade(){
    const modal = this.modalService.create({
      nzTitle:'征集比赛版权声明',
      nzWidth:800,
      nzContent: ReaderComponent,
      nzFooter: null,
      nzComponentParams: {
        copy:this.actdel.copyrightInformation,
      }
    });
  }
}
