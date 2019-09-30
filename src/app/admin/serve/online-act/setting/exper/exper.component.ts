import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../../common/constant/apis';
import {HttpService} from '../../../../../common/service/http-service.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {AddExComponent} from './add-ex/add-ex.component';
import {Method} from '../../../../../common/service/method';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-exper',
  templateUrl: './exper.component.html',
  styleUrls: ['./exper.component.scss']
})
export class ExperComponent implements OnInit {
  actId;
  actInfo;
  @Input() set info(value){
    // console.log(value);
    // this.actInfo = value;
    if(value){
      this.actId= value.id;
      // if(value.reviewStartTime){
      //   this.seltime = [value.reviewStartTime , value.reviewEndTime];
      // }
      // this.fValue = value.scoringSettings;
    }
  }
  page = {
    total:1,
    index:1,
    size:15
  };
  seltime=[];
  list=[];
  fValue='十分制，保留两位小数';
  fType=[
    // '十分制，取整',
    '十分制，保留两位小数',
    // '十分制，保留一位小数',
    // '百分制，取整',
    // '百分制，保留两位小数',
    // '百分制，保留一位小数',
  ];
  loading = true;
  constructor(private method:Method,private _message: NzMessageService,private httpService: HttpService,private modalService: NzModalService,) { }

  ngOnInit() {
    this.getDel();
    this.getlist();
  }
  getDel(){
    this.httpService.get(appApis.actDelbyid.url+'/'+ this.actId,
      data => {
        if (data.code == 1){
          this.actInfo = data.data;
            if(this.actInfo.reviewStartTime){
              this.seltime = [this.method.time(this.actInfo.reviewStartTime) , this.method.time(this.actInfo.reviewEndTime)];
            }
            this.fValue = this.actInfo.scoringSettings;

        }
      },
      error => {
        console.error(error);
      });
  }



  timeChange(event){
    if(!this.actInfo.uploadEndTime){
      return this._message.error('需先填写活动报名时间');
    }
    let actstart = new Date(this.actInfo.uploadEndTime).getTime();
    let uptime =new Date(this.seltime[0]).getTime();
    if(actstart>uptime){
      return this._message.error('评审开始时间需晚于活动报名结束时间');
    }
  }
  save(){
    if(this.actInfo.status !== '准备中' && this.actInfo.status !== '报名中' && this.actInfo.status !== '评审中'){
      return this._message.error('该活动已过评审阶段，无法更改');
    }
    if(!this.actInfo.uploadEndTime){
      return this._message.error('需先填写活动报名时间');
    }
    let actstart = new Date(this.actInfo.uploadEndTime).getTime();
    // let actend = new Date(this.actInfo.activityEndTime).getTime();
    let pingStart = new Date(this.seltime[0]).getTime();
    // let pingEnd = new Date(this.seltime[1]).getTime();

    if(actstart<pingStart){
      let postStr =  {
        id:this.actId,
        reviewStartTime:this.method.timeChange(this.seltime[0], 6),
        reviewEndTime:this.method.timeChange(this.seltime[1], 6),
        scoringSettings:this.fValue
      };
      // console.log(this.seltime);
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
      this._message.success('评审时间段应在活动报名结束时间之后');
    }

  }

  getlist(){
    this.loading = true;
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      orderBy:'createTime desc',
      params:{
        activityOnlineId:this.actId
      }
    };
    this.httpService.post(appApis.userAdminPage.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.page.total = data.data.total;
          this.list = data.data.list;
        }
      },
      error => {
        console.error(error);
      });
  }
  repassw(info){
    this.modalService.confirm({
      nzTitle: '<p>你确定将该管理员密码重置为123456吗？</p>',
      nzOnOk: () => this.repwhttp(info.id)
    });
  }
  repwhttp(id){
    let postStr = {
      id:id,
      password:Md5.hashStr('123456'),
    };
    this.httpService.put(appApis.userAdminUpdate.url,postStr,
      data => {
        if (data.code == 1){
          this._message.success('修改成功');
          this.getlist();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  openM(tit,type,info){
    const modal = this.modalService.create({
      nzTitle:tit,
      nzWidth:600,
      nzContent: AddExComponent,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        type:type,
        info:info,
        act:this.actInfo
      }
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.success){
        this.getlist();
      }
    });
  }
  actdet(id){
    this.modalService.confirm({
      nzTitle: '你确定删除吗',
      nzOnOk: () => this.delete(id)
    });
  }
  delete(id){
    this.httpService.delete(appApis.userAdminDelete.url+'/'+id,
      data => {
        if (data.code == 1){
          this._message.error('删除成功');
          this.getlist();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
}
