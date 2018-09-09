import axios from 'axios';
// import * as store from '../common/localStore';
// import { wxLogin } from '@/common/initConfig'
import store from '@/vuex/store'
//正式地址域名
var devhost = "wechat.cdifs.cn" //正式地址
var host = document.domain
var dataurl
var base
var dataSourceCode
if (host == devhost) { //上线后配置
    dataSourceCode = 'DATA_000006'
    dataurl = 'https://wechatapp.cdifs.cn' //python后台
    base = 'https://wechatapp.cdifs.cn/saas-api/api/portal/custom' //sass地址
} else { //测试环境
    dataSourceCode = 'DATA_000017'
    dataurl = 'https://happy.andoner.cn' //python后台
    base = 'http://wechatapp.cdifs.cn/saas-api/api/portal/custom' //sass地址
}
var get = (cmd, params) => {
    params.dataSourceCode = dataSourceCode
    return axios.get(cmd, { params: params }).then(res => {
        if (res.data.code == 10001) {
            store.remove('logined');
            wxLogin();
            return;
        }
        return res.data;
    })
}
var post = (cmd, params) => {
        params.dataSourceCode = dataSourceCode
        return axios.post(cmd, params).then(res => {
            if (res.data.code == 10001) {
                store.remove('logined');
                wxLogin();
                return;
            }
            return res.data;
        })
    }
    // 获取最新活动
    /* export var getDatas = params => { return get(`${base}`, params) }
    export var getMyGifts = params => { return get(dataurl + `/wechat/ifs/member/exchist/` + store.state.id, params) }
    export var getScoreDetail = params => { return get(dataurl + `/wechat/ifs/member/pointhist/` + store.state.id, params) }
    export var exchangeGift = params => { return get(dataurl + `/wechat/ifs/member/exchange/` + store.state.id, params) }
    export var signIn = params => { return post(`${base}/account/signInByWeWap`, params) } */
export var getDatas = params => { return get(base, params) }
export var getMyGifts = params => { return get(dataurl + '/wechat/ifs/member/exchist/' + store.state.id, params) }
export var getScoreDetail = params => { return get(dataurl + '/wechat/ifs/member/pointhist/' + store.state.id, params) }
export var exchangeGift = params => { return get(dataurl + '/wechat/ifs/member/exchange/' + store.state.id, params) }
export var signIn = params => { return post(base + '/account/signInByWeWap', params) }