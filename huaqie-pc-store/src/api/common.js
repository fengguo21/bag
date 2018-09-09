import store from 'store'
const APP_ID = '595eea9b2132c07f55d217c9';
export const get = (key) => {
	return store.get(APP_ID+"-"+key)
}
export const set = ( key, value ) => {
  store.set(APP_ID+'-'+key, value)
}
export const remove = (key) => {
  store.remove(APP_ID+'-'+key)	
}