/*
const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')
const ZBCDZPage1000 = r => require.ensure([], () => r(require('../../views/zbcdz/Page1000.vue')), 'ZBCDZPage1000')
const ZBCDZPage1001 = r => require.ensure([], () => r(require('../../views/zbcdz/Page1001.vue')), 'ZBCDZPage1001')
const ZBCDZPage1002 = r => require.ensure([], () => r(require('../../views/zbcdz/Page1002.vue')), 'ZBCDZPage1002')
const ZBCDZPage1003 = r => require.ensure([], () => r(require('../../views/zbcdz/Page1003.vue')), 'ZBCDZPage1003')
const ZBCDZPage1004 = r => require.ensure([], () => r(require('../../views/zbcdz/Page1004.vue')), 'ZBCDZPage1004')
const ZBCDZPage1005 = r => require.ensure([], () => r(require('../../views/zbcdz/Page1005.vue')), 'ZBCDZPage1005')
const ZBCDZPage1006 = r => require.ensure([], () => r(require('../../views/zbcdz/Page1006.vue')), 'ZBCDZPage1006')
const ZBCDZPage1007 = r => require.ensure([], () => r(require('../../views/zbcdz/Page1007.vue')), 'ZBCDZPage1007')
const ZBCDZPage1008 = r => require.ensure([], () => r(require('../../views/zbcdz/Page1008.vue')), 'ZBCDZPage1008')
*/
import Home from '../../views/Home.vue'
import ZBCDZPage1000 from '../../views/zbcdz/Page1000.vue'
import ZBCDZPage1001 from '../../views/zbcdz/Page1001.vue'
import ZBCDZPage1002 from '../../views/zbcdz/Page1002.vue'
import ZBCDZPage1003 from '../../views/zbcdz/Page1003.vue'
import ZBCDZPage1004 from '../../views/zbcdz/Page1004.vue'
import ZBCDZPage1005 from '../../views/zbcdz/Page1005.vue'
import ZBCDZPage1006 from '../../views/zbcdz/Page1006.vue'
import ZBCDZPage1007 from '../../views/zbcdz/Page1007.vue'
import ZBCDZPage1008 from '../../views/zbcdz/Page1008.vue'


export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    // redirect: '/zbcdz/page1000',
    leaf: true,//只有一个节点
    children: [
        { path: '/zbcdz/page1000', component: ZBCDZPage1000, meta: { name: '概览' } },
        { path: '/zbcdz/page1001', component: ZBCDZPage1001, meta: { name: '设备管理' } },
        { path: '/zbcdz/page1002', component: ZBCDZPage1002, meta: { name: '订单管理' } }, 
        { path: '/zbcdz/page1003', component: ZBCDZPage1003, meta: { name: '用户管理' } }, 
        { path: '/zbcdz/page1004', component: ZBCDZPage1004, meta: { name: '代理商管理' } }, 
        { path: '/zbcdz/page1005', component: ZBCDZPage1005, meta: { name: '资金管理' } }, 
        { path: '/zbcdz/page1006', component: ZBCDZPage1006, meta: { name: '系统配置' } },
        { path: '/zbcdz/page1007', component: ZBCDZPage1007, meta: { name: '交易管理' } }, 
        { path: '/zbcdz/page1008', component: ZBCDZPage1008, meta: { name: '报修管理' } }
    ]
}
