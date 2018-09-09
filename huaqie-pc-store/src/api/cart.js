import { get, set, remove } from './common'
import { Message } from 'element-ui'
// import Vue from 'vue'
import router from '@/router/index'

class Cart {
	constructor() {
		this.orderList = get('orderCart')?get('orderCart'):[];
		this.cartList = get('shoppingCart')?get('shoppingCart'): [];
	};
	getCart() {
		// console.log('run ', this.cartList);
		return this.cartList;
	};
	cartClear() {
		let cart = JSON.parse(JSON.stringify(this.cartList))
		this.orderList.forEach((child, key) => {
			cart.forEach((item, index) => {
				if(item.productId == child.productId && item.specs == child.specs) {
					// console.log(index, key);
					cart.splice(index, 1);		
				}
			})
		});
		this.cartList = JSON.parse(JSON.stringify(cart))
		set('shoppingCart', this.cartList);	
		// remove('orderCart');
	};
	resetCart(productList) {
		set('shoppingCart', productList);
	};
	initCount(data) {
	  data.forEach((e) => {
	    let exist = false
	    this.cartList.forEach(c => {
	      if (c.productId == e.productId) {
	        e.count = c.count
	        exist = true
	      }
	    })
	    if (!exist)
	      e.count = 0
	  })
	  return data
	};
	addToCart(product) {
  		// let exist = false;
  		let exist = false;
  		let cart = JSON.parse(JSON.stringify(this.cartList))
	    if(cart.length > 0 && cart) {
    	    cart.forEach(c => {
    		    if (c.productId == product.productId && c.specs == product.selectSpecs) {
    		    	if(c.count < c.stock) {
    		    		c.count += 1;
    		    	}
    		    	if(c.count == c.stock) {
    		    		c.disPlus = true
    		    	}
    		        // console.log('addToCart:', product.basic.title, c.count);
    		        exist = true;
    		    }
    	    })
	    }
	    // console.log("cart", cart);
  		// console.log('product', product)
	    if (!exist) {
		    cart.push({
		      productId: product.productId,
		      avatar: product.basic.avatar,
		      stock: product.basic.stock,
		      title: product.basic.title,
		      prices: product.basic.prices,
		      price: product.basic.prices[0].price,
		      specs: product.selectSpecs||product.basic.specs[0],
		      disPlus: false,
		      disMinus: false,
		      exist: false,
		      count: 1
		    })
	    }
	    this.cartList = JSON.parse(JSON.stringify(cart))
  		set('shoppingCart', this.cartList)
	};
	changeCount(product) {
		this.cartList.forEach(item => {
			if(item.productId === product.productId && item.specs == product.specs) {
				if(item.count == 0) {
					this.removeCart(item);
				}
				item.count = product.count;
			}
		});
		set('shoppingCart', this.cartList);
	};
	removeCart(product = null) {
		// console.log(product);
		if(!product) {
			this.cartList = [];
		} else {
			let cart = JSON.parse(JSON.stringify(this.cartList))
			this.cartList.forEach((item, index) => {
				console.log(item.specs == product.specs && item.productId === product.productId);
				if(item.specs == product.specs && item.productId === product.productId) {
					this.cartList.splice(index, 1);
					// console.log(cart);
					// this.cartList = JSON.parse(JSON.stringify(cart))
					set('shoppingCart', this.cartList);
					return;
				}
			})
			// console.log(cart);
			// this.cartList = JSON.parse(JSON.stringify(cart))
			// set('shoppingCart', this.cartList);
		}	
	};
	order(pro) {
		// console.log(pro);
		let ok = [];
		pro.forEach(item => {
			if(item.count <= item.stock && item.count > 0) {
				ok.push('success')
			} else {
				ok.push('fail')
			}
		})
		if(ok.indexOf('fail') >= 0) {
			Message.error({
				message: 'Có nhiều hơn số lượng hàng hoá hoặc không phù hợp với các quy tắc'
			})
			return;
		} else {
			set('orderCart', pro);
			// console.log(router);
			router.push('/checkout');
		}	
	};
	getOrder() {
		return this.orderList;
	}
}

const cart = new Cart;

export default cart