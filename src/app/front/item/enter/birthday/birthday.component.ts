import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.scss']
})
export class BirthdayComponent implements OnInit {
  selyear = '2013';
  selmonth ='01';
  selday = '01';
  year = [];
  month = [];
  day = [];
  @Input() set group(value){
    if(value == '6-9岁'){
      this.selyear = '2013';
    }else{
      this.selyear = '2008';
      this.selmonth ='07';
      this.selday = '02';
    }
  };
  @Output() birChange = new EventEmitter();

  constructor() {
    this.year = [];
    this.month = [];
    this.day = [];
    for(let i=2013; i>=2006;i--){
      this.year.push(''+i);
    }
    for(let i=1; i<=12;i++){
      this.month.push(i<10?'0'+i:''+i);
    }
    for(let i=1; i<=31;i++){
      this.day.push(i<10?'0'+i:''+i);
    }

  }

  ngOnInit() {
  }

  dayChange(): void {
    this.selday = '01';
    this.day=[];
    let dayNum = new Date(Number(this.selyear), Number(this.selmonth), 0).getDate();
    for(let i=1; i<=dayNum;i++){
      this.day.push(i<10?'0'+i:''+i);
    }
    this.birthday();
  }
  birthday(){
    let birthday = this.selyear +'-' +this.selmonth +'-' +this.selday;
    let json = {birthday:birthday,age:this.jsGetAge(birthday)};
    this.birChange.emit(json);
  }

  //计算年龄
  jsGetAge(strBirthday) {
    let returnAge;
    let strBirthdayArr = strBirthday.split("-");
    let birthYear = strBirthdayArr[0];
    let birthMonth = strBirthdayArr[1];
    let birthDay = strBirthdayArr[2];

    // let d = new Date();
    // let nowYear = d.getFullYear();
    // let nowMonth = d.getMonth() + 1;
    // let nowDay = d.getDate();

    // let d = new Date();
    let nowYear = 2019;
    let nowMonth = 7;
    let nowDay = 6;

    if (nowYear == birthYear) {
      returnAge = 0;//同年 则为0岁
    }
    else {
      let ageDiff = nowYear - birthYear; //年之差
      if (ageDiff > 0) {
        if (nowMonth == birthMonth) {
          let dayDiff = nowDay - birthDay;//日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
          }
          else {
            returnAge = ageDiff;
          }
        }
        else {
          let monthDiff = nowMonth - birthMonth;//月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
          }
          else {
            returnAge = ageDiff;
          }
        }
      }
      else {
        returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
      }
    }

    return returnAge;//返回周岁年龄
  }
}
