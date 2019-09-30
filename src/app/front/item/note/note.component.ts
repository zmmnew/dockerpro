import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../../common/service/http-service.service';
import {appApis} from '../../../common/constant/apis';
import {ItemService} from '../item.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  actId;
  page={size:15,index:1,total:0};
  noteList;
  isSpinning= false;
  constructor(
    private router:Router,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private itemService:ItemService

  ) {
    if(this.itemService.itemId){
      this.actId = this.itemService.itemId;
    }else{
      this.actId = localStorage.getItem('actId');
      this.itemService.sendMessage(this.actId);
      this.itemService.itemId = this.actId;
    }
    this.getNoteList();
  }

  ngOnInit() {
  }
  changeindex(){
    this.getNoteList();
  }
  getNoteList(){
    this.isSpinning = true;
    let postStr = {
      current:this.page.index,
      size:this.page.size,
      orderBy:'createTime desc',
      params: {
        activityOnlineId:this.actId,
      }
    };
    this.httpService.post(appApis.actNote_page.url,postStr,
      data => {
        this.isSpinning = false;
        if (data.code == 1){
          if(data.data){
            this.noteList = data.data.list;
            this.page.total = data.data.total;
          }
        }
      },
      error => {
        console.error(error);
      });
  }
  todel(id){
    this.router.navigate(['front/item/noteDel'],{queryParams:{id:id}});
  }
}
