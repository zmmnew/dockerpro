import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterComponent } from './center/center.component';
import {RouterModule} from '@angular/router';
import {userCenterRoute} from './user-center.route';
import { MyActComponent } from './my-act/my-act.component';
import { MyInfoComponent } from './my-info/my-info.component';
import { MyactDelComponent } from './myact-del/myact-del.component';
import {ShareModule} from '../../common/share/share.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { ReuploadComponent } from '../item/reupload/reupload.component';

@NgModule({
  declarations: [CenterComponent, MyActComponent, MyInfoComponent, MyactDelComponent],
  imports: [
    CommonModule,
    ShareModule,
    NgZorroAntdModule,
    RouterModule.forChild(userCenterRoute)
  ],
})
export class UserCenterModule { }
