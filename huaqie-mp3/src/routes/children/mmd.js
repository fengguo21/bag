const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')
const MMDPage1000 = r => require.ensure([], () => r(require('../../views/mmd/Page1000.vue')), 'MMDPage1000')
const MMDPage1001 = r => require.ensure([], () => r(require('../../views/mmd/Page1001.vue')), 'MMDPage1001')
const MMDPage1002 = r => require.ensure([], () => r(require('../../views/mmd/Page1002.vue')), 'MMDPage1002')
const MMDPage1003 = r => require.ensure([], () => r(require('../../views/mmd/Page1003.vue')), 'MMDPage1003')
const MMDPage1004 = r => require.ensure([], () => r(require('../../views/mmd/Page1004.vue')), 'MMDPage1004')
const MMDPage1005 = r => require.ensure([], () => r(require('../../views/mmd/Page1005.vue')), 'MMDPage1005')
const MMDPage1006 = r => require.ensure([], () => r(require('../../views/mmd/Page1006.vue')), 'MMDPage1006')
const MMDPage1007 = r => require.ensure([], () => r(require('../../views/mmd/Page1007.vue')), 'MMDPage1007')
const MMDPage1008 = r => require.ensure([], () => r(require('../../views/mmd/Page1008.vue')), 'MMDPage1008')
const MMDPage1009 = r => require.ensure([], () => r(require('../../views/mmd/Page1009.vue')), 'MMDPage1009')
const MMDPage1010 = r => require.ensure([], () => r(require('../../views/mmd/Page1010.vue')), 'MMDPage1010')
const editCatalog = r => require.ensure([], () => r(require('../../components/mmd/editCatalog.vue')), 'editCatalog')


export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    // redirect: '/mmd/page1000',
    leaf: true,//只有一个节点
    children: [
        { path: '/mmd/editCatalog', component: editCatalog, meta: { name: '修改分类' } },  
        { path: '/mmd/page1000', component: MMDPage1000, meta: { name: '概览' } }, 
        { path: '/mmd/page1001', component: MMDPage1001, meta: { name: '用户管理' } }, 
        { path: '/mmd/page1002', component: MMDPage1002, meta: { name: '商品管理' } }, 
        { path: '/mmd/page1003', component: MMDPage1003, meta: { name: '订单管理' } }, 
        { path: '/mmd/page1004', component: MMDPage1004, meta: { name: '资金管理' } }, 
        { path: '/mmd/page1005', component: MMDPage1005, meta: { name: '销售员管理' } }, 
        { path: '/mmd/page1006', component: MMDPage1006, meta: { name: '系统配置' } },
        { path: '/mmd/page1007', component: MMDPage1007, meta: { name: '优惠券管理' } }, 
        { path: '/mmd/page1008', component: MMDPage1008, meta: { name: '会员卡管理' } }, 
        { path: '/mmd/page1009', component: MMDPage1009, meta: { name: '意见或建议管理' } },
        { path: '/mmd/page1010', component: MMDPage1010, meta: { name: '广告管理' } },
    ]
}