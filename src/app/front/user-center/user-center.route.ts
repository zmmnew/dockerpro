import {CenterComponent} from './center/center.component';
import {MyActComponent} from './my-act/my-act.component';
import {MyInfoComponent} from './my-info/my-info.component';
import {MyactDelComponent} from './myact-del/myact-del.component';

export const userCenterRoute = [
  {
    path:'',
    component:CenterComponent,
    children:[
      {path: '', redirectTo: 'myact', pathMatch: 'full',},
      {path:'myact',component:MyActComponent},
      {path:'info',component:MyInfoComponent},
      {path:'myactDel',component:MyactDelComponent},
    ]
  },
];
