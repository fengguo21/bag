const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')

const AgentPage1000 = r => require.ensure([], () => r(require('../../views/agent/Page1000.vue')), 'AgentPage1000')
const AgentPage1001 = r => require.ensure([], () => r(require('../../views/agent/Page1001.vue')), 'AgentPage1001')
const AgentPage1002 = r => require.ensure([], () => r(require('../../views/agent/Page1002.vue')), 'AgentPage1002')
const AgentPage1003 = r => require.ensure([], () => r(require('../../views/agent/Page1003.vue')), 'AgentPage1003')
const AgentPage1004 = r => require.ensure([], () => r(require('../../views/agent/Page1004.vue')), 'AgentPage1004')

export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true,//只有一个节点
    children: [
        { path: '/agent/page1000', component: AgentPage1000, meta: { name: '概览' } },
        { path: '/agent/page1001', component: AgentPage1001, meta: { name: '创建应用' } },
        { path: '/agent/page1002', component: AgentPage1002, meta: { name: '应用管理' } },
        { path: '/agent/page1003', component: AgentPage1003, meta: { name: '资金管理' } },
        { path: '/agent/page1004', component: AgentPage1004, meta: { name: '员工管理' } } 
    ]
}