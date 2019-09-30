import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss']
})
export class ReaderComponent implements OnInit {
  @Input() set copy(value){
    setTimeout(()=>{
      $('.desc').append(value);
    })

  };
  constructor() { }

  ngOnInit() {


  }

}
