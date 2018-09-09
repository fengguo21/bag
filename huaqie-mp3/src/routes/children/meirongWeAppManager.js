import Home from '../../views/Home.vue'
import Page1000 from '../../views/meirongWeAppManager/Page1000.vue'
import Page1001 from '../../views/meirongWeAppManager/Page1001.vue'
import Page1002 from '../../views/meirongWeAppManager/Page1002.vue'
import Page1003 from '../../views/meirongWeAppManager/Page1003.vue'


export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    // redirect: '/ztwl/page1000',
    leaf: true,//只有一个节点
    children: [
        { path: '/meirongWeAppManager/page1000', component: Page1000, meta: { name: '概览' } },
        { path: '/meirongWeAppManager/page1001', component: Page1001, meta: { name: '应用管理' } },
        { path: '/meirongWeAppManager/page1002', component: Page1002, meta: { name: '角色管理' } }, 
        { path: '/meirongWeAppManager/page1003', component: Page1003, meta: { name: '系统设置' } }
    ]
}