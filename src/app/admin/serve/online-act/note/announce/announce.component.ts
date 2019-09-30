import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../../common/constant/apis';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {HttpService} from '../../../../../common/service/http-service.service';
import {AnnAddComponent} from './ann-add/ann-add.component';
import {Method} from '../../../../../common/service/method';

@Component({
  selector: 'app-announce',
  templateUrl: './announce.component.html',
  styleUrls: ['./announce.component.scss']
})
export class AnnounceComponent implements OnInit {
  @Input() actId;
  page = {
    total:1,
    index:1,
    size:15
  };
  loading;
  aname;
  searchTime;
  announcelist=[];
  constructor(
    private _message: NzMessageService,
    private modal: NzModalRef,
    private httpService: HttpService,
    private modalService: NzModalService,
    private method:Method,
  ) { }

  ngOnInit() {
    this.getAnnPage();
  }
  onChange(result: Date){
    // console.log('onChange: ', result);
  }
  showModalAnn(tit,type,info){
    const modal = this.modalService.create({
      nzTitle:tit,
      nzWidth:700,
      nzContent: AnnAddComponent,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        actId:this.actId,
        type:type,
        info:info
      }
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.success){
        this.getAnnPage();
      }
    });
  }
  getAnnPage(){
    this.loading = true;
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      orderBy:'createTime desc',
      params:{
        activityOnlineId:this.actId,
        name:this.aname,
        beginTime:this.searchTime?this.method.timeChange(this.searchTime[0],''):'',
        endTime:this.searchTime?this.method.timeChange(this.searchTime[1],''):'',
      }
    };
    this.httpService.post(appApis.actNote_page.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.page.total = data.data.total;
          this.announcelist = data.data.list;
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  fileDelet(id){
    this.httpService.delete(appApis.actNote_delete.url+'/'+id,
      data => {
        this.loading = false;
        if (data.code == 1){
          this._message.success('操作成功');
          this.getAnnPage();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  sengmsg(info){
    this.modalService.confirm({
      nzTitle: '你确定推送该通知吗',
      nzOnOk: () => this.sendhttp(info)
    });

  }
  sendhttp(info){
    let postStr = {
      "title":info.name,
      "id":info.id,
      "type":'通知公告'
    };
    // console.log(postStr);
    this.httpService.post(appApis.seng_msg.url,postStr,
      data => {
        if (data.code == 1){
          this._message.success('发送成功');
        }
      },
      error => {
        console.error(error);
      });
  }
}
