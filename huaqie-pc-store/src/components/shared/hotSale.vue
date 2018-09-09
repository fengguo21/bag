<template>
	<div id="product_new">
		<div id="images_pro1">
			<div @click='goProduct' style='position:relative;'>
				<img style="width: 100%; display: block;" :src="detail.avatar">
			</div>
			<img src="../../assets/images/icon_new.png" style="position:absolute; margin:-4px 0 0 -41px; top: 0px; right: -4px">
		</div>
		<div id="right_pro_home">
		<p>
			<a @click='goProduct'>
				<font>
					<font>
						{{detail.title}}
					</font>
				</font>
			</a>
		</p>
		<p>
			<!-- <b>
				<font>
					<font>保修期：&nbsp;</font>
				</font>
			</b> -->
			<font>
				<font>
					<!-- {{detail.desc}} -->
				</font>
			</font>
		</p>
		<!-- <p>
			<b>
				<font>
					<font>现状：&nbsp;</font>
				</font>
			</b>
			<font>
				<font>
					{{detail.statu}}
				</font>
			</font>
		</p> -->
		<p>
			<strong>
				<font>
					<font>
						{{detail.prices[detail.prices.length-1].price}} {{detail.unit||'VND'}}
					</font>
				</font>
			</strong>
		</p>
		</div>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import { set } from '@/api/common'
export default {
	name: 'hotSale',
	props: {
		detail: {
			type: Object,
			default: () => {
				return {
					price: 0,
	      			imgUrl: require('../../assets/images/small_ptm1490436455.jpg'),
	      			statu: '',
	      			proname: '',
	      			repair: '',
	      			unit: 'VND'
				}
			}
		},
		prodata: Object
	},
	data() {
		return {}
	},
	methods: {
		...mapActions([
			'nowProduct'
		]),
		goProduct() {
			this.$router.push('/product');
			this.nowProduct(this.prodata);
			set('seePro', this.prodata);
		}
	}
}
</script>
<style scoped>
	#product_new {
		overflow: initial;
		cursor: pointer;
	}
	#images_pro1 {
		position: relative;
		overflow: hidden;
	}
</style>