import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../../../common/service/http-service.service';
import {appApis} from '../../../../../common/constant/apis';
import {NzMessageService} from 'ng-zorro-antd';
import {ItemService} from '../../../item.service';

@Component({
  selector: 'app-addp-compt',
  templateUrl: './addp-compt.component.html',
  styleUrls: ['./addp-compt.component.scss']
})
export class AddpComptComponent implements OnInit {
  validateForm: FormGroup;
  ageNum = 6;
  birth;
  @Input() group;
  @Output() open = new EventEmitter();
  isage = 1;
  constructor(private itemService:ItemService,private _message: NzMessageService,private fb: FormBuilder,private httpService: HttpService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      gender: [ '男', [ Validators.required ] ],
      school: [ null, [ Validators.required ] ],
    });
    if(this.group == '6-9岁'){
      this.ageNum = 6;
      this.birth='2013-01-01'
    }else{
      this.ageNum = 10;
      this.birth='2008-07-02'
    }
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
  save(){
    if(this.group == '6-9岁'){
      if(this.ageNum < 6 || this.ageNum > 9 ) {
        return this._message.error('您的年龄不在所选组别内，请选择别的组别');
      }
    }else{
      if(this.ageNum < 10 || this.ageNum > 12 ){
        return this._message.error('您的年龄不在所选组别内，请选择别的组别');
      }
    }
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if(this.validateForm.status == 'VALID'){
      this.checkUser();
    }
  }
  cancel(){
    this.open.emit({close:true});
  }

  addUser(){
    let userbox = {
      nickName:this.validateForm.controls['userName'].value,
      gender:this.validateForm.controls['gender'].value,
      age:this.ageNum,
      birthday:this.birth,
      school:this.validateForm.controls['school'].value,
      checkUser:''+ this.validateForm.controls['userName'].value+'-'+this.validateForm.controls['gender'].value+'-'+this.ageNum+'-'+localStorage.getItem('actId'),
    };
    this.open.emit({add:userbox});
    this.ngOnInit();
  }
  checkUser(){
    // console.log(this.validateForm.controls['userName'].value);
    // console.log(''+ this.validateForm.controls['userName'].value+'-'+this.validateForm.controls['gender'].value+'-'+this.ageNum+'-'+localStorage.getItem('actId'));
    // console.log(this.validateForm.controls['school'].value);
    let postStr =  {
      checkUser:''+ this.validateForm.controls['userName'].value+'-'+this.validateForm.controls['gender'].value+'-'+this.ageNum+'-'+localStorage.getItem('actId'),
      //
      // activityOnlineId:this.itemService.itemId?this.itemService.itemId:localStorage.getItem('actId'),
      // activityType:'视频征集',
      // userName:this.validateForm.controls['userName'].value,
      // gender:this.validateForm.controls['gender'].value,
      // age:this.ageNum,
    };
    this.httpService.post(appApis.frontcheckuser.url,postStr ,
      data => {
        if (data.code == 1){
          this.addUser();
        }else{
          this._message.error('该用户已报名，不可重复报名');
        }
      },
      error => {
        console.error(error);
      });
  }
}
