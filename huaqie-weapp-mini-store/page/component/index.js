import { get } from '../../util/api'

Page({
  data: {
    imgUrls: [
      '/image/c1.png',
      '/image/c1.png',
      '/image/c1.png'
    ],
    advertises: [],
    products: [],
    total: 0,
    page: 1,
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },
  onShareAppMessage: function (res) {
    return {
      title: '老来青大米',
      path: '/page/component/index?salesPeopleId='+wx.getStorageSync('peopleId'),
      //imageUrl: 'https://dn-huaqie.qbox.me/agent-sd1.png',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  getAdvertises() {
    get('advertise/findByState', {
     page: 1,
     size: 10
   }, data => {
     if(!data.list)
      return
     this.setData({
       advertises: data.list
     })
   })
  },
  getProducts(page) {
    const p = (page)?page:this.data.page
    get('product/frontFindByState', {
     page: p,
     size: 10
   }, data => {
    if(!data.list)
      return
     console.log('data', data)
     this.setData({
       products: (p==1)?data.list:this.data.products.concat(data.list),
       total: data.total
     })
   })
  },
  onLoad(options) {
    console.log('==== SCENE', options.scene)
  },
  onReady(){
    this.getAdvertises()
    this.getProducts(1)
  },
  onShow() {
    this.getAdvertises()
  },
  onReachBottom() {
    if(this.data.page * 10 >= this.data.total){
      console.log('到底了')
      this.setData({
        tips: '---- 我是有底线的 ----'
      })
      return
    }

    this.setData({
      tips: '加载中...'
    })
      
    this.setData({
      page: (this.data.page + 1)
    })
    this.getProducts()
  }
})