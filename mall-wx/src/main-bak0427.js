// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible'
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
var infiniteScroll = require('vue-infinite-scroll');
Vue.use(infiniteScroll)
Vue.prototype.$http = axios
var global_config = require('../static/config/myConfig.js')
Vue.prototype.global_config = global_config
    //Vue.use($)
    /* eslint-disable no-new */
router.beforeEach((to, from, next) => {

    // 判断微信客户端
    let ua = window.navigator.userAgent.toLowerCase()
    if (to.meta.title) {
        document.title = to.meta.title
    }

    if (to.name != "brand" && to.name != "branddetail") {
        // document.documentElement.scrollTop = 0
        // document.body.scrollTop = 0
        sessionStorage.removeItem("shoptop")
    }
    // 测试用
    if (document.domain == "localhost") {
        //  sessionStorage.setItem('usrid', 5474)
        sessionStorage.setItem('openid', 'oJ8giwqIS6CIz9UsfxnF1v7CHp8g')
    }
    var topath = to.fullPath

    if (!sessionStorage.getItem('usrid') && to.path != "/author") {
        sessionStorage.setItem('beforeLoginUrl', topath)
        next('/author')
        return false
            /*===第一次进入项目 end===*/
    } else {
        store.state.headimgurl = sessionStorage.getItem('headimgurl')
        store.state.id = sessionStorage.getItem('usrid')
        gologin(topath, next)
    }
    next()
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
                store.state.member.memberid = memberdata.member_id
                store.state.member.cardnum = memberdata.card_num
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
                    //  console.log(topath)
                    router.replace(topath)
                        //    next()
                } else {
                    router.replace({
                        name: 'login',
                        query: {
                            "redirect": topath
                        }
                    })
                }
                /*====判断是否登陆 end===*/
            } else {
                // next()
                router.replace(topath)
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
    //router.push("mc")
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
Vue.prototype.popwarn1 = function(message, title) {
    this.$alert(message, title, {
        confirmButtonText: '确定',
        type: 'warning',
        confirmButtonClass: "confirmbtn_1",
        center: true,
        callback: action => {

        }
    });
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