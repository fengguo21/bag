import Home from '../../views/Home.vue'
import Page1000 from '../../views/ienglish/Page1000.vue'
import Page1001 from '../../views/ienglish/Page1001.vue'
import Page1002 from '../../views/ienglish/Page1002.vue'
import Page1003 from '../../views/ienglish/Page1003.vue'
import Page1004 from '../../views/ienglish/Page1004.vue'
import Page1005 from '../../views/ienglish/Page1005.vue'
import Page1006 from '../../views/ienglish/Page1006.vue'
import Page1007 from '../../views/ienglish/Page1007.vue'
import Page1008 from '../../views/ienglish/Page1008.vue'

export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    // redirect: '/ienglish/page1000',
    leaf: true,//只有一个节点
    children: [
        { path: '/ienglish/page1000', component: Page1000, meta: { name: '概览' } },
        { path: '/ienglish/page1001', component: Page1001, meta: { name: '用户管理' } },
        { path: '/ienglish/page1002', component: Page1002, meta: { name: '课程管理' } }, 
        { path: '/ienglish/page1003', component: Page1003, meta: { name: '订单管理' } }, 
        { path: '/ienglish/page1004', component: Page1004, meta: { name: '资金管理' } }, 
        { path: '/ienglish/page1005', component: Page1005, meta: { name: '系统设置' } },
        { path: '/ienglish/page1006', component: Page1006, meta: { name: '阅读管理' } },
        { path: '/ienglish/page1007', component: Page1007, meta: { name: '文章管理' } },
        { path: '/ienglish/page1008', component: Page1008, meta: { name: '广告管理' } }
    ]
}