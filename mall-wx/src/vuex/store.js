import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)
var store = new Vuex.Store({
    // 定义状态
    state: {
        openid: '',
        load: true,
        id: '', //用户授权id
        headimgurl: "",
        nickname: "",
        /*  codeurl: "https://wechatapp.cdifs.cn", */
        islogin: false, //是否登录
        member: []
    },
    mutations: {
        chklogin: (state) => {

        }
    }
})

export default store