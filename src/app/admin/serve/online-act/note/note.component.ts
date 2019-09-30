import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {EditorComponent} from '../../../../common/share/editor';
import {appApis} from '../../../../common/constant/apis';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {HttpService} from '../../../../common/service/http-service.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  actId;
  disabled;
  editorContent1;
  editorContent2;
  selindex = 0;
  notename;
  @Input() set info(value){
    if(value){
      this.actId = value.id;
      this.notename=value.guideTitile;
      this.editorContent1=value.guideContent;
      this.editorContent2=value.copyrightInformation;
    }
  }
  @ViewChild(EditorComponent) editor: EditorComponent;
  constructor(
    private _message: NzMessageService,
    private modal: NzModalRef,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
  }
  save(){
    // console.log(this.selindex);
    let postStr;
    this.publishTopic(); //编辑器调用方法
    if(this.selindex == 0){
      if(this.notename && this.editorContent1){
        postStr = {
          id:this.actId,
          guideTitile:this.notename,
          guideContent:this.editorContent1
        };
        this.sendhttp(postStr);
      }else{
        this._message.error('请填写完整信息');
      }
    }else if(this.selindex == 1){
      // console.log(this.editorContent1);
      // console.log(this.editorContent2);
      if(this.editorContent2){
        postStr = {
          id:this.actId,
          copyrightInformation:this.editorContent2
        };
        this.sendhttp(postStr);
      }else{
        this._message.error('请填写完整信息');
      }
    }
  }
  cancel(){
    this.modal.destroy({ success: true });
  }
  sendhttp(postStr){
    this.httpService.put(appApis.onlineAct_update.url,postStr,
      data => {
        if (data.code == 1){
          // this.modal.destroy({ success: true });
          this._message.success('操作成功');
        }else{
          this._message.error(data.message);
        }
      },
      error => {
        console.error(error);
      });
  }
//===============编辑器==================
  publishTopic() {
    this.editor.clickHandle();
  }
  PostData1(event){
    // console.log('111');
    this.editorContent1 = event;
  }
  PostData2(event){
    // console.log('222');
    this.editorContent2 = event;
  }

}
