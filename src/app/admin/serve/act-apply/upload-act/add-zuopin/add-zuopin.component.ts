import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {appApis} from '../../../../../common/constant/apis';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {HttpService} from '../../../../../common/service/http-service.service';
import {ALIURL} from '../../../../../common/config/config';

@Component({
  selector: 'app-add-zuopin',
  templateUrl: './add-zuopin.component.html',
  styleUrls: ['./add-zuopin.component.scss']
})
export class AddZuopinComponent implements OnInit {
  zuopinId;
  worksType = '国画';
  disabled;
  zuoname;
  personname;
  phone;
  sex='男';
  address;
  unit;
  description;
  actType;
  age;
  @Input() actInfo;
  @Input() set type(value){
    this.actType = value;
  };
  @Input() set info(value){
    if(value){
      this.zuopinId = value.id;
      this.zuoname = value.name;
      this.phone = value.mobile;
      this.imgPath = value.works;
      this.worksType = value.worksType;
      this.description = value.description;
      this.getUser();
    }
  };
  imgPath;
  private aliUrl: string = ALIURL;
  uploadParams = {
    isChunk:false,
    type:'image/*',
    isCropper:false,
    ratio:1/2,
    zuopin:true,
  };
  constructor(
    private _message: NzMessageService,
    private modal: NzModalRef,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
  }
  save(){
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if(!myreg.test(this.phone)){
      return this._message.error('请填写正确的手机号');
    }
    if(this.actType == 0){
      this.checkUser();
    }else if(this.actType == 1){
      this.update();
    }

  }
  getUser(){
    this.httpService.get(appApis.getUserListByAId.url+'/'+this.zuopinId ,
      data => {
        if (data.code == 1){
          this.personname = data.data[0].nickName;
          this.sex = data.data[0].gender;
          this.age = data.data[0].age;
          this.unit = data.data[0].unit;
           this.address = data.data[0].address;
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  checkUser(){
    if(this.zuoname && this.personname&& this.phone&& this.sex&& this.age&& this.address&&this.unit &&this.imgPath){
      // 作品类别，作者姓名，联系电话，性别，年龄 ，活动id
      let postStr =  {
        checkUser:''+ this.worksType+'-'+ this.personname+'-'+this.phone+'-'+this.sex+'-'+this.age+'-'+this.actInfo.id
      };
      this.httpService.post(appApis.frontcheckuser.url,postStr ,
        data => {
          if (data.code == 1){
            this.checkMobile();
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
  checkMobile(){
    this.httpService.get(appApis.frontcheckmobile.url+'/'+this.phone ,
      data => {
        if (data.code == 1){
          this.addAct();
        }else{
          this._message.error('一个手机号只允许报名两次');
        }
      },
      error => {
        console.error(error);
      });
  }
  addAct(){
    if(this.imgPath && this.zuoname && this.phone){
      let postStr =  {
        activityOnlineId:this.actInfo.id,
        activityType:this.actInfo.type,
        name:this.zuoname,
        userId: localStorage.getItem('adminid'),
        userName:this.personname,
        mobile:this.phone,
        works:this.imgPath,
        worksType:this.worksType,
        description:this.description,
        region:JSON.parse(localStorage.getItem('userInfo')).region
      };
      this.httpService.post(appApis.upload_add.url,postStr ,
        data => {
          if (data.code == 1){
            this.addUser(data.data.id);
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
  addUser(id){
    if(this.personname && this.age && this.address){
      let postStr =  {
        signUpId:id,
        nickName:this.personname,
        name:this.phone,
        gender:this.sex,
        age:this.age,
        unit:this.unit,
        address:this.address,
        checkUser:''+ this.worksType+'-'+ this.personname+'-'+this.phone+'-'+this.sex+'-'+this.age+'-'+this.actInfo.id
      };
      this.httpService.post(appApis.user_useradd.url,postStr ,
        data => {
          if (data.code == 1){
            this.modal.destroy({ success: true });
            this._message.success('操作成功');
          }else{
            this.delete(id);
            this._message.error('报名信息有误，报名失败');

          }
        },
        error => {
          console.error(error);
        });
    }else{
      this._message.error('请填写完整信息');
    }

  }
  delete(id){
    this.httpService.delete(appApis.zuopin_delete.url+'/'+id,
      data => {
        if (data.code == 1){
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  update(){
    let postStr =  {
      id:this.zuopinId,
      name:this.zuoname,
      userName:this.personname,
      mobile:this.phone,
      gender:this.sex,
      age:this.age,
      works:this.imgPath,
      worksType:this.worksType,
      unit:this.unit,
      address:this.address,
      description:this.description
    };
    this.httpService.put(appApis.upload_update.url,postStr,
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
  }
  cancel(){
    this.modal.destroy();
  }
  //==========上传图片====================
  //上传完成图片
  retImg(event){
    this.imgPath =this.aliUrl+ event;
  }
}
