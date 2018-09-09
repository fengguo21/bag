const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')

const HYBPage1000 = r => require.ensure([], () => r(require('../../views/hyb/Page1000.vue')), 'HYBPage1000')
const HYBPage1001 = r => require.ensure([], () => r(require('../../views/hyb/Page1001.vue')), 'HYBPage1001')
const HYBPage1002 = r => require.ensure([], () => r(require('../../views/hyb/Page1002.vue')), 'HYBPage1002')

export default {
	path: '/',
	component: Home,
	name: '',
	iconCls: 'fa fa-address-card',
	leaf: true,//只有一个节点
	children: [
	    { path: '/hyb/page1000', component: HYBPage1000, meta: { name: '概览' } },
	    { path: '/hyb/page1001', component: HYBPage1001, meta: { name: '会员管理' } },
	    { path: '/hyb/page1002', component: HYBPage1002, meta: { name: '系统配置' } }  
	]
}