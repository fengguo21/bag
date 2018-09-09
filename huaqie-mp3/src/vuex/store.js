import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    count: 10,
    goodsID: '',
    addLevelFormVisible: false,
    level: [],
    reWithdraw: false
}

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
// mmd后台管理
    // 查看会员->缓存商品ID
    VIPQUERY(state, data) {
        state.goodsID = data
    },
    // 商品管理->添加商品->弹窗状态改变
    CHANGELEVEL(state, data) {
        state.addLevelFormVisible = data
    },
    // 商品管理->添加商品->使用会员商品->初始化table
    INITLEVEL(state) {
        state.level = [];
    },
    // 商品管理->添加商品->使用会员商品->添加功能
    ADDNEWLEVEL(state, data) {
        state.level.push(data)   
    },
    // 商品管理->添加商品->使用会员商品->删除功能
    DELLEVEL(state, data) {
        let index = state.level.indexOf(data);
        state.level.splice(index, 1);
    },
    // 提交订单后缓存数据
    REGETWITHDRAWLIST(state, data) {
        state.reWithdraw = data
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})