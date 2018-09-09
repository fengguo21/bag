import Home from '../../views/Home.vue'
import Page1000 from '../../views/dsh/Page1000.vue'
import Page1001 from '../../views/dsh/Page1001.vue'
import Page1002 from '../../views/dsh/Page1002.vue'
import Page1003 from '../../views/dsh/Page1003.vue'
import Page1004 from '../../views/dsh/Page1004.vue'
import Page1005 from '../../views/dsh/Page1005.vue'
import Page1006 from '../../views/dsh/Page1006.vue'
import Page1007 from '../../views/dsh/Page1007.vue'
import Page1008 from '../../views/dsh/Page1008.vue'
import Page1009 from '../../views/dsh/Page1009.vue'
import Page1010 from '../../views/dsh/Page1010.vue'

export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    // redirect: '/dsh/page1000',
    leaf: true,//只有一个节点
    children: [
        { path: '/dsh/page1000', component: Page1000, meta: { name: '概览' } },
        { path: '/dsh/page1001', component: Page1001, meta: { name: '用户管理' } },
        { path: '/dsh/page1002', component: Page1002, meta: { name: '书单管理' } }, 
        { path: '/dsh/page1003', component: Page1003, meta: { name: '渠道管理' } }, 
        { path: '/dsh/page1004', component: Page1004, meta: { name: '订单管理' } },
        { path: '/dsh/page1005', component: Page1005, meta: { name: '资金管理' } },
        { path: '/dsh/page1006', component: Page1006, meta: { name: '系统设置' } },
        { path: '/dsh/page1007', component: Page1007, meta: { name: '评论管理' } },
        { path: '/dsh/page1008', component: Page1008, meta: { name: '轮播管理' } },
        { path: '/dsh/page1009', component: Page1009, meta: { name: '优惠券管理' } },
        { path: '/dsh/page1010', component: Page1010, meta: { name: '音频管理' } }
    ]
}