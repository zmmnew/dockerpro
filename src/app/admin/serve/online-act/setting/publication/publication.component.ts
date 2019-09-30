import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../../common/constant/apis';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {HttpService} from '../../../../../common/service/http-service.service';
import {DatePipe} from '@angular/common';
import {Method} from '../../../../../common/service/method';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit {
  actId;
  @Input() set info(value){
    if(value){
      // this.actInfo = value;
      this.actId= value.id;
      // this.selectTime = [value.screenStartTime , value.screenEndTime];

      // this.ispubTime = value.ispublic==true?'1':'0';
      // this.pubCont = value.publicContent;
      // this.up = value.publicHide==true?'1':'0';
      // console.log(this.up);
      // if(value.publicStartTime){
      //   this.pubTime = [value.publicStartTime,value.publicEndTime];
      // }
    }
  }
  actInfo;
  pubTime;
  ispubTime;
  up;
  pubCont;
  constructor(
    private _message: NzMessageService,
    private modal: NzModalRef,
    private httpService: HttpService,
    private datePipe: DatePipe,
    private method:Method,
  ) { }

  ngOnInit() {
    this.getDel();
  }
  getDel(){
    this.httpService.get(appApis.actDelbyid.url+'/'+ this.actId,
      data => {
        if (data.code == 1){
          this.actInfo = data.data;
          this.ispubTime = this.actInfo.ispublic==true?'1':'0';
          this.pubCont = this.actInfo.publicContent;
          this.up = this.actInfo.publicHide==true?'1':'0';
          // console.log(this.up);
          if(this.actInfo.publicStartTime){
            this.pubTime = [this.method.time(this.actInfo.publicStartTime),this.method.time(this.actInfo.publicEndTime)];
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  timeChange(event){
    if(!this.actInfo.reviewEndTime){
      return this._message.error('需先填写活动评审时间');
    }
    let actstart = new Date(this.actInfo.reviewEndTime).getTime();
    let uptime =new Date(this.pubTime[0]).getTime();
    if(actstart>uptime){
      return this._message.error('公示开始时间需晚于活动评审结束时间');
    }
  }
  update(){
    if( this.pubTime){
      if(!this.actInfo.reviewEndTime){
        return this._message.error('需先填写活动评审时间');
      }
      let actstart = new Date(this.actInfo.reviewEndTime).getTime();
      let uptime =new Date(this.pubTime[0]).getTime();
      if(actstart>uptime){
        return this._message.error('公示开始时间需晚于活动评审结束时间');
      }
      let postStr =  {
        id:this.actId,
        // screenStartTime:this.selectTime[0],
        // screenEndTime:this.selectTime[1],
        publicStartTime:this.method.timeChange(this.pubTime[0], 6),
        publicEndTime:this.method.timeChange(this.pubTime[1], 6),
        publicContent:this.pubCont,
        ispublic:this.ispubTime==1?true:false,
        publicHide:this.up==1?true:false
      };
      this.httpService.put(appApis.onlineAct_update.url,postStr,
        data => {
          if (data.code == 1){
            this.modal.destroy({ success: true });
            this._message.success('操作成功');
          }else{
            this._message.error(data.message);
          }
        },
        error => {
          console.error(error);
        });
    }else{
      this._message.error('请填写完整信息');
    }

  }
  cancel(){
    this.modal.destroy({ success: true });
  }
}
