import { BrowserModule } from '@angular/platform-browser';
import {NgModule, Provider} from '@angular/core';

import { AppComponent } from './app.component';
import {HttpService} from './common/service/http-service.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './common/auto-intercepter';
import {appRoutes} from './app.route';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgZorroAntdModule, NZ_MESSAGE_CONFIG} from 'ng-zorro-antd';
import {DatePipe, registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {Method} from './common/service/method';
import { AloginComponent } from './login/alogin/alogin.component';
import { AregisterComponent } from './login/aregister/aregister.component';
import {LoginGuard} from './login/alogin.guard';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    AloginComponent,
    AregisterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
  ],
  providers: [
    HttpService,
    DatePipe,
    LoginGuard,
    Method,
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzTop: document.body.scrollHeight /2.1 }},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
