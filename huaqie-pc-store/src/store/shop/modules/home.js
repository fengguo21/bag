const state = {
	tags: [],
	change: false,
}

const getters = {
	tags: state => state.tags,
	change: state => state.change
}

const actions = {
	getTag({commit, state}, tag) {
		commit('GET_TAGS', tag)
	},
	reGet({commit, state}, change) {
		commit('REGET', change)
	}
}

const mutations = {
	GET_TAGS(state, tag) {
		// console.log(tag);
		state.tags = tag;
	},
	REGET(state, change) {
		state.change = change;
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}