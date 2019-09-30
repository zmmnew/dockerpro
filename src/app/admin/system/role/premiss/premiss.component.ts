import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzTreeComponent, NzTreeNodeOptions} from 'ng-zorro-antd';
import {appApis} from '../../../../common/constant/apis';
import {HttpService} from '../../../../common/service/http-service.service';
import {Permiss} from '../../../../common/constant/permiss';

@Component({
  selector: 'app-premiss',
  templateUrl: './premiss.component.html',
  styleUrls: ['./premiss.component.scss']
})
export class PremissComponent implements OnInit {
  roleId;
  @ViewChild('nzTreeComponent') nzTreeComponent: NzTreeComponent;
  @Input() set info(value){
    this.defaultCheckedKeys=[];
    this.roleId =  value.id;

    if(value.permission){
      let halfPermiss = JSON.parse(value.permission);
      halfPermiss.forEach((item)=>{
        // console.log(item);
        // console.log(item.split(":")[0]);
        if(item.split(":")[0] == 'true'){
          // console.log(item.split(":")[0]);
          this.defaultCheckedKeys.push(item.split(":")[1]);
          // console.log(this.defaultCheckedKeys);
        }
      });
    }
  };
  defaultCheckedKeys = [];
  checkBox = [];
  nodes: NzTreeNodeOptions[] = Permiss;
  constructor(
    private _message: NzMessageService,
    private modal: NzModalRef,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
  }

  getNode(nodeBox){
    nodeBox.forEach((item)=>{
      if(item.checked){
        this.checkBox.push(true+':'+item.key);
      }
      if(item.children){
       this.getNode(item.children);
      }
    })
  }
  getHalfNode(){
    if(this.nzTreeComponent.getHalfCheckedNodeList()){
      this.nzTreeComponent.getHalfCheckedNodeList().forEach((item)=>{
        this.checkBox.push(false+':'+item.key);
      })
    }
  }
  save(){
    this.checkBox = [];
    this.getNode(this.nodes);
    this.getHalfNode();
    this.updata();
  }
  updata(){
    let postStr =  {
      id:this.roleId,
      permission:JSON.stringify(this.checkBox)
    };
    this.httpService.put(appApis.role_update.url,postStr ,
      data => {
        if (data.code == 1){
          this.modal.destroy({ success: true });
          this._message.success('操作成功');
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
  cancel(){
    this.modal.destroy({ success: true });
  }
}
