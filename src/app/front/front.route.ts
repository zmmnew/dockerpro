import {LayoutComponent} from './layout/layout.component';

export const frontRoute = [
  {
    path: '',
    component:LayoutComponent,
    children:[
      {path:'item',loadChildren: './item/item.module#ItemModule' },
      {path:'uc',loadChildren: './user-center/user-center.module#UserCenterModule' },
    ]
  },


];
