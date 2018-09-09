/*
const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')
const XKSPage1000 = r => require.ensure([], () => r(require('../../views/xks/Page1000.vue')), 'XKSPage1000')
const XKSPage1001 = r => require.ensure([], () => r(require('../../views/xks/Page1001.vue')), 'XKSPage1001')
// const XKSPage1002 = r => require.ensure([], () => r(require(PATH + 'xks/Page1002.vue')), 'XKSPage1002')
const XKSPage1003 = r => require.ensure([], () => r(require('../../views/xks/Page1003.vue')), 'XKSPage1003')
const XKSPage1004 = r => require.ensure([], () => r(require('../../views/xks/Page1004.vue')), 'XKSPage1004')
const XKSPage1005 = r => require.ensure([], () => r(require('../../views/xks/Page1005.vue')), 'XKSPage1005')
const XKSPage1006 = r => require.ensure([], () => r(require('../../views/xks/Page1006.vue')), 'XKSPage1006')
// const XKSPage1007 = r => require.ensure([], () => r(require('../../views/xks/Page1007.vue')), 'XKSPage1007')
const XKSPage1008 = r => require.ensure([], () => r(require('../../views/xks/Page1008.vue')), 'XKSPage1008')
const XKSPage1009 = r => require.ensure([], () => r(require('../../views/xks/Page1009.vue')), 'XKSPage1009')
*/
import Home from '../../views/Home.vue'
import XKSPage1000 from '../../views/xks/Page1000.vue'
import XKSPage1001 from '../../views/xks/Page1001.vue'
import XKSPage1003 from '../../views/xks/Page1003.vue'
import XKSPage1004 from '../../views/xks/Page1004.vue'
import XKSPage1005 from '../../views/xks/Page1005.vue'
import XKSPage1006 from '../../views/xks/Page1006.vue'
import XKSPage1008 from '../../views/xks/Page1008.vue'
import XKSPage1009 from '../../views/xks/Page1009.vue'

export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    // redirect: '/huaqie/page1000',
    leaf: true,//只有一个节点
    children: [
        { path: '/xks/page1001', component: XKSPage1001, meta: { name: '收款窗口管理' } }, 
        // { path: '/xks/page1002', component: lazy('/xks/Page1002'), meta: { name: '收营员管理' } }, 
        { path: '/xks/page1003', component: XKSPage1003, meta: { name: '订单管理' } }, 
        { path: '/xks/page1004', component: XKSPage1004, meta: { name: '资金管理' } }, 
        { path: '/xks/page1005', component: XKSPage1005, meta: { name: '员工管理' } }, 
        { path: '/xks/page1006', component: XKSPage1006, meta: { name: '系统设置' } },
        { path: '/xks/page1000', component: XKSPage1000, meta: { name: '收银' } },
        { path: '/xks/page1008', component: XKSPage1008, meta: { name: '小票打印机管理' } },
        { path: '/xks/page1009', component: XKSPage1009, meta: { name: '收款项目管理' } },
    ]
}