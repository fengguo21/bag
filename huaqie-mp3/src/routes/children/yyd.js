import Home from '../../views/Home.vue'
import Page1000 from '../../views/yyd/Page1000.vue'
import Page1001 from '../../views/yyd/Page1001.vue'
import Page1002 from '../../views/yyd/Page1002.vue'
import Page1003 from '../../views/yyd/Page1003.vue'
import Page1006 from '../../views/yyd/Page1006.vue'
import Page1007 from '../../views/yyd/Page1007.vue'
import Page1008 from '../../views/yyd/Page1008.vue'
import Page1009 from '../../views/yyd/Page1009.vue'
import Page1010 from '../../views/yyd/Page1010.vue'

export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    // redirect: '/yyd/page1000',
    leaf: true,//只有一个节点
    children: [
        { path: '/yyd/page1000', component: Page1000, meta: { name: '概览' } },
        { path: '/yyd/page1001', component: Page1001, meta: { name: '用户管理' } },
        { path: '/yyd/page1010', component: Page1010, meta: { name: '器材管理' } },
        { path: '/yyd/page1002', component: Page1002, meta: { name: '柜子管理' } }, 
        { path: '/yyd/page1003', component: Page1003, meta: { name: '借还管理' } }, 
        { path: '/yyd/page1009', component: Page1009, meta: { name: '反馈管理' } },
        { path: '/yyd/page1006', component: Page1006, meta: { name: '订单管理' } },
        { path: '/yyd/page1007', component: Page1007, meta: { name: '资金管理' } },
        { path: '/yyd/page1008', component: Page1008, meta: { name: '系统设置' } }
    ]
}