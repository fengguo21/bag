import Vue from 'vue'
import axios from 'axios'
import store from '@/vuex/store'
import Vuex from 'vuex'
import wx from 'weixin-js-sdk'
Vue.use(Vuex)
var global_config = require('@/assets/js/config/myConfig.js')
var wxInit = function() {
    var that = this
    axios.get(
            global_config.datapost.codeurl + '/wechat/ifs/jsconfig', {
                params: {
                    url: location.href.split('#')[0]
                }
            })
        .then(res => {
            if (res.data.code == 0) {
                //wx.config start
                var data = res.data.data[0]
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appid, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.noncestr, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名
                    jsApiList: ['chooseImage', 'scanQRCode', 'chooseWXPay', 'uploadImage', 'previewImage', 'onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表
                });
                //wx.config end
            }
        }).catch(function(res) {
            console.log(res);
        });
}
export {
    wxInit
}