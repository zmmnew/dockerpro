import {Component, Input, OnInit} from '@angular/core';
import {appApis} from '../../../../common/constant/apis';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {HttpService} from '../../../../common/service/http-service.service';

@Component({
  selector: 'app-add-grade',
  templateUrl: './add-grade.component.html',
  styleUrls: ['./add-grade.component.scss']
})
export class AddGradeComponent implements OnInit {
  @Input() type;
  @Input() set info(value){
    this.zuodel  = value;
    if(value.myGrade){
      this.grade = value.myGrade;
    }
  };
  zuodel;
  grade;
  constructor(
    private modalService: NzModalService,
    private _message: NzMessageService,
    private httpService: HttpService,
    private modal: NzModalRef,
  ) { }

  ngOnInit() {
  }
  save(){
    if(this.type == 1){
      this.update();
    }else{
      this.add();
    }
  }
  change(){
    if(this.grade>10 ||this.grade<0 ){
      return this._message.error('评分无效');
    }
  }
  add(){
    if(!this.grade){
      return this._message.error('评分不能为空');
    }
    if(this.grade>10 ||this.grade<0 ){
      return this._message.error('评分无效');
    }
    let postStr = {
      "worksId":this.zuodel.id,
      "userId":localStorage.getItem('adminid'),
      "grade":this.grade
    };
    this.httpService.post(appApis.grade_add.url, postStr,
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
  update(){
    if(!this.grade){
      return this._message.error('评分不能为空');
    }
    if(this.grade>10 ||this.grade<0 ){
      return this._message.error('评分无效');
    }
    let postStr = {
      "worksId":this.zuodel.id,
      "userId":localStorage.getItem('adminid'),
      "grade":this.grade
    };
    this.httpService.put(appApis.grade_update.url, postStr,
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
}
