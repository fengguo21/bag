const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')
const BIXYPage1000 = r => require.ensure([], () => r(require('../../views/bixy/Page1000.vue')), 'BIXYPage1000')
const BIXYPage1001 = r => require.ensure([], () => r(require('../../views/bixy/Page1001.vue')), 'BIXYPage1001')
const BIXYPage1002 = r => require.ensure([], () => r(require('../../views/bixy/Page1002.vue')), 'BIXYPage1002')
const BIXYPage1003 = r => require.ensure([], () => r(require('../../views/bixy/Page1003.vue')), 'BIXYPage1003')
const BIXYPage1004 = r => require.ensure([], () => r(require('../../views/bixy/Page1004.vue')), 'BIXYPage1004')
const BIXYPage1005 = r => require.ensure([], () => r(require('../../views/bixy/Page1005.vue')), 'BIXYPage1005')
const BIXYPage1006 = r => require.ensure([], () => r(require('../../views/bixy/Page1006.vue')), 'BIXYPage1006')
const BIXYPage1007 = r => require.ensure([], () => r(require('../../views/bixy/Page1007.vue')), 'BIXYPage1007')

export default {
	path: '/',
	component: Home,
	name: '',
	iconCls: 'fa fa-address-card',
	leaf: true,//只有一个节点
	children: [
	    { path: '/bixy/page1000', component: BIXYPage1000, meta: { name: 'Overview' } },
	    { path: '/bixy/page1001', component: BIXYPage1001, meta: { name: 'User Management' } },
	    { path: '/bixy/page1002', component: BIXYPage1002, meta: { name: 'Prodcut Management' } }, 
	    { path: '/bixy/page1003', component: BIXYPage1003, meta: { name: 'Order Management' } }, 
	    { path: '/bixy/page1004', component: BIXYPage1004, meta: { name: 'Capital Management' } }, 
	    { path: '/bixy/page1005', component: BIXYPage1005, meta: { name: 'System' } }, 
	    { path: '/bixy/page1006', component: BIXYPage1006, meta: { name: 'News Management' } }, 
	    { path: '/bixy/page1007', component: BIXYPage1007, meta: { name: 'FAQ Management' } } 
	]
}
