import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {HttpService} from '../../service/http-service.service';
import {Md5} from 'ts-md5';
import {appApis} from '../../constant/apis';
import {Method} from '../../service/method';
declare let AliyunUpload:any;
// declare let videojs:any;
@Component({
  selector: 'app-ali-omd',
  templateUrl: './ali-omd.component.html',
  styleUrls: ['./ali-omd.component.scss']
})
export class AliOmdComponent implements OnInit {
  @Input() set uploadAli(value){
    this.uploadType = value.isChunk;
    this.type = value.type;
  }
  @Input() size;
  @Input() limitVideoTime;
  @Output() retupload= new EventEmitter();
  @Input() set accept(value){
    if(value){
      this.fileAccept='';
      this.filetype='';
      value =value.split(",");
      value.forEach((item)=>{
        if(item){
          this.fileAccept += 'video/'+item+',';
          this.filetype +=  item+',';
        }
      });
    }
    this.fileAccept =  this.fileAccept.substring(0,this.fileAccept.length-1);
    // console.log( this.fileAccept);
    // console.log( this.filetype);
  }
  fileAccept = '';
  filetype = '';
  percent;
  uploader;
  uploadType;
  type;
  file;
  blocks=[];
  fileFingerString;
  chunkSize = 5*1024*1024; //计算指纹分块大小 固定值不动
  step = 0;
  videoDura = 0;
  isupload=0;
  isreader=0;
  videosrc;
  ifoff = 0;
  iswx= 0;
  constructor(
    private httpService: HttpService,
    private _message: NzMessageService,
    private modalService: NzModalService,
    private method:Method,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.setSts();
    this.initVOD();
  }

  //选择文件
  uploadFile(event){
    if(this.isreader == 1 || this.isupload == 1){
      return this._message.error('视频上传过程中无法更换视频');
    }
    if(event){
      let file = event.target.files[0];
      if(!file){return false;}
      this.file = file;
      $('.noteInfo').html('正在读取文件..');
      $('.meng').fadeIn(500);
      if( event.target.files[0].size > this.size*1024*1024 ){
        this.stop();
        $('#t4').val('');
        return this._message.error('您选择的视频大小不符合要求，上传视频大小应在'+this.size +'M以内');
      }
      let filetype = file.name.split(".")[file.name.split(".").length - 1];
      if(this.filetype.indexOf(filetype.toLowerCase()) == -1){
        // alert(filetype.toLowerCase());
        $('#t4').val('');
        return this._message.error('您选择的视频格式不符合要求，上传视频格式应为'+this.filetype);
      }


      let ua = navigator.userAgent.toLowerCase();
      if(''+ ua.match(/MicroMessenger/i)=='micromessenger') {
        this.iswx = 1;
        this.step = 1;
        let url = URL.createObjectURL(file);
        let videos =document.getElementById("audio_id");
        videos['src'] = url;
        setTimeout(()=>{
            this.file.duration = this.method.formatSeconds(videos['duration']);
              if(videos['duration'] > this.limitVideoTime){
                this.stop();
                $('#t4').val('');
                return this._message.error('您选择的视频时长不符合要求，上传视频时长应在'+this.limitVideoTime+'s以内');
              }
          // window.URL = window.URL || window['webkitURL'];
          // let blob=new Blob([file],{ type: 'video/mov' });
          // this.videosrc = window.URL.createObjectURL(file);
          // // window.navigator.msSaveOrOpenBlob( window.URL.createObjectURL(file));
          // alert(this.videosrc);
          // setTimeout(()=>{
          //   alert($('#video')[0]['src']);
          //
          // },1000)
          // this.videosrc = url;
          // this.cuteFile(0,file);
          // let blob = new Blob([file],{ type: 'video/mp4' }), // 文件转化成二进制文件
          //   vurl = window.URL.createObjectURL(blob);
          // alert(vurl);
          // this.videosrc = vurl;

          // let fr = new FileReader();
          // fr.readAsDataURL(file);  // 将文件读取为Data URL
          // fr.onload =(e)=> {
          //   this.isreader = 1;
          //   let result = e.target['result'];
          //   this.videosrc = result;
          //   let vi = document.getElementById('video');
          //   setTimeout(function(){
          //     if(vi.readyState>0){
          //       alert(vi.duration);
          //     }
          //   },500);
          //   this.step = 1;
            this.cuteFile(0,file);
          // };

        },2000);




      }else{
        let video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = ()=> {
          // window.URL.revokeObjectURL(video.src);
          // alert(video.src);
          let duration = video.duration;
          if(duration > this.limitVideoTime){
            this.stop();
            $('#t4').val('');
            return this._message.error('您选择的视频时长不符合要求，上传视频时长应在'+this.limitVideoTime+'s以内');
          }
          this.videoDura = duration;
          let time = this.method.formatSeconds(duration);
          this.step = 1;
          // console.log(time);
          this.file.duration = time;
          // alert(this.file.duration);

          let vurl = window.URL || window['webkitURL'];
          let url = vurl.createObjectURL(file);
          // // window.navigator.msSaveOrOpenBlob(url);
          this.videosrc = url;
          // this.cuteFile(0,file);
          // // console.log(window.URL);
          // // alert(window['webkitURL']);
          // // alert(this.videosrc);
          // setTimeout(()=>{
          //   console.log($('#video')[0]['src']);
          //
          // },1000)


          // let fr = new FileReader();
          // fr.readAsDataURL(file);  // 将文件读取为Data URL
          // fr.onload =(e)=> {
          //   this.isreader = 1;
          //   let result = e.target['result'];
          //   let vidoe = $('<video controls id="video" style="width:100%;height:100%;background: #000;" src="' + result + '">');
          //   $('#videobox').html('').append(vidoe);
            this.cuteFile(0,file);
          // };
        };
        video.src = URL.createObjectURL(file);

      }


    }
  }

  //文件切片递归
  cuteFile(i, file){
    // if(this.status == 1){
      let blockNum = Math.ceil(file.size / this.chunkSize);
      let nextSize = Math.min((i+1) * this.chunkSize, file.size);
      let blockData  = file.slice(i * this.chunkSize, nextSize);
      let reader = new FileReader();
      reader.readAsText(blockData);
      // reader.readAsDataURL(blockData);
      reader.onload = ()=> {
        if(reader.result){
          let blockMd5 = Md5.hashStr(reader.result.toString());
          this.blocks.push({i:i,rangeFingerprint:blockMd5,fileFingerprint:''});
          this.fileFingerString += blockMd5;
          $('.noteInfo').html('正在读取文件..'+ Math.floor((i/blockNum) * 100)+ "%");
          if(this.blocks.length == blockNum){
            let fileMD5 = Md5.hashStr(this.fileFingerString);
            file.filemd5 = fileMD5;
            this.blocks.forEach(item=>{ item.fileFingerprint = fileMD5});
            this.fileCheak(fileMD5,file);
          }else{
            this.cuteFile(this.blocks.length,file);
          }
        }
      };
    // }
  }
  //检验文件
  fileCheak(fileMD5,file){
    // this.status = 5;
    $('.noteInfo').html('正在校验文件...');
    this.httpService.get(appApis.aliVod_fp.url+'/'+ fileMD5 ,
      data => {
        // this.status=2;
        if (data.code == 0){
          let userData = '{"Vod":{"Title":"'+this.file.name+'"}}';
          this.uploader.addFile(file, null, null, null,userData);
          this.uploader.startUpload();
          this.isreader = 0;
          this.isupload = 1;
        }else if(data.code == 1){
          let s = data.data;
          let suffix = '.'+file.name.split(".")[file.name.split(".").length - 1];
          let getStr = {suffix:suffix,fingerprint:fileMD5, name: this.file.name, type:s.type, size:s.size, videoId: s.videoId,app:'视频'};
          this.uploadSecond(getStr);
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  initVOD(){
    this.uploader = new AliyunUpload.Vod({
      userId:"222956757737873775",   //阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
      partSize: 3*1024*1024,  //分片大小默认1M，不能小于100K
      parallel: 1,  //并行上传分片个数，默认5
      retryCount: 3,   //网络原因失败时，重新上传次数，默认为3
      retryDuration: 2,  //网络原因失败时，重新上传间隔时间，默认为2秒
      'onUploadstarted':(uploadInfo)=> {  // 开始上传
        this.uploader.setSTSToken(uploadInfo, localStorage.getItem('AccessKeyId'), localStorage.getItem('AccessKeySecret'), localStorage.getItem('SecurityToken'));
      },
      'onUploadSucceed':(uploadInfo)=> {// 文件上传成功
        // $('.meng').fadeOut(500);
        let suffix = '.'+this.file.name.split(".")[this.file.name.split(".").length - 1];
        let getStr = {suffix:suffix,fingerprint:this.file.filemd5,name: this.file.name, type:this.file.type, size:this.file.size, videoId: uploadInfo.videoId,app:'视频'};
        this.uploadSecond(getStr);
      },
      'onUploadFailed':  (uploadInfo, code, message) =>{ // 文件上传失败
        // this.status =3;
        // this.progressStatus = 'exception';
        $('.noteInfo').html(message);
      },
      'onUploadProgress':  (uploadInfo, totalSize, loadedPercent)=> {// 文件上传进度，单位：字节
        // this.status =2;
        this.percent =  Math.ceil(loadedPercent * 100);
        // let height = $('.meng').height();
        // console.log(height);
        // $('.meng').height(height - height/100 * this.percent);
        // console.log($('.meng').height());
        $('.noteInfo').html(this.percent + '%');
      },
      'onUploadTokenExpired':(uploadInfo)=> {// 上传凭证超时
        this.getSTS();
        this.uploader.resumeUploadWithSTSToken(localStorage.getItem('AccessKeyId'), localStorage.getItem('AccessKeySecret'), localStorage.getItem('SecurityToken'));
      },
      'onUploadEnd':(uploadInfo)=>{//全部文件上传结束
        this.clear();
      }
    });
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
        }else{
          this._message.error('权限请求失败，请重试');
        }
      },
      error => {
        console.error(error);
      });
  }

  uploadSecond(getStr){
    this.httpService.post(appApis.aliVod_add.url, getStr,
      data => {
        this.isupload = 0;
        if(data.code==1){
          // this.isUpload = true;
          // this.status =3;
          // this.progressStatus = 'success';
          this.retupload.emit({videoId:getStr.videoId,duration:this.videoDura});
          if(this.iswx ==1){
            $('.noteInfo').html('微信浏览器暂不支持预览');
          }else{
            $('.noteInfo').html('上传完成...');
            $('.meng').fadeOut(500);
          }

          this._message.success('上传完成');
          this.clear();
        }else{
          $('.noteInfo').html(data.message);
        }
      },
      error => {
        console.error(error);

      });
  }
  clear(){
    setTimeout(()=>{
      this.isreader = 0;
      this.isupload=0;
      this.blocks=[];
      this.fileFingerString='';
    },1000);
  }
  stop(){
    this.file=null;
    this.step = 0;
    this.isreader = 0;
    this.isupload=0;
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
