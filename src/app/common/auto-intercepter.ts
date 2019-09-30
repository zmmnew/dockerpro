import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from "rxjs";
import { tap } from "rxjs/operators";
import {NzMessageService} from 'ng-zorro-antd';
/**
 * @description 拦截器，拦截所有http请求
 *  目前实现功能：
 *    1.请求的header中增加token
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  issure = false;
  constructor(
    private router: Router,
    private _message: NzMessageService
  ) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if(this.issure == false){
      // this.issure = true;
      let token = localStorage.getItem('token');
      if (token) {
        const authReq = request.clone(
          {
            url: request.url,
            headers: request.headers.set('token', token)
          }
        );
        return next.handle(authReq).pipe(
          tap(event => {
            // console.log(event);
            // this.issure = false;
            if (event instanceof HttpResponse) {

              /*登陆失败或认证失败，请重新登陆  错误码 5002
                token令牌校验错误 错误码5001*/
              if (event.body.code === 5001 || event.body.code === 5002) {

                // this.subject.destroy();
                this.router.navigate(['/login']);
                localStorage.removeItem("usid");
                localStorage.removeItem("token");
              }
            }
          }));
      } else {
        return next.handle(request);
      }
    // }else{
      // this._message.error(`请求太频繁，请稍后再试`);
    // }

  }


}

