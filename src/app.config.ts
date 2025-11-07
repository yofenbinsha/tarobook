export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/book/index',
    'pages/me/index',
    'pages/login/index',
    'pages/register/index'
  ],
  tabBar: {
    color: '#333',
    selectedColor: '#333',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        pagePath: 'pages/book/index',
        text: '书架',
      },
      {
        pagePath: 'pages/me/index',
        text: '我的',
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
