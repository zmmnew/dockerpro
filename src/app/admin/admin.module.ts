import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutComponent} from './layout/layout.component';
import {MenuComponent} from './layout/menu/menu.component';
import {RouterModule} from '@angular/router';
import {adminRoute} from './admin.route';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ShareModule} from '../common/share/share.module';

@NgModule({
  declarations: [LayoutComponent,MenuComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgZorroAntdModule,
    ShareModule,
    RouterModule.forChild(adminRoute)
  ]
})
export class AdminModule { }
