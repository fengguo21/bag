<template>
	<div class="card-wrap">
		<div class="card-money">￥{{money}}</div>
		<div class='card-title'>{{title}}</div>
		<el-button type='primary' v-if='showBtn' @click='btnMethods'>申请提现</el-button>
	</div>
</template>
<script>
	export default {
		name: 'showCard',
		props: {
			title: {
				type: String,
				default: '卡片名'
			},
			money: {
				type: [String, Number],
				default: 0
			},
			showBtn: {
				type: Boolean,
				default: false
			},
			btnMethods: {
				type: Function,
				default: function() {
					alert('click the btn');
				}
			}
		},
		data() {
			return {
			}
		},
		methods: {
		}
	}
</script>
<style scoped>
.card-wrap {
	transition: all .5s;
	width: 350px;
	height: 200px;
	background: #cfcfcf;
	border-radius: 10px;
	box-sizing: border-box;
	padding: 10px;
	overflow: hidden;
	text-align: center;
	margin-bottom: 20px;
}
.card-wrap:hover {
	box-shadow: 5px 5px #bfbfbf;
}
.card-title {
	font-size: 20px;
	font-family: '微软雅黑', '宋体', '楷体';
	text-align: center;
	margin-top: 10px;
	color: #666666;
}
.card-money {
	word-break: break-all;
	padding: 20px;
	margin: 20px 0 15px;
	/* height: 200px;
	line-height: 200px; */
	font-size: 32px;
	text-align: center;
	font-family: '微软雅黑', Arail
}
</style>