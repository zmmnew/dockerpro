import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../../../common/service/http-service.service';
import {appApis} from '../../../../common/constant/apis';
import {ItemService} from '../../item.service';

@Component({
  selector: 'app-note-del',
  templateUrl: './note-del.component.html',
  styleUrls: ['./note-del.component.scss']
})
export class NoteDelComponent implements OnInit {
  noteId;
  notedel;
  isSpinning = false;
  constructor(
    private router:Router,
    private httpService: HttpService,
    private route: ActivatedRoute,

  ) {
    route.queryParams.subscribe(queryParams => {
      this.noteId = queryParams.id;
      this.getDel();
    });
  }

  ngOnInit() {
  }
  getDel(){
    this.isSpinning = true;
    this.httpService.get(appApis.noteDelbyid.url+'/'+ this.noteId,
      data => {
        this.isSpinning = false;
        if (data.code == 1){
          this.notedel = data.data;
          $('.opdel').append(this.notedel.description);
        }
      },
      error => {
        console.error(error);
      });
  }
}
