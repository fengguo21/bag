/*
const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')

const CommonPage1000 = r => require.ensure([], () => r(require('../../views/common/Page1000.vue')), 'CommonPage1000')
const CommonPage1001 = r => require.ensure([], () => r(require('../../views/common/Page1001.vue')), 'CommonPage1001')
const CommonPage1002 = r => require.ensure([], () => r(require('../../views/common/Page1002.vue')), 'CommonPage1002')
const CommonPage1003 = r => require.ensure([], () => r(require('../../views/common/Page1003.vue')), 'CommonPage1003')
const CommonPage1004 = r => require.ensure([], () => r(require('../../views/common/Page1004.vue')), 'CommonPage1004')
const CommonPage1005 = r => require.ensure([], () => r(require('../../views/common/Page1005.vue')), 'CommonPage1005')
const CommonPage1006 = r => require.ensure([], () => r(require('../../views/common/Page1006.vue')), 'CommonPage1006')
const CommonPage1007 = r => require.ensure([], () => r(require('../../views/common/Page1007.vue')), 'CommonPage1007')
*/
import Home from '../../views/Home.vue'
import CommonPage1000 from '../../views/common/Page1000.vue'
import CommonPage1001 from '../../views/common/Page1001.vue'
import CommonPage1002 from '../../views/common/Page1002.vue'
import CommonPage1003 from '../../views/common/Page1003.vue'
import CommonPage1004 from '../../views/common/Page1004.vue'
import CommonPage1005 from '../../views/common/Page1005.vue'
import CommonPage1006 from '../../views/common/Page1006.vue'
import CommonPage1007 from '../../views/common/Page1007.vue'

export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true,//只有一个节点
    children: [ 
        { path: '/common/page1000', component: CommonPage1000, meta: { name: '概览' } },
        { path: '/common/page1001', component: CommonPage1001, meta: { name: '用户管理' } },
        { path: '/common/page1002', component: CommonPage1002, meta: { name: '商品管理' } }, 
        { path: '/common/page1003', component: CommonPage1003, meta: { name: '订单管理' } }, 
        { path: '/common/page1004', component: CommonPage1004, meta: { name: '资金管理' } }, 
        { path: '/common/page1005', component: CommonPage1005, meta: { name: '系统配置' } }, 
        { path: '/common/page1006', component: CommonPage1006, meta: { name: '广告管理' } }, 
        { path: '/common/page1007', component: CommonPage1007, meta: { name: '运费管理' } }   
    ]
}