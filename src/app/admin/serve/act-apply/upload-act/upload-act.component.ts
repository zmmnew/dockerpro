import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../common/constant/apis';
import {Method} from '../../../../common/service/method';
import {HttpService} from '../../../../common/service/http-service.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {AddZuopinComponent} from './add-zuopin/add-zuopin.component';

@Component({
  selector: 'app-upload-act',
  templateUrl: './upload-act.component.html',
  styleUrls: ['./upload-act.component.scss']
})
export class UploadActComponent implements OnInit {
  @Input() info;
  page = {
    total:1,
    index:1,
    size:15
  };
  zuolist =[];
  zuoStauts =['全部','待审核','审核通过','审核不通过','已入围',];
  statusValue='全部';
  actname;
  selectTime;
  loading = false;
  addCompt = AddZuopinComponent;
  constructor(
    private modalService: NzModalService,
    private _message: NzMessageService,
    private httpService: HttpService,
    private method:Method,
  ) { }

  ngOnInit() {
    this.getzuopinPage();
  }
  reset(){
    this.actname='';
    this.selectTime ='';
    this.statusValue = '全部';
    this.getzuopinPage();
  }
  pageSizeChange() {
    this.loading = true;
    setTimeout(()=>{
      this.getzuopinPage();
    },500)
  }

  getzuopinPage(){
    this.loading = true;
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      orderBy:'createTime desc',
      params:{
        name:this.actname,
        worksStats:this.statusValue=='全部'?'':this.statusValue,
        activityType:this.info.type,
        activityOnlineId:this.info.id,
        userId:localStorage.getItem('adminid'),
        workUploadStartTime:this.selectTime?this.method.timeChange(this.selectTime[0],6):'',
        workUploadEndTime:this.selectTime?this.method.timeChange(this.selectTime[1],6):'',
      }
    };
    this.httpService.post(appApis.zuopin_page.url, postStr,
      data => {
        this.loading = false;
        if (data.code == 1){
          this.page.total = data.data.total;
          this.zuolist = data.data.list;
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  showModal(tit,compt,type,info){
    const modal = this.modalService.create({
      nzTitle:tit,
      nzWidth:700,
      nzContent: compt,
      nzFooter: null,
      nzMaskClosable:false,
      nzComponentParams: {
        type:type,
        info:info,
        actInfo:this.info
      },
    });
    modal.afterClose.subscribe((result) =>{
      if(result && result.success){
        this.getzuopinPage();
      }
    });
  }
  zuopindet(id){
    this.modalService.confirm({
      nzTitle: '您确定要删除该作品吗',
      nzOnOk: () => this.delete(id)
    });
  }
  delete(id){
    this.httpService.delete(appApis.zuopin_delete.url+'/'+id,
      data => {
        if (data.code == 1){
          this._message.success('操作成功');
          this.getzuopinPage();
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
}
