<template>
	<div class='price-list__wrap'>
		<div class="price-table">
			<span>充电时长(分钟)</span>
			<span>成本价格(元)</span>
			<span>服务价格(元)</span>
		</div>
		<div class="price-list price-table" v-for='item in prices'>
			<span>{{item.chargeTime}}</span>
			<span>{{item.cost}}</span>
			<span>{{item.payFee}}</span>
		</div>
	</div>	
</template>
<script>
	export default {
		name: 'priceList',
		props: ['prices'],
		data() {
			return {}
		}
	}
</script>
<style scoped lang='scss'>
.price-list__wrap {
	width: 100%;
	.price-table {
		width: auto;
		overflow:hidden;
		&:first-child {
			span {
				border-top: 1px solid #999;	
			}
		}
		span {
			float: left;
			box-sizing: border-box;
			min-width: 150px;
			padding: 5px 10px;		
			border: 1px solid #999;
			border-top: 0;
			&:first-child {
				border-right: 0
			}
		}
	}
}

	
</style>