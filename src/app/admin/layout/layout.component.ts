import {Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {MENU} from '../../common/constant/menu';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  menu = MENU;
  username =localStorage.getItem('usname');
  breadcrumb=[];
  constructor(private router: Router,){

  }
  ngOnInit(){
    /*地址栏地址*/
    this.breadcrumb = [];
    let index = window.location.href.indexOf('#/');
    this.getRoute('',this.menu,window.location.href.slice(index+1));
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) { // 当导航成功结束时执行
          this.breadcrumb = [];
          this.getRoute('',this.menu,event.url);
        }
      });
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(){
    localStorage.removeItem('adminid');
    this.router.navigate(['/aLogin']);
  }

  /*文件导航*/
  getRoute(pmenu,menu,url){
    menu.forEach(item=>{
      if(item.route && item.route == url){
        this.breadcrumb.push(pmenu);
        this.breadcrumb.push(item.name);
      }
      if(item.sdmenu){
        this.getRoute(item.name,item.sdmenu,url);
      }
    })
  }
}
