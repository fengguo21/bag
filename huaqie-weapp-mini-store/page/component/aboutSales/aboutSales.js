import { get } from '../../../util/api'
import moment from '../../../util/moment'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    texts: [],
    updated: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    get('app/getSalesAbout', {}, res => {
      if(!res)
        return
      console.log('res====', res)
      this.setData({
        title: res.basic.title,
        texts: res.basic.text.split('\n'),
        updated: moment(res.updated).format('YYYY-MM-DD HH:mm:ss')
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '提成说明',
      path: '/page/component/aboutSales/aboutSales?salesPeopleId='+wx.getStorageSync('peopleId'),
      //imageUrl: 'https://dn-huaqie.qbox.me/agent-sd1.png',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})