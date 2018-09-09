import axios from 'axios';
import session from 'store'

const base = 'https://g2.huaqie.com';

const get = (cmd, params) => {
	params.sessionId = session.get('sessionId');
	params.appId = (params.appId)?params.appId:((session.get('app'))?session.get('app').appId:'');
	return axios.get(cmd, { params: params }).then(res => res.data )
}
const post = (cmd, params) => {
	params.sessionId = session.get('sessionId');
	params.appId = (params.appId)?params.appId:((session.get('app'))?session.get('app').appId:'');
	return axios.post(cmd, params).then(res => res.data )
}
// 图片上传路径
export const avatarUrl = "https://g2.huaqie.com/cloud/app/upload";

export const getApp = params => { return get(`${base}/cloud/app/findById`, params) }
export const editAppWepayFacilitator = params => { return post(`${base}/cloud/app/setupWepayFacilitator`, params) }


export const getSessionId = params => { return get(`${base}/cloud/account/sessionId`, params) }

export const requestLogin = params => { return post(`${base}/cloud/account/signInByPhone`, params) };
export const requestResetPassword = params => { return post(`${base}/cloud/account/resetPassword`, params) };
export const sendCode = params => { return post(`${base}/cloud/account/sendCode`, params) }

export const editPassword = params => { return post(`${base}/cloud/account/updatePassword`, params) }

export const getMasterApp = params => { return get(`${base}/storeMaster/people/findApp`, params) }

export const getMasterMenu = params => { return get(`${base}/cloud/app/findAllMenuByAppId`, params) }

export const createEntity = params => { return post(`${base}/storeMaster/entity/create`, params) }

export const updateEntity = params => { return post(`${base}/storeMaster/entity/update`, params) }

export const removeEntity = params => { return post(`${base}/storeMaster/entity/remove`, params) }

export const getEntityByState = params => { return get(`${base}/storeMaster/entity/findByState`, params) }

export const getUserList = params => { return axios.get(`${base}/user/list`, params); };
export const superGetPeopleListPage = params => { return get(`${base}/cloud/people/superFindByState`,params); };
export const getPeopleListPage = params => { return get(`${base}/cloud/people/findByState`,params); };
export const updatePeople = params => { return post(`${base}/cloud/people/update`,params); };
export const updateRole = params => { return post(`${base}/cloud/people/updateRole`, params); };
export const addAccount = params => { return post(`${base}/cloud/account/signUpByPhone`, params); };

export const getAppListPage = params => { return get(`${base}/cloud/app/superFindByState`,params); };
export const getAppList = params => { return get(`${base}/cloud/app/findByState`,params); };
export const addApp = params => { return post(`${base}/cloud/app/create`, params); };
export const editApp = params => { return post(`${base}/cloud/app/update`, params); };
export const addMenu = params => { return post(`${base}/cloud/app/createMenu`, params); };

export const setSalesAbout = params => { return post(`${base}/cloud/app/setSalesAbout`, params); };
export const getSalesAbout = params => { return get(`${base}/cloud/app/getSalesAbout`, params); };

export const getTagListPage = params => { return get(`${base}/cloud/product/findTagByState`,params); };
export const addTag = params => { return post(`${base}/cloud/product/createTag`, params); };

export const getCatalogListPage = params => { return get(`${base}/cloud/product/findCatalogByState`,params); };

export const addCatalog = params => { return post(`${base}/cloud/product/createCatalog`, params); };

export const getFaceListPage = params => { return get(`${base}/cloud/face/findByState`,params); };
export const countFace = params => { return get(`${base}/cloud/face/count`,params); };
export const addFace = params => { return post(`${base}/cloud/face/create`, params); };
export const addFaceBatch = params => { return post(`${base}/cloud/face/createBatch`, params); };
export const editFace = params => { return post(`${base}/cloud/face/update`, params); };
export const removeFace = params => { return post(`${base}/cloud/face/remove`, params); };
export const getFaceGroupListPage = params => { return get(`${base}/cloud/face/findGroupByState`,params); };
export const updateFaceGroup = params => { return post(`${base}/cloud/face/updateGroup`, params) }
export const removeFaceGroup = params => { return post(`${base}/cloud/face/removeGroup`, params) }
export const addFaceActivity = params => { return post(`${base}/cloud/face/createActivity`, params) }
export const editFaceActivity = params => { return post(`${base}/cloud/face/updateActivity`, params) }
export const removeFaceActivity = params => { return post(`${base}/cloud/face/removeActivity`, params) }
export const getFaceActivityListPage = params => { return get(`${base}/cloud/face/findActivityByState`,params); };
export const getFaceActivity = params => { return get(`${base}/cloud/face/findActivityById`,params); };
export const findActivityQrcode = params => { return get(`${base}/cloud/face/findActivityQrcode`,params); };

export const addFaceCity = params => { return post(`${base}/cloud/face/createCity`, params); };
export const editFaceCity = params => { return post(`${base}/cloud/face/updateCity`, params); };
export const removeFaceCity = params => { return post(`${base}/cloud/face/removeCity`, params); };
export const getFaceCityListPage = params => { return get(`${base}/cloud/face/findCityByState`,params); };
export const addFaceTag = params => { return post(`${base}/cloud/face/createTag`, params); };
export const updateFaceTag = params => { return post(`${base}/cloud/face/updateTag`, params); };
export const removeFaceTag = params => { return post(`${base}/cloud/face/removeTag`, params); };
export const getFaceTagListPage = params => { return get(`${base}/cloud/face/findTagByState`,params); };

export const getProductListPage = params => { return get(`${base}/cloud/product/findByState`,params); };
export const getProduct = params => { return get(`${base}/cloud/product/findById`,params); };
export const getProductVipPage = params => { return get(`${base}/cloud/product/findPeopleByState`,params); }
export const addProduct = params => { return post(`${base}/cloud/product/create`, params); };
export const updateProduct = params => { return post(`${base}/cloud/product/update`, params); };
export const removeProduct = params => { return post(`${base}/cloud/product/remove`, params); };
export const addProductMember = params => { return post(`${base}/cloud/product/addPeople`,params); };
export const updateTag = params => { return post(`${base}/cloud/product/updateTag`, params) }
export const updateCatalog = params => { return post(`${base}/cloud/product/updateCatalog`, params); };
export const removeTag = params => { return post(`${base}/cloud/product/removeTag`, params); };
export const removeCatalog = params => { return post(`${base}/cloud/product/removeCatalog`, params); };

export const addProductFee = params => { return post(`${base}/cloud/product/createFee`, params); };
export const updateProductFee = params => { return post(`${base}/cloud/product/updateFee`, params); };
export const removeProductFee = params => { return post(`${base}/cloud/product/removeFee`, params); };
export const getProductFeeListPage = params => { return get(`${base}/cloud/product/findFeeByState`,params); };

export const getOrderListPage = params => { return get(`${base}/cloud/order/findByState`,params); };
export const getOrderById = params => { return get(`${base}/cloud/order/findById`,params); };
export const cancelOrder = params => { return post(`${base}/cloud/order/cancel`,params); };

export const getAdvertiseListPage = params => { return get(`${base}/cloud/advertise/findByState`,params); };
export const addAdvertise = params => { return post(`${base}/cloud/advertise/create`,params); };
export const updateAdvertise = params => { return post(`${base}/cloud/advertise/update`,params); };
export const removeAdvertise = params => { return post(`${base}/cloud/advertise/remove`,params); };

export const getCouponListPage = params => { return get(`${base}/cloud/coupon/findByState`,params); };
export const addCoupon = params => { return post(`${base}/cloud/coupon/create`, params); };
export const removeCoupon = params => { return post(`${base}/cloud/coupon/remove`, params); };
export const updateCoupon = params => { return post(`${base}/cloud/coupon/update`, params); };
export const getCouponRecordListPage = params => { return get(`${base}/cloud/coupon/findRecordByState`,params); };
export const getCardListPage = params => { return get(`${base}/cloud/card/findByState`,params); };
export const getCardRecordListPage = params => { return get(`${base}/cloud/card/findRecordByState`,params); };
export const addCard = params => { return post(`${base}/cloud/card/create`, params); };
export const updateCard = params => { return post(`${base}/cloud/card/update`, params); };
export const removeCard = params => { return post(`${base}/cloud/card/remove`, params); };
export const removeSales = params => { return post(`${base}/cloud/sales/remove`, params); };
export const getSalesListPage = params => { return get(`${base}/cloud/sales/findByState`,params); };
export const removeFeedback = params => { return post(`${base}/cloud/app/removeFeedback`,params); };
export const getFeedbackListPage = params => { return get(`${base}/cloud/app/findFeedbackByState`,params); };

export const shipment = params => { return post(`${base}/cloud/order/shipment`, params); };
export const orderReject = params => { return post(`${base}/cloud/order/reject`, params); };
export const orderRefund = params => { return post(`${base}/cloud/order/refund`, params); };

export const getAnalyticsBrief = params => { return get(`${base}/cloud/analytics/findBriefByAppId`,params); };
export const getAnalyticsSeries = params => { return get(`${base}/cloud/analytics/findSeriesByAppId`,params); };
// 查看个人余额
export const getPeopleBalance = params => { return get(`${base}/cloud/bank/findByPeopleId`,params) }
// 资金概览
export const getBankBrief = params => { return get(`${base}/cloud/bank/findBriefByAppId`,params); };
// 设置提现手续费
export const setWithdrawFee = params => { return post(`${base}/cloud/bank/setWithdrawFee`,params) };
export const getWithdrawFee = params => { return get(`${base}/cloud/bank/findWithdrawFeeByPeopleId`,params) }
export const reportTransaction = params => { return get(`${base}/cloud/bank/reportTransactionByState`,params); };
// 获取资金交易明细
export const getTransactionListPage = params => { return get(`${base}/cloud/bank/findTransactionByState`,params); };
export const getDayTransactionListPage = params => { return get(`${base}/cloud/bank/findDayTransactionByState`,params); };
export const getPeopleTransactionListPage = params => { return get(`${base}/cloud/bank/findPeopleTransactionByState`,params); };
// 获取提现记录
export const getWithdrawList = params => { return get(`${base}/cloud/bank/findWithdrawByState`,params) };
// 审核提现
export const setWithdrawApprove = params => { return post(`${base}/cloud/bank/withdrawApprove`,params) };
// mmd提现审核
export const setWithdrawApproveMMD = params => { return post(`${base}/cloud/bank/peopleWithdrawApprove`,params) };
// 申请提现
export const setWithdraw = params => { return post(`${base}/cloud/bank/withdraw`,params) }
// 支付宝条码支付
export const alipayMicroPay = params => { return post(`${base}/cloud/payment/alipayMicroPay`,params) }
// 支付宝扫码支付
export const alipayQRPay = params => { return post(`${base}/cloud/payment/alipayQRPay`,params) }
// 微信条码支付
export const wechatMicroPay = params => { return post(`${base}/cloud/payment/wechatMicroPay`,params) }
// 微信扫码支付
export const wechatNativePay = params => { return post(`${base}/cloud/payment/wechatNativePay`,params) }
// 日\周\月 收入统计
export const dayTransaction = params => { return get(`${base}/cloud/bank/findDayTransactionByState`,params) }
export const weekTransaction = params => { return get(`${base}/cloud/bank/findWeekTransactionByState`,params) }
export const monthTransaction = params => { return get(`${base}/cloud/bank/findMonthTransactionByState`,params) }
// 确认线下支付
export const offlinePayVerify = params => { return post(`${base}/cloud/payment/offlinePayVerify`,params) }
// 设置银行卡
export const setupBank = params => { return post(`${base}/cloud/bank/setupBank`,params) }
// 获取银行卡信息
export const getBank = params => { return get(`${base}/cloud/bank/findBankByPeopleId`,params) }
/***************************zbcdz*********************************/
export const getDevSortList = params => { return get(`${base}/cloud/batteryCharge/findSortByState`,params)}
export const getAgentSortList = params => { return get(`${base}/cloud/agent/findSortByState`,params)}

export const getDevList = params => { return get(`${base}/cloud/batteryCharge/findByState`,params)}
export const createNewDev = params => { return post(`${base}/cloud/batteryCharge/create`,params)}
export const createNewDevBatch = params => { return post(`${base}/cloud/batteryCharge/createBatch`,params)}
export const updateDev = params => { return post(`${base}/cloud/batteryCharge/update`,params)}
export const removeDev = params => { return post(`${base}/cloud/batteryCharge/remove`,params)}
export const wxPaySet = params => { return post(`${base}/cloud/app/setupWeWap`,params) }
export const wxAppPaySet = params => { return post(`${base}/cloud/app/setupWeApp`,params) }
export const aliPaySet = params => { return post(`${base}/cloud/app/setupAlipay`,params) }
export const chargeSet = params => { return post(`${base}/cloud/app/setupBatteryCharge`,params) }
export const getAgentList = params => { return get(`${base}/cloud/agent/findByState`,params) }
export const getCurrentAgent = params => { return get(`${base}/cloud/agent/findByPeopleId`,params) }
export const getAgentListById = params => { return get(`${base}/cloud/agent/findById`,params) }
export const createAgent = params => { return post(`${base}/cloud/agent/create`,params) }
export const updateAgent = params => { return post(`${base}/cloud/agent/update`,params) }
export const removeAgent = params => { return post(`${base}/cloud/agent/remove`,params) }
export const setAgent = params => { return post(`${base}/cloud/batteryCharge/setAgent`,params) }
export const getAgentBalance = params => { return get(`${base}/cloud/bank/findAgentBalanceByPeopleId`,params) }
export const getBatteryCharge = params => { return get(`${base}/cloud/batteryCharge/findChargeByState`,params) }
export const reportCharge = params => { return get(`${base}/cloud/batteryCharge/reportCharge`,params) }
export const setAgentBatch = params => { return post(`${base}/cloud/batteryCharge/setAgentBatch`,params) }
export const removeBatteryChargeFeedback = params => { return post(`${base}/cloud/batteryCharge/removeFeedback`,params); };
export const getBatteryChargeFeedbackListPage = params => { return get(`${base}/cloud/batteryCharge/findFeedbackByState`,params); };
export const queryPort = params => { return get(`${base}/cloud/batteryCharge/queryUsablePort`,params) }
/*********************/

/**********XKS***********/
export const getAllBranch = params => { return get(`${base}/cloud/branch/findByState`,params) }
export const createBranch = params => { return post(`${base}/cloud/branch/create`,params) }
export const updateBranch = params => { return post(`${base}/cloud/branch/update`,params) }
export const removeBranch = params => { return post(`${base}/cloud/branch/remove`,params) }
export const createService = params => { return post(`${base}/cloud/order/createService`,params) }
export const getAllRole = params => { return get(`${base}/cloud/people/findRoleByState`,params) }
export const superCreateRole = params => { return post(`${base}/cloud/people/superCreateRole`,params) }
export const createUserByCustomId = params => { return post(`${base}/cloud/people/createUserByCustomId`,params) }
export const removePeople = params => { return post(`${base}/cloud/people/remove`,params) }
export const createRole = params => { return post(`${base}/cloud/people/createRole`,params) }
export const cancelRole = params => { return post(`${base}/cloud/people/cancelRole`,params) }
export const createPrinter = params => { return post(`${base}/cloud/printer/create`,params) }
export const updatePrinter = params => { return post(`${base}/cloud/printer/update`,params) }
export const removePrinter = params => { return post(`${base}/cloud/printer/remove`,params) }
export const getAllPrinter = params => { return get(`${base}/cloud/printer/findByState`,params) }

/*********************/

/**********QRCODE REFEREE***********/
export const getAllAudience = params => { return get(`${base}/cloud/app/findAudienceByState`,params) }
export const getAudienceReport = params => { return get(`${base}/cloud/app/findAudienceReport`,params) }
export const getAuthorize = params => { return get(`${base}/cloud/app/findAuthorizeById`,params) }
export const getAudienceCount = params => { return get(`${base}/cloud/app/findAudienceCount`,params) }
/*********************/

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const setupAbout = params => { return post(`${base}/storeMaster/app/setupAbout`, params) }

/************* vip *********************/ 
export const createRank = params => { return post(`${base}/cloud/people/createRank`, params) }
export const updateRank = params => { return post(`${base}/cloud/people/updateRank`, params) }
export const removeRank = params => { return post(`${base}/cloud/people/removeRank`, params) }
export const getRank = params => { return get(`${base}/cloud/people/findRankByState`, params) }

/**************用户相关操作*********************/ 
export const changeRank = params => { return post(`${base}/cloud/people/update`, params) }


/*******************获取所有代理商********************/ 
export const getAllAgent = params => { return get(`${base}/cloud/agent/findAllByState`, params) }
/*******************获取指定代理商********************/  
export const getAgentById = params => { return get(`${base}/cloud/agent/findByPeopleId`, params) }
/********************获取职业列表*********************/ 
export const getJobList = params => { return get(`${base}/cloud/product/findTagByState`, params) }

/********************     bixy   *********************/  
/**news**/
export const createNews = params => { return post(`${base}/cloud/feed/createNews`, params) }
export const updateNews = params => { return post(`${base}/cloud/feed/updateNews`, params) }
export const removeNews = params => { return post(`${base}/cloud/feed/removeNews`, params) }

export const getNewsList = params => { return get(`${base}/cloud/feed/findNewsByState`, params) }
export const getNewsById = params => { return get(`${base}/cloud/feed/findNewsById`, params) }

/**FAQ**/ 
export const setupFaq = params => { return post(`${base}/cloud/feed/setupFaq`, params) }
export const getFaq = params => { return get(`${base}/cloud/feed/findFaqByAppId`, params) }

/********************     婚纱摄影   *********************/
export const addHssyCase = params => { return post(`${base}/cloud/hssy/createCase`, params) }
export const editHssyCase = params => { return post(`${base}/cloud/hssy/updateCase`, params) }
export const removeHssyCase = params => { return post(`${base}/cloud/hssy/removeCase`, params) }
export const getHssyCaseList = params => { return get(`${base}/cloud/hssy/findCaseByState`, params) }
export const getHssyCase = params => { return get(`${base}/cloud/hssy/findCaseById`, params) }
export const addHssyCatalog = params => { return post(`${base}/cloud/hssy/createCatalog`, params) }
export const editHssyCatalog = params => { return post(`${base}/cloud/hssy/updateCatalog`, params) }
export const removeHssyCatalog = params => { return post(`${base}/cloud/hssy/removeCatalog`, params) }
export const getHssyCatalogList = params => { return get(`${base}/cloud/hssy/findCatalogByState`, params) }
export const getHssyCatalog = params => { return get(`${base}/cloud/hssy/findCatalogById`, params) }
export const addHssyAlbum = params => { return post(`${base}/cloud/hssy/createAlbum`, params) }
export const editHssyAlbum = params => { return post(`${base}/cloud/hssy/updateAlbum`, params) }
export const removeHssyAlbum = params => { return post(`${base}/cloud/hssy/removeAlbum`, params) }
export const getHssyAlbumList = params => { return get(`${base}/cloud/hssy/findAlbumByState`, params) }
export const getHssyAlbum = params => { return get(`${base}/cloud/hssy/findAlbumById`, params) }


/********************     中铁物流   *********************/
export const addZtwlKuaidi = params => { return post(`${base}/cloud/ztwl/createKuaidi`, params) }
export const editZtwlKuaidi = params => { return post(`${base}/cloud/ztwl/updateKuaidi`, params) }
export const removeZtwlKuaidi = params => { return post(`${base}/cloud/ztwl/removeKuaidi`, params) }
export const getZtwlKuaidiList = params => { return get(`${base}/cloud/ztwl/findKuaidiByState`, params) }
export const getZtwlKuaidi = params => { return get(`${base}/cloud/ztwl/findKuaidiById`, params) }

export const addZtwlHuoyun = params => { return post(`${base}/cloud/ztwl/createHuoyun`, params) }
export const editZtwlHuoyun = params => { return post(`${base}/cloud/ztwl/updateHuoyun`, params) }
export const removeZtwlHuoyun = params => { return post(`${base}/cloud/ztwl/removeHuoyun`, params) }
export const getZtwlHuoyunList = params => { return get(`${base}/cloud/ztwl/findHuoyunByState`, params) }
export const getZtwlHuoyun = params => { return get(`${base}/cloud/ztwl/findHuoyunById`, params) }
export const ztwlBatchShip = params => { return post(`${base}/cloud/ztwl/batchShip`, params) }

/************* 爱英语 *********************/ 
export const createCourse = params => { return post(`${base}/cloud/product/createCourse`, params) }
export const updateCourse = params => { return post(`${base}/cloud/product/updateCourse`, params) }
export const getReadingList = params => { return get(`${base}/cloud/ienglish/findCourseByState`, params) }
export const createArticle = params => { return post(`${base}/cloud/ienglish/createArticle`, params) }
export const updateArticle = params => { return post(`${base}/cloud/ienglish/updateArticle`, params) }
export const removeArticle = params => { return post(`${base}/cloud/ienglish/removeArticle`, params) }
export const getArticleList = params => { return get(`${base}/cloud/ienglish/findArticleByState`, params) }
export const getArticle = params => { return get(`${base}/cloud/ienglish/findArticleById`, params) }
export const getCourse = params => { return get(`${base}/cloud/ienglish/findCourseById`, params) }
export const iEnglishUpdateCourse = params => { return post(`${base}/cloud/ienglish/updateCourse`, params) }
export const iEnglishGetCommentList = params => { return get(`${base}/cloud/ienglish/findCommentByState`, params) }

/********************   易运动   *********************/
export const yydRemoveFeedback = params => { return post(`${base}/cloud/yyd/removeFeedback`, params) }
export const yydFindFeedbackByState = params => { return get(`${base}/cloud/yyd/findFeedbackByState`, params) }
export const yydFindFeedbackById = params => { return get(`${base}/cloud/yyd/findFeedbackById`, params) }
export const yydFindPeopleByState = params => { return get(`${base}/cloud/yyd/findPeopleByState`, params) }
export const yydVerifyVerify = params => { return post(`${base}/cloud/yyd/verifyVerify`, params) }
export const yydCreateEquipment = params => { return post(`${base}/cloud/yyd/createEquipment`, params) }
export const yydUpdateEquipment = params => { return post(`${base}/cloud/yyd/updateEquipment`, params) }
export const yydRemoveEquipment = params => { return post(`${base}/cloud/yyd/removeEquipment`, params) }
export const yydFindEquipmentByState = params => { return get(`${base}/cloud/yyd/findEquipmentByState`, params) }
export const yydFindEquipmentById = params => { return get(`${base}/cloud/yyd/findEquipmentById`, params) }
export const yydCreateBox = params => { return post(`${base}/cloud/yyd/createBox`, params) }
export const yydUpdateBox = params => { return post(`${base}/cloud/yyd/updateBox`, params) }
export const yydRemoveBox = params => { return post(`${base}/cloud/yyd/removeBox`, params) }
export const yydFindBoxByState = params => { return get(`${base}/cloud/yyd/findBoxByState`, params) }
export const yydFindBoxById = params => { return get(`${base}/cloud/yyd/findBoxById`, params) }
export const yydFindWithdrawDepositByState = params => { return get(`${base}/cloud/yyd/findWithdrawDepositByState`, params) }
export const yydWithdrawDepositVerify = params => { return post(`${base}/cloud/yyd/withdrawDepositVerify`, params) }
export const yydFindBorrowRestoreByState = params => { return get(`${base}/cloud/yyd/findBorrowRestoreByState`, params) }
export const yydVerifyFeedback = params => { return post(`${base}/cloud/yyd/verifyFeedback`, params) }
export const yydFindEquipmentByDeviceCode = params => { return get(`${base}/cloud/yyd/findEquipmentByDeviceCode`, params) }

/********************   读书会   *********************/
export const dshCreateCatalog = params => { return post(`${base}/cloud/dsh/createCatalog`, params) }
export const dshUpdateCatalog = params => { return post(`${base}/cloud/dsh/updateCatalog`, params) }
export const dshRemoveCatalog = params => { return post(`${base}/cloud/dsh/removeCatalog`, params) }
export const dshFindCatalogByState = params => { return get(`${base}/cloud/dsh/findCatalogByState`, params) }
export const dshCreateBook = params => { return post(`${base}/cloud/dsh/createBook`, params) }
export const dshUpdateBook = params => { return post(`${base}/cloud/dsh/updateBook`, params) }
export const dshRemoveBook = params => { return post(`${base}/cloud/dsh/removeBook`, params) }
export const dshFindBookByState = params => { return get(`${base}/cloud/dsh/findBookByState`, params) }
export const dshFindBookById = params => { return get(`${base}/cloud/dsh/findBookById`, params) }
export const dshUpdateComment = params => { return post(`${base}/cloud/dsh/updateComment`, params) }
export const dshRemoveComment = params => { return post(`${base}/cloud/dsh/removeComment`, params) }
export const dshFindCommentByState = params => { return get(`${base}/cloud/dsh/findCommentByState`, params) }
export const dshCreateAgent = params => { return post(`${base}/cloud/dsh/createAgent`, params) }
export const dshUpdateAgent = params => { return post(`${base}/cloud/dsh/updateAgent`, params) }
export const dshRemoveAgent = params => { return post(`${base}/cloud/dsh/removeAgent`, params) }
export const dshFindAgentByState = params => { return get(`${base}/cloud/dsh/findAgentByState`, params) }
export const dshFindAgentTransforByState = params => { return get(`${base}/cloud/dsh/findAgentTransforByState`, params) }
export const dshFindAgentById = params => { return get(`${base}/cloud/dsh/findAgentById`, params) }
export const dshFindPeopleByState = params => { return get(`${base}/cloud/dsh/findPeopleByState`, params) }