import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {frontRoute} from './front.route';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoginComponent } from './layout/login-box/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { RegisterComponent } from './layout/login-box/register/register.component';
import { LoginBoxComponent } from './layout/login-box/login-box.component';
import { ForgetPwComponent } from './layout/login-box/forget-pw/forget-pw.component';
import {ShareModule} from '../common/share/share.module';
import {InfostatusService} from './infostatus.service';
@NgModule({
  declarations: [LayoutComponent, HeaderComponent, FooterComponent, LoginComponent, RegisterComponent, LoginBoxComponent, ForgetPwComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShareModule,
    NgZorroAntdModule,
    RouterModule.forChild(frontRoute)
  ],
  providers:[
    InfostatusService
  ],
  exports:[LoginComponent, RegisterComponent, LoginBoxComponent, ForgetPwComponent],
  entryComponents:[LoginComponent,RegisterComponent,LoginBoxComponent,ForgetPwComponent]
})
export class FrontModule { }
