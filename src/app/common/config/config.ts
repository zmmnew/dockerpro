/* =============定义视频url根路由  @type {string}========================*/


//app应用名
export const APP = 'test';
export const ALIURL = 'https://dev-test-bucket.oss-cn-beijing.aliyuncs.com/';
//本地测试+56服务器
export const ROOT_URL = getUrl();
// //服务器部署
function getUrl(){
  return window.location.protocol+'//'+window.location.host+'/'; //例 http://loacalhost:4200
}
