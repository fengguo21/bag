import Home from '../../views/Home.vue'
import Page1000 from '../../views/college/Page1000.vue'
import Page1001 from '../../views/college/Page1001.vue'
import Page1002 from '../../views/college/Page1002.vue'
import Page1003 from '../../views/college/Page1003.vue'
import Page1004 from '../../views/college/Page1004.vue'
import Page1005 from '../../views/college/Page1005.vue'


export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    // redirect: '/college/page1000',
    leaf: true,//只有一个节点
    children: [
        { path: '/college/page1000', component: Page1000, meta: { name: '概览' } },
        { path: '/college/page1001', component: Page1001, meta: { name: '用户管理' } },
        { path: '/college/page1002', component: Page1002, meta: { name: '课程管理' } },
        { path: '/college/page1003', component: Page1003, meta: { name: '订单管理' } }, 
        { path: '/college/page1004', component: Page1004, meta: { name: '资金管理' } },  
        { path: '/college/page1005', component: Page1005, meta: { name: '系统设置' } }
    ]
}