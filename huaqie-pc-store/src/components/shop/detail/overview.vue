<template>
	<div id="right_product_detail" align="left">
		<div style="float:left; width: 100%;">
			<div style="color:#006ba3; font-size:16px; font-weight:600;">
				{{name}}
			</div>
			<!-- <div style="color:#FF4949; font-size:16px; font-weight:600; margin-top: 10px">
				price：{{pro.basic.prices[0].price}}
			</div> -->
			<p v-for='(item, index) in pro.basic.prices' style='font-size: 16px'>
				<span class='item-title'>{{pro.basic.prices[index-1]?item.count == -1?'>='+pro.basic.prices[index-1].count:pro.basic.prices[index-1].count+'~'+item.count:'<'+item.count}} Chiếc</span>
				<span class='item-content' style='color: #FF4949; font-weight:600'>{{'giá bán: '+ format_number(item.price)}} VND</span>
			</p>
			<p>
				<span class='item-title'>Cổ phần</span>
				<span class='item-content'>{{format_number(pro.basic.stock)}} Chiếc</span>
			</p>
			<div class="specs">
				<span v-for='item in specs' :class='{"on": item.isSelect}' @click='chooseSpecs(item)'>
					{{item.specs}}
				</span>
			</div>
		</div>
		<p class='add-to-cart' @click='addToCart'>
			<span class='add-mask'></span>
			<img src="../../../assets/images/addtocart_detail.jpg">
		</p>
	</div>
</template>
<script>
import cart from '@/api/cart'
import store from 'store'
export default {
	name: 'gd-overview',
	props: {
		parameters: Array,
		specs: Array,
		name: String,
		pro: Object
	},
	data() {
		return {}
	},
	methods: {
		addToCart() {
			if(store.get('user')) {
				cart.addToCart(this.pro);
				this.$router.push('/cart');
			} else {
				this.$message.error({
					message: 'Vui lòng đăng nhập trước'
				})
				this.$router.push('/signIn')
			}	
		},
		chooseSpecs(item) {
			this.$emit('select', item)
		},
	 format_number(n){
   var b=parseInt(n).toString();
   var len=b.length;
   if(len<=3){return b;}
   var r=len%3;
   return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{3}/g).join(","):b.slice(r,len).match(/\d{3}/g).join(",");
 }
	},

}
</script>
<style scoped>
#right_product_detail p {
	overflow: hidden;
}
#right_product_detail p span {
	display: inline-block;
}
#right_product_detail p .item-title {
	background: none;
	padding-left: 14px;
	font-weight: normal;
	color: #838383;
	word-break: break-all;
	float: left;
}
#right_product_detail p .item-content {
	display: inline;
	word-break: break-all;
	overflow: hidden;
	font-weight: normal;
	padding-left: 14px;
}
#right_product_detail p .item-through{
	color: #838383;
    text-decoration: line-through;
}
#right_product_detail p .item-normal {
	color: #838383;
}
#right_product_detail p .item-red{
	color: #d7010a;
    font-weight: normal;
}
.discout{
  float:right; 
  background:url(../../../assets/images/km.jpg) no-repeat; 
  width:290px; 
  height:104px;
}
.specs {
	display: flex;
	flex-wrap: wrap;
}
.specs > span {
	display: block;
	margin-bottom: 10px;
	min-width: 40px;
	height: 20px;
	line-height: 20px;
	border-radius: 5px;
	padding: 5px 10px;
	border: 2px solid #cfcfcf;
	/* overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; */
	cursor: pointer;
	margin-right: 10px;
	text-align: center
}
.specs > span.on {
	border-color: #20A0FF 
}
#right_product_detail .add-to-cart {
	background:none; 
	float: left;
	position: relative;
}
#right_product_detail .add-to-cart .add-mask {
	display: block;
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	background: #fff;
	opacity: .3;
	transition: opacity .3s ease-in; 
}
#right_product_detail .add-to-cart:hover .add-mask {
	opacity: 0;
	cursor: pointer;
	transition: opacity .3s ease-out; 
}
</style>