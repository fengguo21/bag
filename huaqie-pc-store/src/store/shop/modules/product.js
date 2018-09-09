const state = {
  nowPro: null
};

const getters = {
  nowPro: state => state.nowPro,
};

const actions = {
  nowProduct({ commit, state }, product) {
  	commit('NOW_PRO', product)
  }
};

const mutations = {
	NOW_PRO(state, data) {
		state.nowPro = data;
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}