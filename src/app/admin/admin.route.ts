import {LayoutComponent} from './layout/layout.component';
import {LoginGuard} from '../login/alogin.guard';

export const adminRoute = [
  {
    path: '',
    component:LayoutComponent,
    canActivate:[LoginGuard],
    children:[
      {path:'serve',loadChildren: './serve/serve.module#ServeModule'},
      {path:'sys',loadChildren: './system/system.module#SystemModule'},
      {path:'user',loadChildren: './user/user.module#UserModule'},
    ]
  },


];
