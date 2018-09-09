const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')
const HQPage1000 = r => require.ensure([], () => r(require('../../views/huaqie/Page1000.vue')), 'HQPage1000')
const HQPage1001 = r => require.ensure([], () => r(require('../../views/huaqie/Page1001.vue')), 'HQPage1001')
const HQPage1002 = r => require.ensure([], () => r(require('../../views/huaqie/Page1002.vue')), 'HQPage1002')
const HQPage1003 = r => require.ensure([], () => r(require('../../views/huaqie/Page1003.vue')), 'HQPage1003')

export default {
	path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    // redirect: '/huaqie/page1000',
    leaf: true,//只有一个节点
    children: [
        { path: '/huaqie/page1000', component: HQPage1000 }, // 概览
        { path: '/huaqie/page1001', component: HQPage1001 }, // 预约管理
        { path: '/huaqie/page1002', component: HQPage1002 }, // vin码管理
        { path: '/huaqie/page1003', component: HQPage1003 } // 会员卡管理
    ]
}