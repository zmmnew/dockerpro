import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role/role.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ShareModule} from '../../common/share/share.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {systemRoute} from './system.route';
import { PremissComponent } from './role/premiss/premiss.component';
import { RoleAddComponent } from './role/role-add/role-add.component';

@NgModule({
  declarations: [RoleComponent, PremissComponent, RoleAddComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgZorroAntdModule,
    ShareModule,
    RouterModule.forChild(systemRoute)
  ],
  entryComponents:[
    PremissComponent,
    RoleAddComponent
  ]
})
export class SystemModule { }
