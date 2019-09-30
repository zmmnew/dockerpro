import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {ItemComponent} from './item.component';
import {ItemIntroComponent} from './item-intro/item-intro.component';
import {NoteComponent} from './note/note.component';
import {EnterComponent} from './enter/enter.component';
import {PublicComponent} from './public/public.component';
import {itemRoute} from './item.route';
import { NoteDelComponent } from './note/note-del/note-del.component';
import { PubDelComponent } from './public/pub-del/pub-del.component';
import {ShareModule} from '../../common/share/share.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ItemService} from './item.service';
import { SignUpComponent } from './enter/sign-up/sign-up.component';
import { BirthdayComponent } from './enter/birthday/birthday.component';
import { TagComponent } from './enter/tag/tag.component';
import { AddpComptComponent } from './enter/tag/addp-compt/addp-compt.component';
import { ZhinanComponent } from './zhinan/zhinan.component';
import {UserCenterModule} from '../user-center/user-center.module';
import {ReuploadComponent} from './reupload/reupload.component';
import {FrontModule} from '../front.module';
import { ReaderComponent } from './enter/reader/reader.component';


@NgModule({
  declarations: [ReuploadComponent, ItemComponent, ItemIntroComponent, NoteComponent, EnterComponent, PublicComponent, NoteDelComponent, PubDelComponent, SignUpComponent, BirthdayComponent, TagComponent, AddpComptComponent, ZhinanComponent, ReaderComponent],
  imports: [
    CommonModule,
    ShareModule,
    FormsModule,
    UserCenterModule,
    FrontModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    RouterModule.forChild(itemRoute)
  ],
  providers:[
    ItemService
  ],
  entryComponents:[
    AddpComptComponent,
    ReaderComponent
  ]
})
export class ItemModule { }
