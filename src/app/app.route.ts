import {LayoutComponent} from './admin/layout/layout.component';
import {LoginGuard} from './login/alogin.guard';
import {AloginComponent} from './login/alogin/alogin.component';
import {AregisterComponent} from './login/aregister/aregister.component';

export const appRoutes = [
  {path:'admin',loadChildren: './admin/admin.module#AdminModule'},
  {path:'front',loadChildren: './front/front.module#FrontModule'},
  {
    path: 'aLogin',
    component: AloginComponent,
  },
  {
    path: 'aRegister',
    component: AregisterComponent,
  },
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full',
    canActivate:[LoginGuard]
  },
  {
    path: '**',
    redirectTo: '/admin',
    canActivate:[LoginGuard]
  }
];
