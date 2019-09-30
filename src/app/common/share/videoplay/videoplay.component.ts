import {Component, Input, OnInit} from '@angular/core';
declare var ckplayer: any;
@Component({
  selector: 'app-videoplay',
  templateUrl: './videoplay.component.html',
  styleUrls: ['./videoplay.component.scss']
})
export class VideoplayComponent implements OnInit {
  @Input() type; //1 rtmp 2 flv 3 m3u8
  @Input() url;
  @Input() islive;
  constructor() { }

  ngOnInit() {
    setTimeout(()=>{
      this.playInit();
    })
  }
  playInit(){
    let videoObject = {
      container: '.videosamplex',//“#”代表容器的ID，“.”或“”代表容器的class
      variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
      poster:'pic/wdm.jpg',
      mobileCkControls:true,//是否在移动端（包括ios）环境中显示控制栏
      mobileAutoFull:false,//在移动端播放后是否按系统设置的全屏播放
      h5container:'#videoplayer',//h5环境中使用自定义容器
      live:this.islive,
      autoplay:true, //自动播放
      video:this.url//视频地址

    };
    let player=new ckplayer(videoObject);
  }
}
