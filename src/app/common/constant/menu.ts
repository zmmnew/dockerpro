export const MENU = [
  {
    name:'业务管理',
    icon:'paper-clip',
    route:'',
    key: '业务管理',
    sdmenu:[
      {name:'线上活动',key: '业务-线上活动',route:'/admin/serve/onact'},
      {name:'报名管理',key: '业务-报名管理',route:'/admin/serve/signUp'},
      {name:'权限申请',key: '业务-活动申请',route:'/admin/serve/apply'},
      {name:'作品评分',key: '业务-作品评分',route:'/admin/serve/grade'},
      {name:'各馆管理员',key: '用户-活动管理员',route:'/admin/user/actus'},
    ]
  },
  {
    name:'用户管理',
    key: '用户管理',
    icon:'team',
    route:'',
    sdmenu:[
      {name:'注册用户',key: '用户-注册用户',route:'/admin/user/fus'},
    ]
  },
  {
    name:'系统管理',
    key: '系统管理',
    icon:'setting',
    route:'',
    sdmenu:[
      {name:'角色管理',key: '系统-角色管理',route:'/admin/sys/role'},
    ]
  },

];
