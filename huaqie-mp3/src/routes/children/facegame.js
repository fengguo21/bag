const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')
const FGPage1000 = r => require.ensure([], () => r(require('../../views/facegame/Page1000.vue')), 'FGPage1000')
const FGPage1001 = r => require.ensure([], () => r(require('../../views/facegame/Page1001.vue')), 'FGPage1001')
const FGPage1002 = r => require.ensure([], () => r(require('../../views/facegame/Page1002.vue')), 'FGPage1002')
const FGPage1003 = r => require.ensure([], () => r(require('../../views/facegame/Page1003.vue')), 'FGPage1003')
const FGPage1004 = r => require.ensure([], () => r(require('../../views/facegame/Page1004.vue')), 'FGPage1004')
const FGPage1005 = r => require.ensure([], () => r(require('../../views/facegame/Page1005.vue')), 'FGPage1005')
const FGPage1006 = r => require.ensure([], () => r(require('../../views/facegame/Page1006.vue')), 'FGPage1006')
const FGPage1007 = r => require.ensure([], () => r(require('../../views/facegame/Page1007.vue')), 'FGPage1007')

export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true,//只有一个节点
    children: [
        { path: '/facegame/page1000', component: FGPage1000, meta: { name: '数据统计' } },
        { path: '/facegame/page1001', component: FGPage1001, meta: { name: '用户管理' } },
        { path: '/facegame/page1002', component: FGPage1002, meta: { name: '今日脸星管理' } },
        { path: '/facegame/page1003', component: FGPage1003, meta: { name: '脸谱管理' } },
        { path: '/facegame/page1004', component: FGPage1004, meta: { name: '课程管理' } },
        { path: '/facegame/page1005', component: FGPage1005, meta: { name: '系统配置' } },
        { path: '/facegame/page1006', component: FGPage1006, meta: { name: '角色管理' } },
        { path: '/facegame/page1007', component: FGPage1007, meta: { name: '活动管理' } } 
    ]
}