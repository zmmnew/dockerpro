import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.scss']
})
export class LoginBoxComponent implements OnInit {
  @Input() login;
  constructor(
    private modal: NzModalRef,
  ) { }

  ngOnInit() {
  }
  change(event){ // 1 登录 2 注册 3 忘记密码 4 关闭弹窗
    if(event == 4){
      this.modal.destroy({ success: true });
    }else{
      this.login = event;
    }
  }
}
