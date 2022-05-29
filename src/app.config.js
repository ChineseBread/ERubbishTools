export default {
  pages: [
    'pages/index/index',
    "pages/news/index",
    'pages/photo/index',
    'pages/searchInfo/index',
    'pages/news/newsPage/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  "permission":{
    "scope.userLocation":{
      "desc": "获取地理位置信息的用途描述"
    }
  },
  tabBar:{
    list:[
      {
        pagePath:'pages/photo/index',
        text:'识别',
        iconPath:'static/icon/相机.png',
        selectedIconPath:'static/icon/相机.png'
      },
      {
        pagePath:'pages/index/index',
        text:'主页',
        iconPath:'static/icon/主页.png',
        selectedIconPath:'static/icon/主页.png'
      },
      {
        pagePath:'pages/news/index',
        text:'新闻',
        iconPath:'static/icon/news.png',
        selectedIconPath:'static/icon/news.png'
      },
     /* {
        pagePath:'pages/index/index',
        text:'好康的',
        iconPath:'static/icon/更多.png',
        selectedIconPath:'static/icon/更多.png'
      },*/

    ]
  }
}
