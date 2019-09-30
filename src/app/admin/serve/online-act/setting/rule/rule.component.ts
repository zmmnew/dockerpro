import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss']
})
export class RuleComponent implements OnInit {
  @Input() info;
  constructor() { }

  ngOnInit() {
  }

}
