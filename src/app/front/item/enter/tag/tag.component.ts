import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {appApis} from '../../../../common/constant/apis';
import {HttpService} from '../../../../common/service/http-service.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() set tag(value){
    this.inputBox = [];
  };
  @Input() group;
  @Output() userBox = new EventEmitter();
  pcVisible = false;
  appVisible = false;
  inputBox = [];
  isPc;
  meng = {padding:0};
  constructor(private httpService: HttpService,private _message: NzMessageService) { }

  ngOnInit() {
    this.isPc = document.body.clientWidth > 800? 1:0;
    // console.log();
  }
  showInput(): void {
    // console.log(this.inputBox);
    // if(this.inputBox){
      if(this.inputBox.length<3) {
        if (this.isPc) {
          this.pcVisible = true;
        } else {
          this.appVisible = true;
        }
      }else{
        this._message.error('一个组合最多三个人，最少两人');
      }
    // }else{
    //   if (this.isPc) {
    //     this.pcVisible = true;
    //   } else {
    //     this.appVisible = true;
    //   }
    // }

  }

  addpChange(event){
    if(event&&event.close){
      this.pcVisible = false;
      this.appVisible = false;
    }
    if(event&& event.add){
      this.pcVisible = false;
      this.appVisible = false;
      let istrue =0;
      if(this.inputBox.length >0){
        this.inputBox.forEach((item,index)=>{
          if(item.checkUser == event.add.checkUser){
            istrue = 1;
            return this._message.error('不能重复填加相同的用户');
          }
          if((index+1) == this.inputBox.length ){
            if(istrue == 0){

              this.inputBox.push(event.add);
              // console.log(this.inputBox);
              this.userBox.emit({user:this.inputBox});
            }
          }
        });
      }else{
        this.inputBox.push(event.add);
        this.userBox.emit({user:this.inputBox});
      }

    }
  }
  findUser(){

    // this.inputBox.push()
    // this.inputBox= [];
    // this.httpService.get(appApis.getUserListByAId.url+'/'+ this.zuoId,
    //   data => {
    //     if (data.code == 1){
    //       if(data.data){
    //         this.inputBox = data.data;
    //       }
    //     }
    //   },
    //   error => {
    //     console.error(error);
    //   });
  }
  close(index){
    this.inputBox.splice(index,1);
    this.userBox.emit({user:this.inputBox});
  }

}
