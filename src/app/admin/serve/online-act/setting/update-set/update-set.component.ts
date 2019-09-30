import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../../common/constant/apis';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {HttpService} from '../../../../../common/service/http-service.service';
import {DatePipe} from '@angular/common';
import {Method} from '../../../../../common/service/method';

@Component({
  selector: 'app-update-set',
  templateUrl: './update-set.component.html',
  styleUrls: ['./update-set.component.scss']
})
export class UpdateSetComponent implements OnInit {
  actId;
  disabled=false;
  // @Input() set format(value){
  //   if(value){
  //     console.log(value);
  //     value = value.split(",");
  //       value.forEach((item)=>{
  //         this.checkvideo.forEach((i)=>{
  //
  //           if(item==i.value){i.checked = true;}
  //         });
  //       });
  //       value.forEach((item)=>{
  //         this.checkimg.forEach((i)=>{
  //           if(item==i.value){i.checked = true;}
  //         })
  //       })
  //     // }
  //   }
  // }
  actInfo;
  @Input() set info(value){
    if(value){
      // this.actInfo = value;
      // console.log(value);
      // if(value.type == '视频征集'){
      //   this.uoloadType ='1';
      // }else{
      //   this.uoloadType ='2';
      // }
      this.actId= value.id;
      // if(value.uploadStartTime){
      //   this.uploadTime = [value.uploadStartTime,value.uploadEndTime];
      // }
      // this.videoTime = value.limitVideoTime;
      // this.reUoload = ''+value.retransmit;
      // this.setsize = value.size;
      // this.partnum = value.numberOfEntries;
      // this.worknum = value.numberOfWorks;
    }
  }
  uoloadType = '1';
  uploadTime=null;
  isupload = false;
  checkvideo = [
    {value:'mp4',label:'mp4',checked:false},
    {value:'mov',label:'mov',checked:false},
  ];
  checkimg = [
    {value:'jpg',label:'jpg',checked:false},
    {value:'png',label:'png',checked:false},
    {value:'bmp',label:'bmp',checked:false},
  ];
  reUoload;
  videoTime;
  setsize;
  partnum;
  worknum;
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
          if(this.actInfo.format){
            this.actInfo.format =this.actInfo.format.split(",");
          }
          if(this.actInfo.type == '视频征集'){
            this.uoloadType ='1';
            if(this.actInfo.format){
              this.actInfo.format.forEach((item)=>{
                this.checkvideo.forEach((i)=>{
                  if(item==i.value){i.checked = true;}
                });
              });
            }

          }else{
            if(this.actInfo.format){
              this.actInfo.format.forEach((item)=>{
                this.checkimg.forEach((i)=>{
                  if(item==i.value){i.checked = true;}
                })
              })
            }
            this.uoloadType ='2';
          }
          if(this.actInfo.uploadStartTime){
            // console.log(this.actInfo.uploadStartTime);
            // console.log(new Date('2019-06-27 10:05:17'));
            this.uploadTime = [this.method.time(this.actInfo.uploadStartTime),this.method.time(this.actInfo.uploadEndTime)];
            // console.log(this.uploadTime);
          }
          this.videoTime = this.actInfo.limitVideoTime;
          this.reUoload = ''+this.actInfo.retransmit;
          this.setsize = this.actInfo.size;
          this.partnum = this.actInfo.numberOfEntries;
          this.worknum = this.actInfo.numberOfWorks;

        }
      },
      error => {
        console.error(error);
      });
  }


  timeChange(event){
    // console.log(event);
    let actstart = new Date(this.actInfo.activityStartTime).getTime();
    let uptime =new Date(this.uploadTime[0]).getTime();
    if(actstart>uptime){
      return this._message.error('报名开始时间需晚于活动开始时间');
    }
  }
  update(){
    let formatStr='';
    if(this.uoloadType == '1'){
      this.checkvideo.forEach((item)=>{
        if(item.checked){
          formatStr += item.value+','
        }
      })
    }else{
      this.checkimg.forEach((item)=>{
        if(item.checked){
          formatStr += item.value+','
        }
      })
    }
    // console.log(this.info);
    if(this.actInfo.status !== '准备中' && this.actInfo.status !== '报名中'&& this.actInfo.status !== '预告中'){
      return this._message.error('该活动已过报名阶段，无法更改');
    }
    if(this.uploadTime){
      let actstart = new Date(this.actInfo.activityStartTime).getTime();
      let uptime =new Date(this.uploadTime[0]).getTime();
      if(actstart>uptime){
        return this._message.error('报名开始时间需晚于活动开始时间');
      }
      let postStr =  {
        id:this.actId,
        uploadStartTime:this.method.timeChange(this.uploadTime[0], 6),
        uploadEndTime:this.method.timeChange(this.uploadTime[1], 6),
        format:formatStr,
        limitVideoTime:this.videoTime,
        size:this.setsize,
        retransmit:this.reUoload,
        numberOfEntries:this.partnum,
        numberOfWorks:this.worknum,
      };
      this.httpService.put(appApis.onlineAct_update.url,postStr,
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
    }else{
      this._message.error('请填写完整信息');
    }

  }
  cancel(){
    this.modal.destroy({ success: true });
  }

}
