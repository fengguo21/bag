const Home = r => require.ensure([], () => r(require('../../views/Home.vue')), 'Home')
const QRPage1000 = r => require.ensure([], () => r(require('../../views/qrcodereferee/Page1000.vue')), 'QRPage1000')
const QRPage1001 = r => require.ensure([], () => r(require('../../views/qrcodereferee/Page1001.vue')), 'QRPage1001')
const QRPage1002 = r => require.ensure([], () => r(require('../../views/qrcodereferee/Page1002.vue')), 'QRPage1002')

export default {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true,//只有一个节点
    children: [
        { path: '/qrcodereferee/page1000', component: QRPage1000, meta: { name: '概览' } },
        { path: '/qrcodereferee/page1001', component: QRPage1001, meta: { name: '粉丝管理' } },
        { path: '/qrcodereferee/page1002', component: QRPage1002, meta: { name: '系统设置' } }
    ]
}