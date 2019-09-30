import {OnlineActComponent} from './online-act/online-act.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {ActApplyComponent} from './act-apply/act-apply.component';
import {UploadActComponent} from './act-apply/upload-act/upload-act.component';
import {GradeComponent} from './grade/grade.component';

export const serveRoute = [
  {path:'onact',component:OnlineActComponent},
  {path:'signUp',component:SignUpComponent},
  {path:'apply',component:ActApplyComponent},
  {path:'upload',component:UploadActComponent},
  {path:'grade',component:GradeComponent}
];
