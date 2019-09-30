import {Injectable} from "@angular/core";
import {HttpService} from './http-service.service';
import {DatePipe} from '@angular/common';

@Injectable()
export class Method {

  constructor(
    private httpService: HttpService,
    private datePipe: DatePipe,
  ) {}
  time(value){
    if(value){
      return value.replace('T',' ');
    }
  }
  timeChange(time,formateNum){
    if(time){
      if(formateNum == 5){
        return this.datePipe.transform(time, 'yyyy-MM-ddTHH:mm');
      }else if(formateNum == 3){
        return this.datePipe.transform(time, 'yyyy-MM-dd');
      }else{
        return this.datePipe.transform(time, 'yyyy-MM-ddTHH:mm:ss');
      }

    }else{
      return '';
    }

  }
  //时长转换
  formatSeconds(value) {
    if(value){
      let secondTime = Math.floor(value);// 秒
      let minuteTime = 0;// 分
      let hourTime = 0;// 小时
      if (secondTime > 60) {
        minuteTime = Math.floor(secondTime / 60);
        secondTime = Math.floor(secondTime % 60);
        if (minuteTime > 60) {
          hourTime = Math.floor(minuteTime / 60);
          minuteTime = Math.floor(minuteTime % 60);
        }
      }
      // let result = "" + Math.floor(secondTime) + "秒";
      let s = Math.floor(secondTime)>=10?Math.floor(secondTime):'0'+ Math.floor(secondTime);
      let m = Math.floor(minuteTime)>=10?Math.floor(minuteTime):'0'+ Math.floor(minuteTime);
      let h = Math.floor(hourTime)>=10?Math.floor(hourTime):'0'+ Math.floor(hourTime);
      if(minuteTime == 0){
        return '00:00:'+s;
      }else if(hourTime == 0){
        return '00:'+m+":"+ s ;
      }else{
        return  "" + h+':'+m+":"+ s ;
      }
    }
  }

}
