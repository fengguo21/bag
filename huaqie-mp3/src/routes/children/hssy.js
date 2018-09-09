const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')
const HSSYPage1000 = r => require.ensure([], () => r(require('../../views/hssy/Page1000.vue')), 'HSSYPage1000')
const HSSYPage1001 = r => require.ensure([], () => r(require('../../views/hssy/Page1001.vue')), 'HSSYPage1001')
const HSSYPage1002 = r => require.ensure([], () => r(require('../../views/hssy/Page1002.vue')), 'HSSYPage1002')
const HSSYPage1003 = r => require.ensure([], () => r(require('../../views/hssy/Page1003.vue')), 'HSSYPage1003')
const HSSYPage1004 = r => require.ensure([], () => r(require('../../views/hssy/Page1004.vue')), 'HSSYPage1004')
const HSSYPage1005 = r => require.ensure([], () => r(require('../../views/hssy/Page1005.vue')), 'HSSYPage1005')
const HSSYPage1006 = r => require.ensure([], () => r(require('../../views/hssy/Page1006.vue')), 'HSSYPage1006')
const HSSYPage1007 = r => require.ensure([], () => r(require('../../views/hssy/Page1007.vue')), 'HSSYPage1007')

export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true,//只有一个节点
    children: [
        { path: '/hssy/page1000', component: HSSYPage1000, meta: { name: '概览' } },
        { path: '/hssy/page1001', component: HSSYPage1001, meta: { name: '用户管理' } },
        { path: '/hssy/page1002', component: HSSYPage1002, meta: { name: '案例管理' } },
        { path: '/hssy/page1003', component: HSSYPage1003, meta: { name: '图库管理' } },
        { path: '/hssy/page1004', component: HSSYPage1004, meta: { name: '活动管理' } },
        { path: '/hssy/page1005', component: HSSYPage1005, meta: { name: '订单管理' } },
        { path: '/hssy/page1006', component: HSSYPage1006, meta: { name: '资金管理' } },
        { path: '/hssy/page1007', component: HSSYPage1007, meta: { name: '系统配置' } }  
    ]
}