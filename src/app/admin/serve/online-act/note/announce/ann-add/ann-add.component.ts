import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {EditorComponent} from '../../../../../../common/share/editor';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {HttpService} from '../../../../../../common/service/http-service.service';
import {appApis} from '../../../../../../common/constant/apis';

@Component({
  selector: 'app-ann-add',
  templateUrl: './ann-add.component.html',
  styleUrls: ['./ann-add.component.scss']
})
export class AnnAddComponent implements OnInit {
  annName;
  editorContent;
  annType;
  @ViewChild(EditorComponent) editor: EditorComponent;
  disabled = false;
  annID;
  @Input() set type(value){
    this.annType = value;
    if(value == 2){
      this.disabled = true;
    }else{
      this.disabled = false;
    }
  };
  @Input() set info(value){
    if(value){
      this.annID = value.id;
      this.annName = value.name;
      this.editorContent = value.description;
    }
  };
  @Input() actId;
  constructor(
    private _message: NzMessageService,
    private modal: NzModalRef,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
  }
  save(){
    this.publishTopic();
    if(this.annName && this.editorContent){
      if(this.annType == 0){
        this.add();
      }else if(this.annType == 1){
        this.update();
      }
    }else{
      this._message.error('请填写完整信息');
    }

  }
  add(){
    let postStr =  {
      name:this.annName,
      description:this.editorContent,
      activityOnlineId:this.actId
    };
    this.httpService.post(appApis.actNote_add.url,postStr ,
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
  update(){
    let postStr =  {
      id:this.annID,
      name:this.annName,
      description:this.editorContent,
      activityOnlineId:this.actId
    };
    this.httpService.put(appApis.actNote_update.url,postStr ,
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
  //===============编辑器==================
  publishTopic() {
    this.editor.clickHandle();
  }
  PostData(event){
    this.editorContent= event;
  }
}
