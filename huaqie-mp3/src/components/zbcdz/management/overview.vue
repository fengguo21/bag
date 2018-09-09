<template>
	<div class="overview-wrap">
		<div class="overview-card">
		<show-card v-if='level != 1' title='总收入' :money='moneyForm.total'></show-card>
			<show-card v-if='level != 1' title='余额' :money='moneyForm.has' :showBtn='true' :btnMethods='withdrawSubmit'></show-card>
			<show-card v-if='level != 1' title='已提现金额' :money='moneyForm.out'></show-card>
			
			<show-card v-if='level == 1' title='总收入' :money='moneyForm.total'></show-card>
			
			
		</div>
		<div class="overview-card">
			<show-card v-if='level != 1 && agentLevel != 3' title='下级余额' :money='moneyForm.toHas'></show-card>
			<show-card v-if='level != 1 && agentLevel != 3' title='下级提现金额' :money='moneyForm.toOut'></show-card>
			<show-card v-if='level == 1' title='下级余额' :money='moneyForm.toHas'></show-card>
			<show-card v-if='level == 1' title='下级提现金额' :money='moneyForm.toOut'></show-card>
		</div>
		<!-- 提现弹窗 -->
		<el-dialog title="提现信息" v-model="dialogFormVisible" @close='initForm' @open='getBank'>
		  <el-form :model="withdrawForm" label-width='100px'>
		  	<el-form-item label="提现金额">
		      <el-input v-model="withdrawForm.amount" auto-complete="off" placeholder='请输入提现金额'></el-input>
		    </el-form-item>
		    <el-form-item label="提现人姓名">
		      <el-input v-model="withdrawForm.name" placeholder='请输入提现人姓名' auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="手机号">
		      <el-input v-model="withdrawForm.phone" placeholder='请输入提现人手机号' auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="选择银行">
		      <el-select v-model="withdrawForm.bank" placeholder="请选择银行">
		        <el-option :label="item.label" :value="item.label" v-for='item in options' :key='item.label'></el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item label="银行卡号">
		      <el-input v-model="withdrawForm.account" auto-complete="off" placeholder='请输入提现的银行卡号'></el-input>
		    </el-form-item>
		    
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="checkOk">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
	import showCard from '@/components/showCard'
	import { getAgentBalance, setWithdraw, getBankBrief, getBank, getCurrentAgent } from '@/api/api'
	export default {
		name: 'overview',
		components: {
			showCard
		},
		created() {
			this.level = this.store.get('user').role.level
			if(this.level != 1) {
				this.getBrief();
			} else {
				this.getAllBrief()
			}
			getCurrentAgent({
				peopleId: this.store.get('user').peopleId
			}).then(res => {
				console.log('===== getCurrentAgent', res.data)
				if(res && res.data)
					this.agentLevel = res.data.extra.level
			})
		},
		data() {
			return {
				level: '',
				agentLevel: '',
				dialogFormVisible: false,
				withdrawForm: {
					name: '',
					bank: '',
					account: '',
					amount: '',
					phone: '',
				},
				options: [
					{ label: '中国银行' },
					{ label: '工商银行' },
					{ label: '建设银行' },
					{ label: '招商银行' },
					{ label: '农业银行' },
					{ label: '其他' },
				],
				moneyForm: {
					has: '',
					out: '',
					total: '',
					toHas: '',
					toOut: ''
				}
			}
		},
		methods: {
			getBank() {
				getBank({}).then(res => {
					if(res.code > 0) {
						this.$message.error({
							message: res.message
						})
					}
					if(res.data) {
						this.withdrawForm = {
							amount: '',
							account: res.data.basic.account,
							bank: res.data.basic.bank,
							name: res.data.basic.name,
							phone: res.data.basic.phone
						}
					}
					// console.log(res.data);
				})
			},
			getBrief() {
				getAgentBalance({}).then(res => {
					if(res.code === 0) {
						if(res.data) {
							this.moneyForm.has = res.data.balance.toFixed(2);
							this.moneyForm.out = res.data.withdraw?res.data.withdraw.toFixed(2):0;
							this.moneyForm.total = ((res.data.frozen?Number(res.data.frozen.toFixed(2)):0)+Number(this.moneyForm.has)+Number(this.moneyForm.out)).toFixed(2);
							this.moneyForm.toOut = res.data.toWithdraw?res.data.toWithdraw.toFixed(2):0;
							this.moneyForm.toHas = (this.moneyForm.total-this.moneyForm.toOut).toFixed(2)
						} else {
							this.moneyForm.has = 0;
							this.moneyForm.out = 0;
							this.moneyForm.toOut = 0;
							this.moneyForm.toHas = 0;
							this.moneyForm.total = 0;
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
						this.moneyForm.toOut = res.data.toWithdraw?res.data.toWithdraw.toFixed(2):0;
						this.moneyForm.toHas = (this.moneyForm.total-this.moneyForm.toOut).toFixed(2)
						 console.log(res);
					} else {
						this.$message.error({
							message: res.message
						}) 
					}
				})
			},
			// 提现申请
			withdrawSubmit() {
				this.dialogFormVisible = true;
			},
			// 初始化弹窗
			initForm() {
				this.withdrawForm = {
					name: '',
					bank: '',
					account: '',
					amount: '',
					phone: '',
				}
			},
			// 确认提现
			checkOk() {	
				let para = this.withdrawForm;
				this.withdraw(para);
				this.dialogFormVisible = false;
			},
			withdraw(para) {
				setWithdraw(para).then(res => {
					if(res.code === 0) {
						this.$message.success({
							message: '已提交提现申请'
						})
						this.$store.dispatch('resetWithdraw', true)
						// console.log(this.$store.getters)
					} else {
						this.$message.error({
							message: res.message
						})
					}
					// console.log(res);
				})
				// console.log('withdraw');
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
</style>