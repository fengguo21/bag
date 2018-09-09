import { get } from '../../../util/api'
import moment from '../../../util/moment'

const steps = {
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '已完成',
  5: '已退款',
  6: '已取消'
}

const directions = {
  1: '收入',
  2: '提现',
  3: '冻结'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: '',
    curIndex: 0,
    maskHidden: true,

    balance: 0,
    total: 0,
    frozen: 0,

    indexTab: 0,

    // 交易记录
    transactions: [],
    transactionsPage: 1,
    transactionsTotal: 0,
    transactionsTips: '',

    // 提现记录
    withdraws: [],
    withdrawsPage: 1,
    withdrawsTotal: 0,
    withdrawsTips: '',

    // 客户订单
    orders: [],
    page: 1,
    orderTotal: 0,
    orderTips: '',

    // 客户
    clients: [],
    clientPage: 1,
    clientTotal: 0,
    clientTips: ''
  },

  changeTransaction(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      indexTab: index
    })
    if(index == 0){
      this.setData({
        transactionsPage: 1
      })
      this.getTransactions()
    }else{
      this.setData({
        withdrawsPage: 1
      })
      this.getPeopleWithdraws()
    }
  },

  goWithdraw() {
    if(this.data.balance > 0){
      wx.navigateTo({
        url: '../withdraw/withdraw?amount='+this.data.balance
      })
    }else{
      wx.showModal({
        title:'小提示',
        content:'余额不够，不可提现',
        confirmColor: '#ffaf0e',
        showCancel:false
      })
    }
  },

  // 获取交易记录
  getTransactions() {
    console.log('======= CURRENT TRANSACTIONS PAGE', this.data.transactionsPage)
    
    if(this.data.transactionsTotal > 0 && this.data.transactionsTotal < this.data.transactionsPage*10){
      this.setData({
        transactionsTips: '我是有底线的'
      })
      return
    }
    get('bank/findPeopleTransactionByState', {
      direction: 1,
      page: this.data.transactionsPage,
      size: 10
    }, res => {
      console.log(res)
      res.list.forEach(e => {
            e.direction = (e.direction in directions)?directions[e.direction]:'未知'
            e.created = moment(e.created).format('YYYY-MM-DD HH:mm:ss') 
          })
        this.setData({
          transactions: (this.data.transactionsPage==1)?res.list:this.data.transactions.concat(res.list),
          transactionsTotal: res.total,
          transactionsPage: this.data.transactionsPage+1
        })
      })
  },

  // 获取交易记录
  getPeopleWithdraws() {
    console.log('======= CURRENT WITHDRAWS PAGE', this.data.withdrawsPage)
    
    if(this.data.withdrawsTotal > 0 && this.data.withdrawsTotal < this.data.withdrawsPage*10){
      this.setData({
        withdrawsTips: '我是有底线的'
      })
      return
    }
    get('bank/findWithdrawByState', {
      direction: 2,
      page: this.data.withdrawsPage,
      size: 10
    }, res => {
      console.log(res)
      res.list.forEach(e => {
          console.log('========', e)
            e.direction = (e.step == 1)?'提现中':'已提现'
            e.created = moment(e.created).format('YYYY-MM-DD HH:mm:ss') 
          })
        this.setData({
          withdraws: (this.data.withdrawsPage==1)?res.list:this.data.withdraws.concat(res.list),
          withdrawsTotal: res.total,
          withdrawsPage: this.data.withdrawsPage+1
        })
      })
  },

  // 获取客户订单
  getOrders() {
    console.log('======= CURRENT PAGE', this.data.page)
    if(this.data.orderTotal > 0 && this.data.total < this.data.page*10 ){
      this.setData({
        orderTips: '我是有底线的'
      })
      return
    }
    get('order/frontFindByState', {
        salesPeopleId: wx.getStorageSync('peopleId'),
        page: this.data.page,
        size: 10
      }, res => {
        if(!res)
          return
        res.list.forEach(e => {
          e.stepTitle = (e.step in steps)?steps[e.step]:'未知'
          e.stepClass = 'step-'+e.step
        })
        this.setData({
          orders: (this.data.page==1)?res.list:this.data.orders.concat(res.list),
          orderTotal: res.total
        })
      })
  },

  // 获取客户
  getClients() {
    console.log('======= CURRENT CLIENT PAGE', this.data.clientPage)
    if(this.data.clientTotal > 0 && this.data.clientTotal < this.data.clientPage*10 ){
      this.setData({
        clientTips: '我是有底线的'
      })
      return
    }
    get('people/findByState', {
        salesPeopleId: wx.getStorageSync('peopleId'),
        page: this.data.clientPage,
        size: 10
      }, res => {
        if(!res)
          return
        res.list.forEach(e => {
          e.created = moment(e.created).format('YYYY年MM月DD日 HH:mm')
        })
        this.setData({
          clients: (this.data.clientPage==1)?res.list:this.data.clients.concat(res.list),
          clientTotal: res.total
        })
      })
  },
   

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

   changeTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
    if(index == 1){
      this.getOrders()
    }else if(index == 2){
      this.getClients()
    }
  },

  previewImg(){

    wx.downloadFile({
    url: this.data.path, 
    success: function(res) {
       wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              title:'小提示',
              content:'小程序码保存成功，请查看相册',
              confirmColor: '#ffaf0e',
              showCancel:false
            })
          },
          fail(res) {
            console.log('=== fail:', res)
          }
      })
     }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTransactions()
    get('people/findWeAppQrCodeById', {}, res => {
          console.log('qrcode:', res)
          this.setData({
            path: res
          })
        })

    get('bank/findByPeopleId', {
      peopleId: wx.getStorageSync('peopleId')
    }, res => {
      this.setData({
        balance: res.balance.toFixed(2),
        total: ((res.balance)?res.balance:0+(res.withdraw)?res.withdraw:0+(res.frozen)?res.frozen:0).toFixed(2),
        frozen: ((res.frozen)?res.frozen:0).toFixed(2)
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.curIndex == 0)
      this.getTransactions()
    else if(this.data.curIndex == 1)
      this.getOrders()
    else if(this.data.curIndex == 2)
      this.getClients()
  }
})