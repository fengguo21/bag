import axios from 'axios'
import session from 'store'

const base = 'https://g2.huaqie.com/cloud';
const APP_ID = '595eea9b2132c07f55d217c9';
const get = (cmd, params) => {
	params.sessionId = session.get('sessionId');
	params.appId = APP_ID;
	return axios.get(cmd, { params: params }).then(res => res.data )
}
const post = (cmd, params) => {
	params.sessionId = session.get('sessionId');
	params.appId = APP_ID;
	return axios.post(cmd, params).then(res => res.data )
}
// 图片上传路径
export const avaterUrl = "https://g2.huaqie.com/cloud/app/upload";

export const getSessionId = params => { return get(`${base}/account/sessionId`, params) }
export const getProductList = params => { return get(`${base}/product/frontFindByState`, params) }
export const getTagList = params => { return get(`${base}/product/findTagByState`, params) }
export const getApp = params => { return get(`${base}/app/findById`, params) }
export const signUp = params => { return post(`${base}/account/frontSignUpByEmail`, params) }
export const signIn = params => { return post(`${base}/account/frontSignInByEmail`, params) }
export const createOffline = params => { return post(`${base}/order/createOffline`, params) }
export const offlinePay = params => { return post(`${base}/payment/offlinePay`, params) }
export const getOrderList = params => { return get(`${base}/order/frontFindByState`, params) }
export const collectOrder = params => { return post(`${base}/order/confirm`, params) }

export const getFaq = params => { return get(`${base}/feed/findFaqByAppId`, params) }
export const getNewsList = params => { return get(`${base}/feed/findNewsByState`, params) }
export const getNewsById = params => { return get(`${base}/feed/findNewsById`, params) }

export const updateUser = params => { return post(`${base}/people/update`, params) }
