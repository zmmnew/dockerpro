import {NgModule, Provider} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgZorroAntdModule} from "ng-zorro-antd";
import { CropperComponent } from './cropper/cropper.component';
import {TrustUrlPipe} from "./trust-url.pipe";
import {EditorComponent} from "./editor";
import {VideoplayComponent} from './videoplay/videoplay.component';
import {AliUploadComponent} from './ali-upload/ali-upload.component';
import { FrontUploadComponent } from './front-upload/front-upload.component';
import {RoleDirective} from './role.directive';
import {TimePipe} from './time.pipe';
import { AliOmdComponent } from './ali-omd/ali-omd.component';
import { AliVideoplayComponent } from './ali-videoplay/ali-videoplay.component';
export const TRUST_URL: Provider[] = [TrustUrlPipe];
export const TIME: Provider[] = [TimePipe];
@NgModule({
  declarations: [EditorComponent, CropperComponent,TRUST_URL, VideoplayComponent,AliUploadComponent, FrontUploadComponent,RoleDirective,TIME, AliOmdComponent, AliVideoplayComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgZorroAntdModule,
  ],
  exports:[
    EditorComponent,
    CropperComponent,
    VideoplayComponent,
    AliUploadComponent,
    FrontUploadComponent,
    RoleDirective,
    TIME,
    AliOmdComponent,
    AliVideoplayComponent
  ],
  entryComponents:[CropperComponent,VideoplayComponent],

})
export class ShareModule { }
