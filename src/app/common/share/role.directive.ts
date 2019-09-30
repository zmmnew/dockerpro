import {Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective implements OnInit,OnChanges{
  roleBox;
  @Input('appRole') role:string;
  constructor(
    private el: ElementRef,
  ) {
    this.roleBox = [];
    let halfpre = JSON.parse(localStorage.getItem('userInfo')).permission;
    if(halfpre){
      JSON.parse(halfpre).forEach((item)=>{
        this.roleBox.push(item.split(":")[1]);
      });
    }
  }
  ngOnChanges(changes: SimpleChanges){
    this.findrole();
  };
  ngOnInit(){

  }
  findrole(){
    if(localStorage.getItem('usname')){
      let eachcount=0;
      let isshow = 0;
      this.roleBox.forEach((item,index)=>{
        eachcount++;
        // console.log(this.role,item);
        if(item == this.role){
          // console.log(111);
          isshow = 1;
          return;
        }
        if(eachcount>=this.roleBox.length){
          if(isshow == 0){
            this.el.nativeElement.remove();
          }
        }
      });
    }
  }
}
