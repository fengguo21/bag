//actions
export const increment = ({commit}) => {
    commit('INCREMENT')
}
export const decrement = ({commit}) => {
    commit('DECREMENT')
}
export const queryVips = ({commit}, data) => {
    commit('VIPQUERY', data)
}
export const changeLevel = ({commit}, data) => {
	commit('CHANGELEVEL', data)
}
export const addLevel = ({commit}, data) => {
	commit('ADDNEWLEVEL', data)
}
export const delLevel = ({commit}, data) => {
	commit('DELLEVEL', data)
}
export const initLevel = ({commit}) => {
	commit('INITLEVEL')
}
export const resetWithdraw = ({commit}, data) => {
	// console.log(data);
	commit('REGETWITHDRAWLIST', data)
}
