<template>
	<div class="overview-wrap">
		<div class="overview-card" v-if='level != 1 && title != "收银员"'>
			<show-card title='余额' :money='moneyForm.has' :btnMethods='withdrawSubmit'></show-card>
			<show-card title='已提现金额' :money='moneyForm.out'></show-card>
		</div>
		<div  v-else>
		<div class="row overview-card">
			<show-card title='总收入' :money='total'></show-card>
			<show-card title='微信支付' :money='wepay'></show-card>
			<show-card title='支付宝支付' :money='alipay'></show-card>
			</div>
			<div class="row">
					<div class="echarts">
					    <chart-pie :option="chartOption"></chart-pie>
					  </div>
			</div>
		</div>
	</div>
</template>
<script>
	import total from '@/common/js/formatTotal'
	import showCard from '@/components/showCard'
	import chartPie from '@/components/system/chartPie'
	import { getAgentBalance, setWithdraw, getBankBrief } from '@/api/api'
	export default {
		name: 'xksOverview',
		components: {
			showCard,
			chartPie
		},
		computed: {
			total() {
				return total.changeAmount(this.moneyForm.total)
			},
			wepay() {
				return total.changeAmount(this.moneyForm.wepay)
			},
			alipay() {
				return total.changeAmount(this.moneyForm.alipay)
			}
		},
		created() {
			this.level = this.store.get('user').role.level
			this.title = this.store.get('user').role.title
			if(this.level != 1 && this.title != '收银员') {
				this.getBrief();
			} else {
				this.getAllBrief()
			}
		},
		data() {
			return {
				level: '',
				title: '',
				dialogFormVisible: false,
				withdrawForm: {
					name: '',
					bank: '',
					account: '',
					amount: '',
					phone: '',
				},
				moneyForm: {
					has: '',
					out: '',
					total: '',
					wepay: '',
					alipay: ''
				},
				chartOption: []
			}
		},
		methods: {
			getBrief() {
				getAgentBalance({}).then(res => {
					if(res.code === 0) {
						if(res.data) {

						} else {
							this.moneyForm.has = 0;
							this.moneyForm.out = 0;
						}
					} else {
						this.$message.error({
							message: res.message
						}) 
					}
				})
			},
			getAllBrief() {
				getBankBrief({}).then(res => {
					if(res.code === 0) {
						this.moneyForm.total = res.data.total.toFixed(2)
						this.moneyForm.wepay = (res.data.wepay)?res.data.wepay.toFixed(2):0
						this.moneyForm.alipay = (res.data.alipay)?res.data.alipay.toFixed(2):0
						this.chartOption = [{
							name: '微信支付',
							value: this.moneyForm.wepay
						}, {
							name: '支付宝支付',
							value: this.moneyForm.alipay
						}]

						 console.log('====++++++',this.chartOption);
					} else {
						this.$message.error({
							message: res.message
						}) 
					}
				})
			}
		}
	}
</script>
<style scoped>
.overview-card {
	padding: 20px 0;
	display: flex;
	justify-content: space-around;
	align-content: space-around;
	flex-wrap: wrap;
}
.echarts {
	margin: 0 auto;
	margin-top: 50px;
    width: 400px;
    height: 400px;
  }
  .row{
  	width: 100%;
  }
</style>