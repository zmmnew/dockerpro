import {ItemComponent} from './item.component';
import {ItemIntroComponent} from './item-intro/item-intro.component';
import {NoteComponent} from './note/note.component';
import {EnterComponent} from './enter/enter.component';
import {PublicComponent} from './public/public.component';
import {NoteDelComponent} from './note/note-del/note-del.component';
import {PubDelComponent} from './public/pub-del/pub-del.component';
import {ZhinanComponent} from './zhinan/zhinan.component';
import {ReuploadComponent} from './reupload/reupload.component';

export const itemRoute = [
  {
    path:'',
    component:ItemComponent,
    children:[
      {path:'zhinan',component:ZhinanComponent},
      {path:'detail',component:ItemIntroComponent},
      {path:'note',component:NoteComponent},
      {path:'enter',component:EnterComponent},
      {path:'public',component:PublicComponent},
      {path:'noteDel',component:NoteDelComponent},
      {path:'pubDel',component:PubDelComponent},
      {path:'reload',component:ReuploadComponent},

    ]
  },


];
