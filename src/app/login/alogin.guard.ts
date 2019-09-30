import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable()

export class LoginGuard implements CanActivate {
  constructor(private router: Router) {
  }
  canActivate(){
    if (!localStorage.getItem('adminid')) {
      // console.log("请先登录");
      this.router.navigate(['/aLogin']);
      return false;
    } else {
      return true;
    }
  }
}
