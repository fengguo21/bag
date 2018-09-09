<template>
<div class="poroducthomeall">
	<div class="product_hot-1">
		<div @click='goProduct'>
			<img style="max-width: 100%;" :src="prodata.basic.avatar" border="0">
		</div>
	</div>
	<div id="proname_home">
		<span @click='goProduct'>
			<font>
				<font class='pro-title'>{{prodata.basic.title}}</font>
			</font>
		</span>
	</div>
	<div id="proprice_home">
		<font>
			<font>VND {{prodata.basic.prices[prodata.basic.prices.length-1].price}}</font>
		</font>
	</div>
	</div>
</div>
</template>
<script>
import { mapActions } from 'vuex'
import { set } from '@/api/common'
export default {
	name: 'product',
	props: {
		prodata: Object
	},
	// proData -> main -> title, money; mask -> 
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
.pro-title {
	display: inline-block;
	max-width: 210px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>