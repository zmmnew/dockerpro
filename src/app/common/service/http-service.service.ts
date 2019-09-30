import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {ROOT_URL} from '../config/config';
import {retry} from 'rxjs/operators';
import {Subscription} from "rxjs/src/internal/Subscription";

/**
 * @description 定义全局接口，封装http服务，封装agnualr原生HttpClient类
 * @date 2017-9-15
 * @author admin
 */
@Injectable()
export class HttpService {
  retryNum = 2;
  private rootUrl: string = ROOT_URL;

  //注入httpClient
  constructor(private httpClient: HttpClient,
  ) {
  }

  /**
   * @description get请求
   * @param {string} url
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   * @return void
   */
  get(url: string, data: (data: any) => any, error: (error: any) => void){
    return this.httpClient.get(this.rootUrl + url).subscribe(data, error)
  }
  getNoRoot(url: string, data: (data: any) => void, error: (error: any) => void){
    return this.httpClient.get(url).subscribe(data, error)
  }

  /**
   * @description post请求
   * @param {string} url
   * @param {any | any} body
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   */
  post(url?: string, body?: any | null, data?: (data: any) => void, error?: (error: any) => void){
    return this.httpClient.post(this.rootUrl + url, body).subscribe(data, error);
  }
  post2(url?: string, body?: any | null,options?:any, data?: (data: any) => void, error?: (error: any) => void){
    return this.httpClient.post(url, body, options).subscribe(data, error);
  }

  // protected ngUnsubscribe: Subject<void> = new Subject<void>();
  /**
   * @description put请求
   * @param {string} url
   * @param {any | any} body
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   */
  put(url?: string, body?: any | null, data?: (data: any) => void, error?: (error: any) => void){
    return this.httpClient.put(this.rootUrl + url, body).subscribe(data, error);
  }

  /**
   * @description delete请求
   * @param {string} url
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   */

  delete(url: string, data: (data: any) => void, error: (error: any) => void){
    return this.httpClient.delete(this.rootUrl + url).subscribe(data, error);
  }

  upload(url: string, $event, data: (data: any) => void, error: (error: any) => void){
    // const files
    // = $event.target.files || $event.srcElement.files;
    // const formData = new FormData();
    // for (let i = 0; i < files.length; i++) {
    //   formData.append(fileKey, files[i]);
    // }
    // if (obj) {
    //   // console.log(JSON.stringify(obj));
    //   for (let i = 0; i < obj.length; i++) {
    //     // console.log(JSON.stringify(obj[i]));
    //     //这里拼接对象
    //     // formData.append("obj", obj[i].value);
    //   }
    // }
    return this.httpClient.request(new HttpRequest('POST', this.rootUrl + url, $event, {reportProgress: true})).pipe(retry(this.retryNum)).subscribe(data, error);
  }
  uploadAli(url: string, $event, data: (data: any) => void, error: (error: any) => void){

    return this.httpClient.request(new HttpRequest('POST', url, $event, {reportProgress: true})).pipe(retry(this.retryNum)).subscribe(data, error);
  }

  //上传blob
  uploadBlob(url: string, blob, data: (data: any) => void, error: (error: any) => void, fileKey: string, ...obj: any[]){

    const formData = new FormData();
    formData.append(fileKey, blob);
    return this.httpClient.post(this.rootUrl + url, formData).subscribe(data, error);
  }


}


