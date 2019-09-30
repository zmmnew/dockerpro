/*====================apis的集合===============================*/
import {ROOT_URL} from '../config/config';

/**
 * 描述：apis的集合
 * 组成：[{key:value},...]
 * 注：
 * <b>key命名方式为 请求方式_模块名称_业务名称 例：get_app_user_list <b>
 * <b>value为，请求方式，url路径，描述组成的对象 <b>
 */
export const appApis: any = {
  //==============后台============================
  /*用户登录、注册获取随机码*/
  "admin_login":{url:'user/UserAdmin/login',method:'post',description:'后台登陆'},
  "admin_register":{url:'user/UserAdmin/register',method:'post',description:'后台注册'},
  "get_gifcode":{url:'captcha/getGifCaptcha',method:'get',description:'获得动态gif验证码'},
  "get_smscode":{url:'sms/captcha',method:'post',description:'获得短信验证码'},
  "checkMobile":{url:'user/UserAdmin/checkLoginMobile',method:'post',description:'校验手机号是否唯一'},
  //文件上传
  "upload_file":{url:'oss/upload',method:'post',description:'文件上传地址'},
  "rangeUpload_file":{url:'oss/rangeUpload',method:'post',description:'切片文件上传地址'},
  "upload_secondPass":{url:'/oss/secondPass',method:'post',description:'文件秒传地址'},
  "merge_file":{url:'oss/merge',method:'post',description:'合并已经上传了的切片'},
  "isFingerprint":{url:'oss/fingerprint',method:'get',description:'校验文件指纹是否存在'},
  "checkRange":{url:'oss/checkRange',method:'post',description:'校验文件的切片，已经上传了多少'},

//  阿里文件上传
  "isFingerprint_ali":{url:'alioss/fingerprint',method:'get',description:'检验文件指纹是否存在'},
  "uploadSecd_Ali":{url:'alioss/add',method:'post',description:'文件秒传'},
  "alists":{url:'alists/sts',method:'get',description:'阿里云sts认证'},

  //  ali 点播管理
  "aliVod_fp":{url:'alivideo/fingerprint',method:'post',description:'点播校验文件指纹为何存在'},
  "aliVod_add":{url:'alivideo/add',method:'post',description:'添加或视频秒传'},
  "aliVod_update":{url:'alivideo/update',method:'post',description:'修改名称或封面图'},
  "aliVod_delete":{url:'alivideo/delete',method:'post',description:'根据id修改'},
  "aliVod_deleteAny":{url:'alivideo/deleteBatch',method:'post',description:'批量删除'},
  "aliVod_page":{url:'alivideo/page',method:'post',description:'点播分页查询'},
  "aliVod_suffix":{url:'alivideo/getSuffix',method:'post',description:'获得点播全部后缀'},
  "aliVod_app":{url:'alivideo/getApp',method:'post',description:'获得全部应用名称'},

//活动添加
  'onlineAct_add':{url:'activity/activityOnline/add',method:'post',description:'新增活动'},
  'onlineAct_page':{url:'activity/activityOnline/page',method:'post',description:'线上活动列表'},
  "onlineAct_update":{url:'activity/activityOnline/update',method:'put',description:'修改线上活动'},
  "onlineAct_delete":{url:'activity/activityOnline/deleteById',method:'delete',description:'删除线上活动'},
  "onlineAct_stop":{url:'activity/activityOnline/stopUsing',method:'put',description:'停用线上活动'},

  "AdminGetActivityOnlinePage":{url:'user/userAdminRoleActivityOnline/getAdminPageByActivityOnlineId',method:'post',description:'根据活动id查询绑定的活动管理员列表'},
  "actNote_add":{url:'activity/activityOnlineNotice/add',method:'post',description:'新增通知公告'},
  "actNote_update":{url:'activity/activityOnlineNotice/update',method:'put',description:'修改通知公告'},
  "actNote_delete":{url:'activity/activityOnlineNotice/deleteById',method:'delete',description:'删除通知公告'},
  "actNote_page":{url:'activity/activityOnlineNotice/page',method:'post',description:'通知公告列表'},
  "seng_msg":{url:'activity/activityOnlineNotice/sendNotice',method:'post',description:'给所有app用户发送通知公告'},

//  报名管理
  "signup_page":{url:'user/userSignUp/page',method:'post',description:'用户报名分页查询'},
  "signup_update":{url:'user/userSignUp/update',method:'put',description:'用户报名修改'},
  "signup_delete":{url:'user/userSignUp/deleteById',method:'delete',description:'用户报名删除'},

//  上传作品
  "upload_add":{url:'user/userSignUp/add',method:'post',description:'上传作品'},
  "upload_update":{url:'user/userSignUp/update',method:'put',description:'作品修改'},
  "upload_delete":{url:'user/userSignUp/deleteById',method:'delete',description:'作品删除'},
  "userUP_checkwork":{url:'user/userSignUp/checkWorks',method:'post',description:'管理员上传作品校验'},
  // "frontcheckwork":{url:'user/userSignUp/check',method:'post',description:'前台上传作品校验'},
  "frontcheckuser":{url:'user/userSignUp/checkUser',method:'post',description:'前台上传作品校验用户'},
  "frontcheckmobile":{url:'user/userSignUp/checkMobile',method:'get',description:'前台上传作品校验手机号'},
  "starSett":{url:'user/userSignUp/generalUpdate',method:'post',description:'设置星标'},
//  活动管理员活动申请
  "actapply_page":{url:'user/userAdminRoleActivityOnline/AdminGetActivityOnlinePage',method:'post',description:'活动管理员查询活动列表'},
  "actapply_add":{url:'user/userAdminRoleActivityOnline/add',method:'post',description:'活动管理员活动申请'},
  "actapply_update":{url:'user/userAdminRoleActivityOnline/update',method:'post',description:'活动管理员申请修改'},
  "find_actapply":{url:'user/userAdminRoleActivityOnline/getUserAdminRoleActivityOnline',method:'post',description:'查询活动申请'},


//  作品
  "zuopin_page":{url:'user/userSignUp/page',method:'post',description:'作品列表'},
  "zuopin_add":{url:'user/userSignUp/add',method:'post',description:'作品新增'},
  "zuopin_update":{url:'user/userSignUp/update',method:'post',description:'作品修改'},
  "zuopin_delete":{url:'user/userSignUp/deleteById',method:'delete',description:'作品删除'},
  "getUserListByAId":{url:'user/user/getUserListByAId',method:'get',description:'根据活动id查询报名的用户'},
  "exportExcel":{url:'user/userSignUp/exportExcel',method:'post',description:'导出报名信息'},


  //  评分
  "grade_add":{url:'user/grade/add',method:'post',description:'专家评分'},
  "grade_update":{url:'user/grade/updateGrade',method:'post',description:'专家评分修改'},
  "grade_zuopinPage":{url:'user/grade/userSignUpPage',method:'post',description:'专家评分作品列表'},
  "gradePage":{url:'user/grade/selectGradeByWorksId',method:'get',description:'根据作品id专家评分列表'},
//系统管理 角色管理
  "role_page":{url:'user/role/page',method:'post',description:'角色列表'},
  "role_add":{url:'user/role/add',method:'post',description:'角色新增'},
  "role_update":{url:'user/role/update',method:'put',description:'角色修改'},
  "role_delete":{url:'user/role/deleteById',method:'delete',description:'角色删除'},

//  用户管理 活动管理员管理
  "actUser_admin":{url:'user/userAdminRoleActivityOnline/AdminPage',method:'post',description:'活动管理员列表'},
  "actUser_page":{url:'user/UserAdmin/page',method:'post',description:'管理员列表'},
  "actUser_delete":{url:'user/UserAdmin/deleteById',method:'delete',description:'活动管理员删除'},
  "actUser_update":{url:'user/UserAdmin/update',method:'put',description:'活动管理员修改'},
  "adminapplyAct":{url:'user/userAdminRoleActivityOnline/page4admin',method:'post',description:'活动管理员申请的活动'},
  "actUser_admin_update":{url:'user/userAdminRoleActivityOnline/update',method:'post',description:'超管赋权或修改'},
  //前台用户
  "fuser_page":{url:'user/user/getUserAndUserSignUpInfo',method:'post',description:'前台用户列表'},
  //专家
  "userAdminPage":{url:'user/UserAdmin/page',method:'post',description:'专家列表'},
  "userAdminAdd":{url:'user/UserAdmin/add',method:'post',description:'专家添加'},
  "userAdminUpdate":{url:'user/UserAdmin/update',method:'put',description:'专家修改'},
  "userAdminDelete":{url:'user/UserAdmin/deleteById',method:'post',description:'专家删除'},

  //================前台============================
  "visitorNum":{url:'visitor/count',method:'get',description:'总浏览量'},

  "front_login":{url:'user/user/login',method:'put',description:'前台登录'},
  "front_register":{url:'user/user/register',method:'post',description:'前台注册'},
  "front_phoneOne":{url:'user/user/checkLoginName',method:'post',description:'前台校验手机号唯一'},
  "front_updatePw":{url:'user/user/updatePassword',method:'put',description:'前台找回密码'},
  //普通用户
  "user_useradd":{url:'user/user/add',method:'post',description:'普通用户添加'},
  "usersignUpList":{url:'user/userSignUp/user2signUpList',method:'get',description:'查询用户参与的报名列表'},
  "userSignUp_del":{url:'user/userSignUp/findById',method:'get',description:'获得报名详情'},
  "user_userdelete":{url:'user/user/deleteById',method:'delete',description:'删除用户'},
  //活动
  "actDelbyid":{url:'activity/activityOnline/findById',method:'get',description:'活动详情'},
  "noteDelbyid":{url:'activity/activityOnlineNotice/findById',method:'get',description:'通告详情'},
//  消息
  "mynotice":{url:'user/notice/page',method:'get',description:'消息列表'},
  "mynoticeUpdate":{url:'user/notice/update',method:'put',description:'修改消息状态'},
  "mynoticeReader":{url:'user/notice/updateStatusByUserId',method:'get',description:'一键修改信息已读'},

};

