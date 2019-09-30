import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {appApis} from '../../../common/constant/apis';
import {HttpService} from '../../../common/service/http-service.service';
import {ItemService} from '../item.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {
  publist=[];
  page={size:16,index:1,total:0};
  actId;
  actdel;
  isSpinning = false;
  classBox = ['全部','国画','传统毛笔字画'];
  selclassify = '全部';
  status;
  constructor(
    private router:Router,
    private httpService: HttpService,
    private itemService:ItemService
  ) {
    if(this.itemService.itemId){
      this.actId = this.itemService.itemId;
    }else{
      this.actId = localStorage.getItem('actId');
      this.itemService.sendMessage(this.actId);
      this.itemService.itemId = this.actId;
    }

  }

  ngOnInit() {
    scroll(0,0);
    this.getDel();

  }
  getDel(){
    this.isSpinning = true;
    this.httpService.get(appApis.actDelbyid.url+'/'+ this.actId,
      data => {
        this.isSpinning = false;
        if (data.code == 1){
          if(data.data){
            this.actdel = data.data;
            if(this.actdel.publicContent == '全部审核通过的作品'){
              this.status = '审核通过加入围';
            }else if(this.actdel.publicContent == '全部入围的作品'){
              this.status = '已入围';
            }
            this.getList();
          }

        }
      },
      error => {
        console.error(error);
      });
  }
  findcla(name){
    this.selclassify = name;
    this.getList();
  }
  changeindex(){
    this.getList();
  }
  getList(){
    this.isSpinning = true;
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      orderBy:'createTime desc',
      params: {
        worksType:this.selclassify == '全部'?'':this.selclassify,
        activityOnlineId:this.actId,
        worksStats:this.status
      }
    };
    this.httpService.post(appApis.zuopin_page.url,postStr,
      data => {
        this.isSpinning = false;
        if (data.code == 1){
          if(data.data){
            this.publist = data.data.list;
            this.page.total = data.data.total;
            console.log(this.page.total)
            this.publist.forEach((item)=>{
              item.videoTime = this.formatSeconds(item.videoTime)
            })
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  todel(id){
    this.router.navigate(['front/item/pubDel'],{queryParams:{id:id}});
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
