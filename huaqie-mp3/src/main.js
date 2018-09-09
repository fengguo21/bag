import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import AMap from 'vue-amap'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes/index'
//import Mock from './mock'
//Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import session from 'store'
import VueHtml5Editor from 'vue-html5-editor'
import { avatarUrl } from './api/api'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(AMap)

AMap.initAMapApiLoader({
  key: '1436371b45faa879e41802121e7ea47c',
  plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor', 'AMap.Geocoder']
});

Vue.directive('focus', function (el, option) {
    var defClass = 'el-input', defTag = 'input';
    var value = option.value || true;
    if (typeof value === 'boolean')
        value = { cls: defClass, tag: defTag, foc: value };
    else
        value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false };
    if (el.classList.contains(value.cls) && value.foc)
        el.getElementsByTagName(value.tag)[0].focus();
});

// 富文本编辑器
const editorOptions = {
  name: "vue-html5-editor",
  showModuleName: false,
  icons: {
    text: "fa fa-pencil",
    color: "fa fa-paint-brush",
    font: "fa fa-font",
    align: "fa fa-align-justify",
    list: "fa fa-list",
    link: "fa fa-chain",
    unlink: "fa fa-chain-broken",
    tabulation: "fa fa-table",
    image: "fa fa-file-image-o",
    hr: "fa fa-minus",
    eraser: "fa fa-eraser",
    undo: "fa-undo fa",
    "full-screen": "fa fa-arrows-alt",
    info: "fa fa-info",
  },
  image: {
    // 文件最大体积，单位字节  max file size
    sizeLimit: 512 * 1024,
    // 上传参数,默认把图片转为base64而不上传
    // upload config,default null and convert image to base64
    upload: {
      url: avatarUrl,
      headers: {},
      params: {},
      fieldName: 'file'
    },
    compress: {
      width: 1600,
      height: 1600,
      quality: 80
    },
    uploadHandler(responseText){
      //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
      let json = JSON.parse(responseText)
      // console.log(json);
      if(json.code > 0) {
        console.log('error', json);
      } else {
        return json.data.url
      }
    }
  },
  language: "zh-cn",
  hiddenModules: [
    "info",
    "full-screen"
  ]
}
Vue.use(VueHtml5Editor, editorOptions)
//NProgress.configure({ showSpinner: false });
Vue.prototype.store = session;

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    session.remove('user');
  }
  let user = session.get('user')
  if (!user && to.path != '/login' && to.path != '/resetPassword') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

