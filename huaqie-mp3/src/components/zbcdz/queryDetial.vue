<template>
	<div>
		<!-- 查看详情 -->
		<el-dialog :title="title" v-model="openDetial" :show-close='false' @open='setData'>
		  <div class="my-dialog">
		  	<div class="my-dialog__item" v-for='(item, key) in msg'>
		  		<span>{{key|filterKey}}</span>
		  		{{item}}
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button v-if='close' @click="closeEvent">{{closeBtn}}</el-button>
		    <el-button v-if='ensure' type="primary" @click="ensureEvent">{{ensureBtn}}</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
	import moment from 'moment'
	export default {
		name: 'detial',
		props: {
			openDetial: {
				type: Boolean,
				default: false
			},
			detial: {
				type: Object,
				default: null
			},
			closeEvent: {
				type: Function,
				default: function() {
					console.log('close');
				}
			},
			ensureEvent: {
				type: Function,
				default: function() {
					console.log('ensure');
				}
			},
			ensure: {
				type: Boolean,
				default: true
			},
			close: {
				type: Boolean,
				default: true
			},
			closeBtn: {
				type: String,
				default: '取 消'
			},
			ensureBtn: {
				type: String,
				default: '确 定'
			},
			title: {
				type: String,
				default: '提示'
			}
		},
		filters: {
			filterKey(val) {
				switch(val) {
					case 'orderId': return '订单号 :'; break;
					case 'title': return '订单标题 :'; break;
					case 'created': return '订单时间 :'; break;
					case 'amount': return '订单总额 :'; break;
					case 'channel': return '支付方式 :'; break;
					case 'step': return '订单状态 :'; break;
					case 'typehood': return '订单类型'; break;
					default: return '未知状态';
				}
			}
		},
		data() {
			return {
				step: '',
				typehood: '',
				msg: {}
			}
		},
		methods: {
			setData() {
				
				// console.log(this.detial.step);
				switch(this.detial.step) {
					case 1: this.step = '待付款'; break;
					case 2: this.step = '待发货'; break;
					case 3: this.step = '待收货'; break;
					case 4: this.step = '已完成'; break;
					case 5: this.step = '已退款'; break;
					case 6: this.step =  '已取消'; break;
					default: this.step = '未知状态';
				}
				switch(this.detial.typehood) {
					case 1: this.typehood = '购买普通商品'; break;
					case 2: this.typehood = '个人账户充值'; break;
					case 3: this.typehood = '会员卡充值'; break;
					case 4: this.typehood = '兑换积分商品'; break;
					default: this.step = '未知状态';
				}
				// console.log(this.step);
				// console.log(this.step);
				this.msg = {
					orderId: this.detial.orderId,
					title: this.detial.basic.title,
					typehood: this.typehood,
					created: moment(this.detial.created).format('YYYY-MM-DD HH:mm:ss'),
					amount: this.detial.amount.toFixed(2),
					channel: (this.detial.channel.indexOf('wepay')>-1)? '微信支付': (this.detial.channel.indexOf('alipay')>-1)? '支付宝支付': '其他',
					step: this.step
				}
			},
		},
		computed: {
			dialogVisible() {
				return this.openDetial
			},
		}
	}
</script>
<style scoped>
	.my-dialog__item {
		font-size: 16px;
		margin: 10px 30px;
	}
	.my-dialog__item>span {
		display: inline-block;
		width: 120px;
	}
</style>