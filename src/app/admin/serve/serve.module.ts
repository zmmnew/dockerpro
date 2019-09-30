import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {serveRoute} from './serve.route';
import { OnlineActComponent } from './online-act/online-act.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ShareModule} from '../../common/share/share.module';
import { AddComponent } from './online-act/add/add.component';
import { NoteComponent } from './online-act/note/note.component';
import { AnnounceComponent } from './online-act/note/announce/announce.component';
import { AnnAddComponent } from './online-act/note/announce/ann-add/ann-add.component';
import { SettingComponent } from './online-act/setting/setting.component';
import { UpdateSetComponent } from './online-act/setting/update-set/update-set.component';
import { ExperComponent } from './online-act/setting/exper/exper.component';
import { PublicationComponent } from './online-act/setting/publication/publication.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ActadminComponent } from './online-act/actadmin/actadmin.component';
import { InfoComponent } from './online-act/info/info.component';
import { RuleComponent } from './online-act/setting/rule/rule.component';
import { AddExComponent } from './online-act/setting/exper/add-ex/add-ex.component';
import { ActApplyComponent } from './act-apply/act-apply.component';
import { ApplyComponent } from './act-apply/apply/apply.component';
import { UploadActComponent } from './act-apply/upload-act/upload-act.component';
import { AddZuopinComponent } from './act-apply/upload-act/add-zuopin/add-zuopin.component';
import { GradeComponent } from './grade/grade.component';
import { AddGradeComponent } from './grade/add-grade/add-grade.component';
import { CheckComponent } from './sign-up/check/check.component';
import { AuthorListComponent } from './sign-up/author-list/author-list.component';
import { GradeListComponent } from './sign-up/grade-list/grade-list.component';
import {ClipboardModule} from 'ngx-clipboard';

@NgModule({
  declarations: [
    OnlineActComponent,
    AddComponent,
    NoteComponent,
    AnnounceComponent,
    AnnAddComponent,
    SettingComponent,
    UpdateSetComponent,
    ExperComponent,
    PublicationComponent,
    SignUpComponent,
    ActadminComponent,
    InfoComponent,
    RuleComponent,
    AddExComponent,
    ActApplyComponent,
    ApplyComponent,
    UploadActComponent,
    AddZuopinComponent,
    GradeComponent,
    AddGradeComponent,
    CheckComponent,
    AuthorListComponent,
    GradeListComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgZorroAntdModule,
    ClipboardModule,
    ShareModule,
    RouterModule.forChild(serveRoute)
  ],
  entryComponents:[
    AddComponent,
    NoteComponent,
    AnnounceComponent,
    AnnAddComponent,
    SettingComponent,
    UpdateSetComponent,
    ExperComponent,
    PublicationComponent,
    ActadminComponent,
    InfoComponent,
    RuleComponent,
    AddExComponent,
    ApplyComponent,
    AddZuopinComponent,
    UploadActComponent,
    AddGradeComponent,
    CheckComponent,
    AuthorListComponent,
    GradeListComponent
  ]
})
export class ServeModule { }
