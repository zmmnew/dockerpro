import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ShareModule} from '../../common/share/share.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {userRoute} from './user.route';
import { ActUserComponent } from './act-user/act-user.component';
import { UserCheckComponent } from './act-user/user-check/user-check.component';
import { ActnumDelComponent } from './act-user/actnum-del/actnum-del.component';
import { UpdateActnumComponent } from './act-user/actnum-del/update-actnum/update-actnum.component';
import { FrontUserComponent } from './front-user/front-user.component';
import { SignupNumComponent } from './front-user/signup-num/signup-num.component';

@NgModule({
  declarations: [ActUserComponent, UserCheckComponent, ActnumDelComponent, UpdateActnumComponent, FrontUserComponent, SignupNumComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgZorroAntdModule,
    ShareModule,
    RouterModule.forChild(userRoute)
  ],
  entryComponents:[UserCheckComponent,ActnumDelComponent,UpdateActnumComponent,SignupNumComponent]
})
export class UserModule { }
