import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './shop/actions';
import * as getters from './shop/getters';
import products from './shop/modules/products';
import profile from './shop/modules/profile';
import promotions from './shop/modules/promotions';
import cart from './shop/modules/cart';
import product from './shop/modules/product';
import home from './shop/modules/home';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';


export default new Vuex.Store({
  actions,
  getters,
  modules: {
    home,
  	product,
    products,
    profile,
    promotions,
    cart,
  },
  strict: debug,
});
