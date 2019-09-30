import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
@Injectable()
export class ItemService {
  itemId: string;
  private subject = new Subject<any>();
  sendMessage(itemId: any ) {
    this.subject.next(itemId);
  }
  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<any> {
    // 添加观察者
    return this.subject.asObservable();
  }
}
