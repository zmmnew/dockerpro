import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../constant/apis';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {HttpService} from '../../service/http-service.service';
declare var Aliplayer:any;
@Component({
  selector: 'app-ali-videoplay',
  templateUrl: './ali-videoplay.component.html',
  styleUrls: ['./ali-videoplay.component.scss']
})
export class AliVideoplayComponent implements OnInit {
  @Input() url;
  constructor(
    private httpService: HttpService,
    private _message: NzMessageService,
  ) { }
  ngOnInit() {
    this.getSTS();
    setTimeout(()=>{

    },500);
  }
  initAliPlay() {
    console.log(this.url);
    let player = new Aliplayer({
      id: 'videosamplex',
      width: '100%',
      autoplay: true,
      vid : this.url,
      // source:'http://livepull.wenmind.com/mytest/aaa.flv?auth_key=1594782261-0-0-b17767b178b8931adaa5af1ad53f468a',
      accessKeyId:localStorage.getItem('AccessKeyId'),
      securityToken: localStorage.getItem('SecurityToken'),
      accessKeySecret:localStorage.getItem('AccessKeySecret'),
      region:'cn-shanghai',//eu-central-1,ap-southeast-1
    },function(player){

      // console.log(player);
      // console.log('播放器创建好了。')
    })
  }
  setSts(){
    if(localStorage.getItem('SecurityToken')){
      let time =  (new Date().getTime()-Number(localStorage.getItem('expireTime')) )/1000;
      if(time>3000){
        this.getSTS();
      }
    }else{
      this.getSTS();
    }
  }
  getSTS(){
    this.httpService.get(appApis.alists.url,
      data => {
        if(data.code == 1 && data.data){
          localStorage.setItem('SecurityToken',data.data.SecurityToken);
          localStorage.setItem('AccessKeyId',data.data.AccessKeyId);
          localStorage.setItem('AccessKeySecret',data.data.AccessKeySecret);
          localStorage.setItem('expireTime', ''+ new Date().getTime());
          this.initAliPlay();
        }else{
          this._message.error('权限请求失败，请重试');
        }
      },
      error => {
        console.error(error);
      });
  }
}
