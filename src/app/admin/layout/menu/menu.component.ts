import {Component, Input, OnInit} from '@angular/core';
import {MENU} from "../../../common/constant/menu";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menu = MENU;
  @Input() isCollapsed;
  constructor() { }

  ngOnInit() {
  }

}
