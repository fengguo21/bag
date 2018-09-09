import Home from '../../views/Home.vue'
import Page1000 from '../../views/ztwl/Page1000.vue'
import Page1001 from '../../views/ztwl/Page1001.vue'
import Page1002 from '../../views/ztwl/Page1002.vue'
import Page1003 from '../../views/ztwl/Page1003.vue'


export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    // redirect: '/ztwl/page1000',
    leaf: true,//只有一个节点
    children: [
        { path: '/ztwl/page1000', component: Page1000, meta: { name: '快递单管理' } },
        { path: '/ztwl/page1001', component: Page1001, meta: { name: '货运单管理' } },
        { path: '/ztwl/page1002', component: Page1002, meta: { name: '会员管理' } }, 
        { path: '/ztwl/page1003', component: Page1003, meta: { name: '系统设置' } }
    ]
}