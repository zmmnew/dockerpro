export const Permiss = [
  {
    title: '业务管理', key: '业务管理',
    children: [
      {
        title: '线上活动', key: '业务-线上活动',isLeaf: true
        // children: [
        //   { title: '新增', key: '服务-线上活动-新增', isLeaf: true },
        // ]
      },
      {title: '报名管理', key: '业务-报名管理',isLeaf: true},
      {title: '权限申请', key: '业务-活动申请',isLeaf: true},
      {title: '作品评分', key: '业务-作品评分',isLeaf: true},
      {title: '各馆管理员', key: '用户-活动管理员',isLeaf: true}
    ]
  },
  {
    title: '用户管理', key: '用户管理',
    children: [
      {title: '注册用户', key: '用户-注册用户',isLeaf: true}
    ]
  },
  {
    title: '系统管理', key: '系统管理',
    children: [
      {title: '角色管理', key: '系统-角色管理',isLeaf: true}
    ]
  }
];

