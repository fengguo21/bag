// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible'
import 'babel-polyfill'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import axios from 'axios'
import Vuex from 'vuex'
import store from './vuex/store'
require('swiper/dist/css/swiper.css')
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueAwesomeSwiper)
Vue.use(Vuex)
    // 注册全局 infiniteScroll
var infiniteScroll = require('vue-infinite-scroll')
Vue.use(infiniteScroll)
Vue.prototype.$http = axios
    //var global_config = require('../static/config/myConfig.js')
var global_config = require('@/assets/js/config/myConfig.js')
    //alert("test2")
Vue.prototype.global_config = global_config

/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
    // 判断微信客户端
    var ua = window.navigator.userAgent.toLowerCase()
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if (to.name != "brand" && to.name != "branddetail") {
        sessionStorage.removeItem("shoptop")
    }
    // 测试用
    if (document.domain == "localhost") {
        localStorage.setItem('usrid_1', 927081)
        localStorage.setItem('openid_1', 'oJ8giwlFORnnHoYj1LX3wIkFl0YE')
    }
    var topath = to.fullPath
        // var Storage_usrid = sessionStorage.getItem('usrid')
        // var Storage_openid = sessionStorage.getItem('openid')
        // var Storage_headimgurl = sessionStorage.getItem('headimgurl')
    var Storage_usrid = localStorage.getItem('usrid_1')
    var Storage_openid = localStorage.getItem('openid_1')
    console.log("usr_id" + Storage_usrid)
    console.log("openid_1" + Storage_openid)
    var Storage_headimgurl = localStorage.getItem('headimgurl_1')
    if (!Storage_usrid || !Storage_openid) {
        if (window.location.href.indexOf('code') >= 0) { //判断有没有微信code 
            //发请求，用code换token  start
            //let code = window.location.href.split("?")[1]
            let code = window.location.href.split("code=")[1]
                //var wxcode = code.substring(5, code.indexOf('&'))
            console.log("code " + code)
            var wxcode = code.substring(0, code.indexOf('&'))
            console.log("wxcode " + wxcode)
            var code = window.location.href.indexOf('code')
            axios.get(
                    global_config.datapost.codeurl + '/wechat/ifs/code', {
                        params: {
                            code: wxcode
                        }
                    })
                .then(res => {
                    if (res.data.code != 0) {
                        alert(res.data.msg)
                        return false
                    }
                    let data = res.data.data[0]
                    store.state.headimgurl = data.wechator.headimgurl
                    store.state.nickname = data.wechator.nickname
                    store.state.id = data.wechator.id
                    store.state.openid = data.wechator.openid
                        /*===保存授权信息 start===*/
                        // sessionStorage.setItem('headimgurl', store.state.headimgurl)
                        //sessionStorage.setItem('usrid', store.state.id)
                        //sessionStorage.setItem('openid', store.state.openid)
                    localStorage.setItem('headimgurl_1', store.state.headimgurl)
                    localStorage.setItem('usrid_1', store.state.id)
                    localStorage.setItem('openid_1', store.state.openid)
                        /*===保存授权信息 end===.setItem('usrid'*/
                        //登陆跳转 start
                    gologin(topath, next)
                        //登陆跳转 end
                }).catch(function(res) {
                    alert("授权失败，请退出重新进入")
                });

        } else {
            var appid = global_config.datapost.appid
                // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(document.URL) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(location.href) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
        }

        /*===第一次进入项目 end===*/
    } else {
        store.state.headimgurl = Storage_headimgurl
        store.state.id = Storage_usrid
        store.state.openid = Storage_openid
        gologin(topath, next)
    }
    // 判断微信客户端 end   
})
router.afterEach((to, from, next) => {
    var myDate = new Date().Format("yyyy-MM-dd hh:mm:ss")
    var myDate2 = new Date().Format("yyyy-MM-dd")
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
        //微信前端用户访问记录新增
    axios.get(
            global_config.datapost.data_url + '/saas-api/api/portal/custom', {
                params: {
                    dataSourceCode: global_config.datapost.dataSourceCode,
                    repCode: 'REP_001656',
                    var_user_id: store.state.id,
                    var_page_name: to.meta.title,
                    var_visit_time: myDate
                }
            })
        .then(res => {
            if (res.data.code == 0) {
                //console.log(res.data.data[0])
            }
        }).catch(function(res) {
            console.log(res)
        });
    //微信前端用户访问记录pv数统计
    axios.get(
            global_config.datapost.data_url + '/saas-api/api/portal/custom', {
                params: {
                    dataSourceCode: global_config.datapost.dataSourceCode,
                    repCode: 'REP_001658',
                    var_visit_time: myDate2
                }
            })
        .then(res => {
            if (res.data.code == 0) {
                // console.log(res.data.data[0])
            }
        }).catch(function(res) {
            console.log(res)
        });
    //微信前端用户访问记录uv数统计
    axios.get(
            global_config.datapost.data_url + '/saas-api/api/portal/custom', {
                params: {
                    dataSourceCode: global_config.datapost.dataSourceCode,
                    repCode: 'REP_001660',
                    var_visit_time: myDate2
                }
            })
        .then(res => {
            if (res.data.code == 0) {
                //  console.log(res.data.data[0])
            }
        }).catch(function(res) {
            console.log(res)
        });
});
Date.prototype.Format = function(fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function gologin(topath, next) {
    //登陆跳转 start
    var nextRoute = ['/mc']
    axios.get(
            global_config.datapost.codeurl + '/wechat/ifs/wechator/' + store.state.id + '/membinfo', {
                params: {}
            })
        .then(res => {
            // store.state.code = res.data.code
            if (res.data.code == 0) {
                //成功获取用户信息
                let memberdata = res.data.data[0]
                store.state.islogin = true
                store.state.member.memberid = memberdata.id
                store.state.member.cardnum = memberdata.card_num
                store.state.member.membercode = memberdata.member_code
                store.state.member.pastpoint = memberdata.member_past_point
                store.state.member.memberpoint = memberdata.member_point
                store.state.member.gradenme = memberdata.grade_name
                store.state.member.gradecode = memberdata.grade_code
                store.state.member.phone = memberdata.phone
                store.state.member.membername = memberdata.member_name
            }
            /*========判断登陆 跳转页面 start========*/
            if (topath.indexOf(nextRoute) >= 0) {
                /*====判断是否登陆 start===*/
                if (store.state.islogin) {
                    next()
                } else {
                    next('/login')
                        /* router.replace({
                            name: 'login',
                            query: {
                                "redirect": topath
                            }
                        }) */
                }
                /*====判断是否登陆 end===*/
            } else {
                next()
            }
            /*========判断登陆 跳转页面 end========*/
        }).catch(function(res) {
            console.log(res);
        });
    //登陆跳转 end
}

new Vue({
        el: '#app',
        router,
        store,
        template: '<App/>',
        components: {
            App
        }
    })
    /*导入全局设置 start*/

/*导入全局设置 end*/
// 路由预先判断 start

// 路由预先判断 end
//全局函数 opentel1

Vue.prototype.opentel1 = function(tel) {
    this.$confirm('' + tel, '您确认拔打', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonClass: "confirmbtn",
        center: true
    }).then(() => {
        window.location.href = "tel:" + tel
    }).catch(() => {});
}
Vue.prototype.substr_date = function(date) {
    if (date) {
        var date_sub = date.replace("T", " ").toString()
        date_sub = date_sub.substr(0, 16)
    }
    return date_sub
}
Vue.prototype.popwarn1 = function(message, title) {
    this.$alert(message, title, {
        confirmButtonText: '确定',
        type: 'warning',
        confirmButtonClass: "confirmbtn_1",
        center: true,
        callback: action => {

        }
    })
}
Vue.prototype.chklogin = function(origin) {
    console.log(origin)
    if (!this.$store.state.islogin) {
        this.$alert('您还未登录，请先登录', '温馨提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            showClose: false,
            confirmButtonClass: "confirmbtn",
            showCancelButton: false,
            confirmButtonClass: "confirmbtn_1",
            center: true
        }).then(() => {
            this.$router.replace({
                name: "login",
                query: {
                    "redirect": origin
                }
            })
        }).catch(() => {});
    }
}
Vue.prototype.sub_date = function(time) {
    if (time) {
        time = time.replace("T", " ").toString().substr(0, 16)
    }
    return time
}