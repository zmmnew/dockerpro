import {Component, ElementRef, Input, OnInit} from '@angular/core';
import Cropper from 'cropperjs';
import {NzModalRef} from "ng-zorro-antd";
@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit {
  cropperobj;
  imgShowPath;
  image;
  @Input() set info(value){
    this.imgShowPath = window.URL.createObjectURL(value);
    setTimeout(()=>{ this.initCropper();});
  };
  @Input() ratio;
  constructor(private el: ElementRef,private modal: NzModalRef,) {}

  ngOnInit() {
  }
  initCropper(){
    this.image = this.el.nativeElement.querySelector('#image');
    this.cropperobj = new Cropper(this.image, {
      aspectRatio: this.ratio,
      viewMode:1,
      crop: function (e) {
      }
    });
  }

  save(){
    const dataURL = this.image.cropper['getCroppedCanvas']('');
    const data = {
      imgData: dataURL.toDataURL('image/png')
    };
    // console.log(data.imgData);
    let imgBlob =this.dataURLtoBlob(data.imgData);
    // console.log(imgBlob );
    this.modal.destroy({ img: imgBlob });
  }
  // base64码转二进制
  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while( n -- ){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }
  cancel(){
    this.modal.destroy({cancel:true});
  }

}
