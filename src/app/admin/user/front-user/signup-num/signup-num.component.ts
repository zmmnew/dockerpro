import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-signup-num',
  templateUrl: './signup-num.component.html',
  styleUrls: ['./signup-num.component.scss']
})
export class SignupNumComponent implements OnInit {
  @Input() info;
  constructor() { }

  ngOnInit() {
  }

}
