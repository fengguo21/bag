import NotFound from '../views/404.vue'

/***************引入模块路由*********************/
import bixy from './children/bixy'
import huaqie from './children/huaqie'
import mmd from './children/mmd'
import zbcdz from './children/zbcdz'
import llq from './children/llq'
import xks from './children/xks'
import qrcode from './children/qrcode'
import agent from './children/agent'
import facegame from './children/facegame'
import cashier from './children/cashier'
import hyb from './children/hyb'
import hssy from './children/hssy'
import ienglish from './children/ienglish'
import ztwl from './children/ztwl'
import college from './children/college'
import meirongWeAppManager from './children/meirongWeAppManager'
import yyd from './children/yyd'
import dsh from './children/dsh'

//const login = r => require.ensure([], () => r(require('../views/Login.vue')), 'login')
import login from '../views/Login.vue'
//const ResetPassword = r => require.ensure([], () => r(require('../views/ResetPassword.vue')), 'ResetPassword')
import ResetPassword from '../views/ResetPassword.vue'

let routes = [
    {
        path: '/login',
        // component: Login,
        component: login,
        name: '',
        hidden: true
    },
    {
        path: '/resetPassword',
        // component: Login,
        component: ResetPassword,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
/*----mode start----*/
    huaqie,     // 花茄 
    mmd,        // 美美哒 
    zbcdz,      // 中博充电站
    llq,        // 老来青大米
    xks,        // 小昆山教练场 
    bixy,       // bixy   
    qrcode,     // qrcode
    agent,      // agent
    facegame,   // 认脸小程序 
    cashier,    // 收钱宝
    hyb,        // 会员宝
    hssy,       // 婚纱摄影
    ienglish,   // 爱英语
    ztwl,       // 中铁物流
    college,    // 学校
    meirongWeAppManager, // 美容小程序管理
    yyd,        // 易运动
    dsh,        // 读书会
/*----mode end----*/
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];
console.log(routes);
export default routes;