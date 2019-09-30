import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
@Injectable()
export class InfostatusService {
  infostatus: any;
  private subject = new Subject<any>();
  sendMessage(infostatus: any ) {
    this.subject.next(infostatus);
  }
  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<any> {
    // 添加观察者
    return this.subject.asObservable();
  }
}
