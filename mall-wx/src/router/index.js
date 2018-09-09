import Vue from 'vue'
import Router from 'vue-router'
//import brand from '@/components/brand'
//import branddetail from '@/components/brand_detail'
Vue.use(Router)
export default new Router({
    base: "/weixin/",
    routes: [
        /* {
                    path: '',
                    name: 'index',
                    redirect: '/mc',
                    meta: {
                        title: '会员中心',
                        keepAlive: false,
                        auth: true
                    }
                }, */
        {
            path: '/mc',
            name: 'mc',
            component: resolve => require(['@/components/index'], resolve),
            meta: {
                title: '成都IFS·会员中心',
                keepAlive: true,
                auth: true
            }
        },
        {
            path: '/mc/mygold',
            name: 'mygold',
            component: resolve => require(['@/components/mygold'], resolve),
            meta: {
                title: '成都IFS·我的国金会',
                keepAlive: true
            }
        },
        {
            path: '/event',
            name: 'event',
            redirect: '/eventNew',
            component: resolve => require(['@/components/event'], resolve),
            children: [{
                    path: '/eventNew',
                    name: 'eventNew',
                    component: resolve => require(['@/components/eventNew'], resolve),
                    meta: {
                        title: '成都IFS·最新活动',
                        keepAlive: false
                    }
                },
                {
                    path: '/eventHis',
                    name: 'eventHis',
                    component: resolve => require(['@/components/eventHis'], resolve),
                    meta: {
                        title: '成都IFS·往期回顾',
                        keepAlive: false
                    }
                }

            ]
        },
        {
            path: '/myevent',
            name: 'myevent',
            component: resolve => require(['@/components/myevent'], resolve),
            meta: {
                title: '成都IFS·我的活动',
                keepAlive: false
            }
        },
        {
            path: '/magazine',
            name: 'magazine',
            component: resolve => require(['@/components/magzine'], resolve),
            meta: {
                title: '成都IFS·限量杂志',
                keepAlive: false
            }
        },
        {
            path: '/eventdetail/:id',
            name: 'eventdetail',
            component: resolve => require(['@/components/eventdetail'], resolve),
            meta: {
                title: '成都IFS·活动详情',
                keepAlive: false
            }
        },
        {
            path: '/magazinedetail/:id',
            name: 'magazinedetail',
            component: resolve => require(['@/components/magazinedetail'], resolve),
            meta: {
                title: '成都IFS·杂志详情',
                keepAlive: false
            }
        },
        {
            path: '/brand',
            name: 'brand',
            component: resolve => require(['@/components/brand'], resolve),
            meta: {
                title: '成都IFS·品牌导览',
                keepAlive: true
            }
        }, {
            path: '/mc/selfscore',
            name: 'selfscore',
            component: resolve => require(['@/components/selfscore'], resolve),
            meta: {
                title: '成都IFS·自助积分',
                keepAlive: false
            }
        }, {
            path: '/mc/myselfscore',
            name: 'myselfscore',
            component: resolve => require(['@/components/myselfscore'], resolve),
            meta: {
                title: '成都IFS·我的拍照积分记录',
                keepAlive: false
            }
        }, {
            path: '/mc/uploadscore',
            name: 'uploadscore',
            component: resolve => require(['@/components/uploadscore'], resolve),
            meta: {
                title: '成都IFS·拍照上传',
                keepAlive: false
            }
        },

        {
            path: '/mc/shopmall',
            name: 'shopmall',
            component: resolve => require(['@/components/shopmall'], resolve),
            redirect: {
                path: '/mc/shopmall/index'
            },
            meta: {
                title: '成都IFS·积分商城',
                keepAlive: false

            },
            children: [{
                    path: '/mc/shopmall/index',
                    name: 'shopmallIndex',
                    component: resolve => require(['@/components/public/shoplist'], resolve),
                    meta: {
                        title: '成都IFS·积分商城',
                        keepAlive: false

                    }
                },
                {
                    path: '/mc/shopmall/myGift',
                    name: 'myGift',
                    component: resolve => require(['@/components/public/myGift'], resolve),
                    meta: {
                        title: '成都IFS·我的礼品',
                        keepAlive: false

                    }
                },

            ]

        }, {
            path: '/mc/exchange/:gift_id',
            name: 'exchange',
            component: resolve => require(['@/components/exchange'], resolve),
            meta: {
                title: '成都IFS·积分兑换'
            }

        },
        {
            path: '/exchange_park/:gift_id', //停车缴费下面的积分兑换
            name: 'exchange_park',
            component: resolve => require(['@/components/exchange_park'], resolve),
            meta: {
                title: '成都IFS·停车券积分兑换'
            }

        },
        {
            path: '/exchange_coupons/:gift_id',
            name: 'exchange_coupons',
            component: resolve => require(['@/components/exchange_coupons'], resolve),
            meta: {
                title: '成都IFS·停车券消费兑换'
            }

        },
        {
            path: '/branddetail/:id',
            name: 'branddetail',
            component: resolve => require(['@/components/brand_detail'], resolve),
            meta: {
                title: '成都IFS·品牌详情',
                keepAlive: false
            }
        },
        {
            path: '/mycard',
            name: 'mycard',
            redirect: '/mycard1',
            component: resolve => require(['@/components/mycard'], resolve),
            children: [{
                    path: '/mycard1',
                    name: 'mycard1',
                    component: resolve => require(['@/components/mycard1'], resolve),
                    meta: {
                        title: '成都IFS·我的卡券',
                        keepAlive: false
                    }
                },
                {
                    path: '/mycard2',
                    name: 'mycard2',
                    component: resolve => require(['@/components/mycard2'], resolve),
                    meta: {
                        title: '成都IFS·我的卡券',
                        keepAlive: false
                    }
                },
                {
                    path: '/mycard3',
                    name: 'mycard3',
                    component: resolve => require(['@/components/mycard3'], resolve),
                    meta: {
                        title: '成都IFS·我的卡券',
                        keepAlive: false
                    }
                }
            ]
        },
        {
            path: '/service',
            name: 'service',
            component: resolve => require(['@/components/service'], resolve),
            meta: {
                title: '成都IFS·贴心服务',
                keepAlive: true
            }
        },
        {
            path: '/about',
            name: 'about',
            //redirect: '/about',
            component: resolve => require(['@/components/about'], resolve),
            meta: {
                title: '关于成都IFS',
                keepAlive: false
            },
        },
        {
            path: '/vip',
            name: 'vip',
            //redirect: '/about',
            component: resolve => require(['@/components/vip'], resolve),
            meta: {
                title: '成都IFS·会员权益',
                keepAlive: false
            }
        },
        {
            path: '/article_membership',
            name: 'article_membership',
            //redirect: '/about',
            component: resolve => require(['@/components/article_membership'], resolve),
            meta: {
                title: '成都IFS·入会标准',
                keepAlive: false
            }
        },
        {
            path: '/article_birthday',
            name: 'article_birthday',
            //redirect: '/about',
            component: resolve => require(['@/components/article_birthday'], resolve),
            meta: {
                title: '成都IFS·生日权益',
                keepAlive: false
            }
        },
        {
            path: '/article_park',
            name: 'article_park',
            //redirect: '/about',
            component: resolve => require(['@/components/article_park'], resolve),
            meta: {
                title: '成都IFS·代客泊车',
                keepAlive: false
            }
        },
        {
            path: '/article_vip',
            name: 'article_vip',
            //redirect: '/about',
            component: resolve => require(['@/components/article_vip'], resolve),
            meta: {
                title: '成都IFS·VIP贵宾室',
                keepAlive: false
            }
        },
        {
            path: '/article_electronic',
            name: 'article_electronic',
            //redirect: '/about',
            component: resolve => require(['@/components/article_electronic'], resolve),
            meta: {
                title: '成都IFS·会员手册',
                keepAlive: false
            }
        },
        {
            path: '/artical_tip1',
            name: 'artical_tip1',
            //redirect: '/about',
            component: resolve => require(['@/components/artical_tip1'], resolve),
            meta: {
                title: '成都IFS·母婴室',
                keepAlive: false
            }
        },
        {
            path: '/artical_tip2',
            name: 'artical_tip2',
            //redirect: '/about',
            component: resolve => require(['@/components/artical_tip2'], resolve),
            meta: {
                title: '成都IFS·礼宾台',
                keepAlive: false
            }
        },
        {
            path: '/artical_tip3',
            name: 'artical_tip3',
            //redirect: '/about',
            component: resolve => require(['@/components/artical_tip3'], resolve),
            meta: {
                title: '成都IFS·包装服务',
                keepAlive: false
            }
        },
        {
            path: '/artical_tip4',
            name: 'artical_tip4',
            //redirect: '/about',
            component: resolve => require(['@/components/artical_tip4'], resolve),
            meta: {
                title: '成都IFS·租借服务',
                keepAlive: false
            }
        },
        {
            path: '/artical_tip7',
            name: 'artical_tip7',
            //redirect: '/about',
            component: resolve => require(['@/components/artical_tip7'], resolve),
            meta: {
                title: '成都IFS·急救设备',
                keepAlive: false
            }
        },
        {
            path: '/artical_tip8',
            name: 'artical_tip8',
            //redirect: '/about',
            component: resolve => require(['@/components/artical_tip8'], resolve),
            meta: {
                title: '成都IFS·失物招领',
                keepAlive: false
            }
        },
        {
            path: '/artical_tip9',
            name: 'artical_tip9',
            //redirect: '/about',
            component: resolve => require(['@/components/artical_tip9'], resolve),
            meta: {
                title: '成都IFS·物品寄存',
                keepAlive: false
            }
        },
        {
            path: '/artical_tip10',
            name: 'artical_tip10',
            //redirect: '/about',
            component: resolve => require(['@/components/artical_tip10'], resolve),
            meta: {
                title: '成都IFS·停车服务',
                keepAlive: false
            }
        },
        {
            path: '/artical_tip11',
            name: 'artical_tip11',
            //redirect: '/about',
            component: resolve => require(['@/components/artical_tip11'], resolve),
            meta: {
                title: '成都IFS·其他服务',
                keepAlive: false
            }
        }, {
            path: '/park',
            name: 'park',
            component: resolve => require(['@/components/park'], resolve),
            meta: {
                title: '成都IFS·停车支付',
                keepAlive: false
            }
        }, {
            path: '/park_money',
            name: 'park_money',
            component: resolve => require(['@/components/park_money'], resolve),
            meta: {
                title: '成都IFS·停车缴费',
                keepAlive: false
            }
        },
        {
            path: '/park_list',
            name: 'park_list',
            component: resolve => require(['@/components/park_list2'], resolve),
            meta: {
                title: '成都IFS·积分领券',
                keepAlive: true
            },
            redirect: {
                name: 'park_quan'
            },
            children: [{
                    path: '/park_quan',
                    name: 'park_quan',
                    component: resolve => require(['@/components/park_quan'], resolve),
                    meta: {
                        title: '成都IFS·自助兑换停车券',
                        keepAlive: false
                    }
                },
                {
                    path: '/shoplist_park',
                    name: 'shoplist_park',
                    component: resolve => require(['@/components/public/shoplist_park'], resolve),//shoplist_park页面参照shoplist.vue页面
                    meta: {
                        title: '成都IFS·停车积分兑换',
                        keepAlive: false
                    }
                }, {
                    path: '/mycard1_park',
                    name: 'mycard1_park',
                    component: resolve => require(['@/components/mycard1_park'], resolve),
                    meta: {
                        title: '成都IFS·我的卡券',
                        keepAlive: false
                    }
                }
            ]
        }, {
            path: '/article_parkdis',
            name: 'article_parkdis',
            component: resolve => require(['@/components/article_parkdis'], resolve),
            meta: {
                title: '成都IFS·停车优惠',
                keepAlive: false
            }
        }, {
            path: '/login',
            name: 'login',
            component: resolve => require(['@/components/login'], resolve),
            meta: {
                title: '成都IFS·注册/绑定',
                keepAlive: true
            }
        },
        {
            path: '/register2',
            name: 'register2',
            component: resolve => require(['@/components/register2'], resolve),
            meta: {
                title: '成都IFS·注册会员',
                keepAlive: false
            }
        }, {
            path: '/register_bind',
            name: 'register_bind',
            component: resolve => require(['@/components/register_bind'], resolve),
            meta: {
                title: '成都IFS·绑定会员',
                keepAlive: false
            }
        }, {
            path: '/article_kefu',
            name: 'article_kefu',
            component: resolve => require(['@/components/article_kefu'], resolve),
            meta: {
                title: '成都IFS·联系客服',
                keepAlive: false
            }
        }, {
            path: '/article-rule',
            name: 'article-rule',
            component: resolve => require(['@/components/article-rule'], resolve),
            meta: {
                title: '成都IFS·用户注册协议',
                keepAlive: false
            }
        }, {
            path: '/shoplist_coupons',
            name: 'shoplist_coupons',
            //component: resolve => require(['@/components/public/shoplist_coupons'], resolve),
             component: resolve => require(['@/components/public/shoplist_coupons2'], resolve),
            meta: {
                title: '成都IFS·消费换券',
                keepAlive: false
            }
        },
        {
            path: '/eventbm',
            name: 'eventbm',
            component: resolve => require(['@/components/eventbm'], resolve),
            meta: {
                title: '成都IFS·活动报名',
                keepAlive: false
            }
        },
        {
            path: '/sign',
            name: 'sign',
            component: resolve => require(['@/components/sign'], resolve),
            meta: {
                title: '成都IFS·扫码签到',
                keepAlive: false
            }
        },
        {
            path: '/open',
            name: 'open',
            component: resolve => require(['@/components/open'], resolve),
            meta: {
                title: '成都IFS·您的微信二维码',
                keepAlive: false
            }
        },
        /*  {
             path: '/author',
             name: 'author',
             component: resolve => require(['@/components/author'], resolve),
             meta: {
                 title: '会员中心',
                 keepAlive: false,
                 allowBack: false
             }
         }, */
        {
            path: '/contact_service',
            name: 'contact',
            component: resolve => require(['@/components/contact'], resolve),
            meta: {
                title: '成都IFS·我的客服',
                keepAlive: false
            }
        },
        {
            path: '/artical_contact1',
            name: 'artical_contact1',
            component: resolve => require(['@/components/artical_contact1'], resolve),
            meta: {
                title: '成都IFS·VIP权益',
                keepAlive: false
            }
        },
        {
            path: '/artical_contact2',
            name: 'artical_contact2',
            component: resolve => require(['@/components/artical_contact2'], resolve),
            meta: {
                title: '成都IFS·服务设施',
                keepAlive: false
            }
        },
        {
            path: '/artical_contact3',
            name: 'artical_contact3',
            component: resolve => require(['@/components/artical_contact3'], resolve),
            meta: {
                title: '成都IFS·品牌导览',
                keepAlive: false
            }
        },
        {
            path: '/artical_contact4',
            name: 'artical_contact4',
            component: resolve => require(['@/components/artical_contact4'], resolve),
            meta: {
                title: '成都IFS·售后服务',
                keepAlive: false
            }
        },
        {
            path: '/mc/present',
            name: 'present',
            component: resolve => require(['@/components/present'], resolve),
            meta: {
                title: '成都IFS·券领取',
                keepAlive: false
            }
        },
        //测试数据
        {
            path: '/park_quan2',
            name: 'park_quan2',
            component: resolve => require(['@/components/park_quan2'], resolve),
            meta: {
                title: '成都IFS·自助兑换停车券',
                keepAlive: false
            }
        }, {
            path: '/shoplist_coupons2',
            name: 'shoplist_coupons2',
            component: resolve => require(['@/components/public/shoplist_coupons2'], resolve),
            meta: {
                title: '成都IFS·消费换券',
                keepAlive: false
            }
        }
        //测试数据
    ]
})
