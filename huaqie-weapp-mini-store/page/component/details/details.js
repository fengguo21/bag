import { get } from '../../../util/api'
import cart from '../../../util/cart'

Page({
  data:{
    product: {},
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.product.basic.title,
      path: '/page/component/details/details?productId='+this.data.product.productId+'&salesPeopleId='+wx.getStorageSync('peopleId'),
      //imageUrl: 'https://dn-huaqie.qbox.me/agent-sd1.png',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;
    console.log('num', num, 'total', total)
    cart.addProduct({
      productId: this.data.product.productId,
      count: num,
      basic: this.data.product.basic
    })

    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

  },

  contact() {
    wx.makePhoneCall({
      phoneNumber: '02167866532'
    })
  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },

  onLoad(options) {
    console.log('options:', options)
    this.setData({
      hasCarts: (cart.products.length>0)?true:false,
      totalNum: cart.count()
    })
     wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 2000
    })
    get('product/findById', {
      productId: options.productId
    }, data => {
      console.log(data,4441)
       wx.hideLoading()
      this.setData({
        product: data
      })
      wx.setNavigationBarTitle({
        title: data.basic.title
      })
    })
  }
 
})