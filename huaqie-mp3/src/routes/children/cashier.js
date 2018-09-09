const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')

const CashierPage1000 = r => require.ensure([], () => r(require('../../views/cashier/Page1000.vue')), 'CashierPage1000')
const CashierPage1001 = r => require.ensure([], () => r(require('../../views/cashier/Page1001.vue')), 'CashierPage1001')
const CashierPage1002 = r => require.ensure([], () => r(require('../../views/cashier/Page1002.vue')), 'CashierPage1002')
const CashierPage1003 = r => require.ensure([], () => r(require('../../views/cashier/Page1003.vue')), 'CashierPage1003')
const CashierPage1004 = r => require.ensure([], () => r(require('../../views/cashier/Page1004.vue')), 'CashierPage1004')

export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true,//只有一个节点
    children: [ 
        { path: '/cashier/page1000', component: CashierPage1000, meta: { name: '概览' } },
        { path: '/cashier/page1001', component: CashierPage1001, meta: { name: '订单管理' } },
        { path: '/cashier/page1002', component: CashierPage1002, meta: { name: '员工管理' } },
        { path: '/cashier/page1003', component: CashierPage1003, meta: { name: '资金管理' } },
        { path: '/cashier/page1004', component: CashierPage1004, meta: { name: '系统配置' } }   
    ]
}