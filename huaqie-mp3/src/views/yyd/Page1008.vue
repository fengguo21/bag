<template>
<section>
 <el-tabs v-model="activeName">
 <el-tab-pane label="基本信息" name="pane1">
    	<app-basic-set></app-basic-set>
	</el-tab-pane>
    <el-tab-pane label="微信公众号设置" name="pane2">
    	<wx-set></wx-set>
	</el-tab-pane>
	<el-tab-pane label="阿里云短信设置" name="pane3">
		<el-row>
		<el-col :span="8">
	    	<el-form ref="form" :model="form" label-width="180px">
			  <el-form-item label="签名">
			    <el-input v-model="form.aliSms.signName"></el-input>
			  </el-form-item>
			  <el-form-item label="accessKeyId">
			    <el-input v-model="form.aliSms.accessKeyId"></el-input>
			  </el-form-item>
			  <el-form-item label="secretAccessKey">
			    <el-input v-model="form.aliSms.secretAccessKey"></el-input>
			  </el-form-item>
			  <el-form-item label="模板ID">
			    <el-input v-model="form.aliSms.template"></el-input>
			  </el-form-item>
			  <el-form-item label="用户上传证件通知模板ID">
			    <el-input v-model="form.aliSms.template2"></el-input>
			  </el-form-item>
			  <el-form-item label="用户申请退押金通知模板ID">
			    <el-input v-model="form.aliSms.template3"></el-input>
			  </el-form-item>
			  <el-form-item label="用户提交反馈通知模板ID">
			    <el-input v-model="form.aliSms.template4"></el-input>
			  </el-form-item>
			  <el-form-item label="用户事件通知接收手机号">
			    <el-input v-model="form.aliSms.phone"></el-input>
			  </el-form-item>
			  <el-form-item>
		    <el-button type="primary" @click="saveAliSms">保存</el-button>
		  </el-form-item>
		</el-form>
		</el-col>
		</el-row>
	</el-tab-pane>
	<el-tab-pane label="押金设置" name="pane4">
		<el-row>
		<el-col :span="6">
    	<el-form ref="form" :model="form" label-width="80px">
		  <el-form-item label="押金金额">
		    <el-input-number v-model="form.deposit" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		  <el-form-item>
	    <el-button type="primary" @click="saveDeposit">保存</el-button>
	  </el-form-item>
	</el-form>
	</el-col>
	</el-row>
	</el-tab-pane>
	<el-tab-pane label="充值设置" name="pane5">
		<el-row>
		<el-col :span="24">
    	<el-form ref="form" :inline="true" :model="form" label-width="80px">
    		<div v-for="(row, index) in form.chargeOptions">
		  <el-form-item label="充值金额">
		    <el-input-number v-model="row.value" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		  <el-form-item label="积分">
		    <el-input-number v-model="row.score" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		  <el-form-item label=" ">
		    <el-button type="danger" icon="minus" v-if="form.chargeOptions.length>1" size="small" @click="removeCharge(index)"></el-button>
		    <el-button type="success" icon="plus" v-if="index == form.chargeOptions.length-1" size="small" @click="addCharge"></el-button>
		  </el-form-item>
		  </div>
		  <el-form-item>
		  
	  	</el-form-item>
		  <el-form-item>
	    <el-button type="primary" @click="saveCharges">保存</el-button>
	  	</el-form-item>
	</el-form>
	</el-col>
	</el-row>
	</el-tab-pane>
	<el-tab-pane label="月卡设置" name="pane6">
		<el-row>
		<el-col :span="24">
    	<el-form ref="form" :model="form" label-width="80px">
		  <el-form-item label="原价">
		    <el-input-number v-model="form.monthCard.marketPrice" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		  <el-form-item label="现价">
		    <el-input-number v-model="form.monthCard.price" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		 
	</el-form>
	<el-form ref="form" :inline="true" :model="form" label-width="80px">
    		<div v-for="(row, index) in form.monthCard.continuePrices">
		  <el-form-item label="续费金额">
		    <el-input-number v-model="row.price" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		  <el-form-item label="续费原价">
		    <el-input-number v-model="row.marketPrice" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		  <el-form-item label="续费时长">
		    <el-input-number v-model="row.period" :min="0" :max="10000" :debounce="2000"></el-input-number> 月
		  </el-form-item>
		  <el-form-item label=" ">
		    <el-button type="danger" icon="minus" v-if="form.monthCard.continuePrices.length>1" size="small" @click="removeMonthCardContinuePrice(index)"></el-button>
		    <el-button type="success" icon="plus" v-if="index == form.monthCard.continuePrices.length-1" size="small" @click="addMonthCardContinuePrice"></el-button>
		  </el-form-item>
		  </div>
		  <el-form-item>
		  
	  	</el-form-item>
		  <el-form-item>
	    <el-button type="primary" @click="saveMonthCard">保存</el-button>
	  	</el-form-item>
	</el-form>
	</el-col>
	</el-row>
	</el-tab-pane>
	<el-tab-pane label="年卡设置" name="pane7">
		<el-row>
		<el-col :span="24">
    	<el-form ref="form" :model="form" label-width="80px">
		  <el-form-item label="原价">
		    <el-input-number v-model="form.yearCard.marketPrice" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		  <el-form-item label="现价">
		    <el-input-number v-model="form.yearCard.price" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		 
	</el-form>
	<el-form ref="form" :inline="true" :model="form" label-width="80px">
    		<div v-for="(row, index) in form.yearCard.continuePrices">
		  <el-form-item label="续费金额">
		    <el-input-number v-model="row.price" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		  <el-form-item label="续费原价">
		    <el-input-number v-model="row.marketPrice" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		  <el-form-item label="续费时长">
		    <el-input-number v-model="row.period" :min="0" :max="10000" :debounce="2000"></el-input-number> 年
		  </el-form-item>
		  <el-form-item label=" ">
		    <el-button type="danger" icon="minus" v-if="form.yearCard.continuePrices.length>1" size="small" @click="removeYearCardContinuePrice(index)"></el-button>
		    <el-button type="success" icon="plus" v-if="index == form.yearCard.continuePrices.length-1" size="small" @click="addYearCardContinuePrice"></el-button>
		  </el-form-item>
		  </div>
		  <el-form-item>
		  
	  	</el-form-item>
		  <el-form-item>
	    <el-button type="primary" @click="saveYearCard">保存</el-button>
	  	</el-form-item>
	</el-form>
	</el-col>
	</el-row>
	</el-tab-pane>
	
  </el-tabs>
	
	</section>
</template>

<script>
	import appBasicSet from '@/components/system/appBasicSet'
	import wxSet from '@/components/system/wxSet'
	import { editApp } from '../../api/api'
	export default {
		components: {
			appBasicSet,
			wxSet
		},
		data() {
			return {
				activeName: 'pane1',
				form: {
					deposit: 0,
					chargeOpions: [{value: 0, score: 0}],
					monthCard: {
						marketPrice: 0,
						price: 0,
						continuePrices: [{marketPrice: 0, price: 0, period: 0}],
					},
					yearCard: {
						marketPrice: 0,
						price: 0,
						continuePrices: [{marketPrice: 0, price: 0, period: 0}]
					},
					aliSms: {
						signName: '',
						accessKeyId: '',
						secretAccessKey: '',
						template: '',
						template2: '',
						template3: '',
						template4: '',
						phone: ''
					}
				}
			}
		},
		methods: {
			addCharge() {
				this.form.chargeOptions.push({
					value: 0,
					score: 0
				})
			},
			removeCharge( index ) {
				this.form.charges.splice(index, 1)
			},
			addMonthCardContinuePrice() {
				this.form.monthCard.continuePrices.push({
					marketPrice: 0,
					price: 0,
					period: 0
				})
			},
			removeMonthCardContinuePrice( index ) {
				this.form.monthCard.continuePrices.splice(index, 1)
			},
			addYearCardContinuePrice() {
				this.form.yearCard.continuePrices.push({
					marketPrice: 0,
					price: 0,
					period: 0
				})
			},
			removeYearCardContinuePrice( index ) {
				this.form.yearCard.continuePrices.splice(index, 1)
			},
			saveDeposit() {
				console.log('submit!', this.form.deposit);
				const app = this.store.get('app')
				editApp({
					clientAppId: app.appId,
					title: app.basic.title,
					deposit: this.form.deposit
				}).then(res => {
					console.log(res)
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '保存成功'
						});
						this.store.set('app', res.data);
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			saveCharges() {
				console.log('submit!', this.form.charges);
				const app = this.store.get('app')
				editApp({
					clientAppId: app.appId,
					title: app.basic.title,
					chargeOptions: this.form.chargeOptions
				}).then(res => {
					console.log(res)
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '保存成功'
						});
						this.store.set('app', res.data);
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			saveMonthCard() {
				const app = this.store.get('app')
				editApp({
					clientAppId: app.appId,
					title: app.basic.title,
					monthCard: this.form.monthCard
				}).then(res => {
					console.log(res)
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '保存成功'
						});
						this.store.set('app', res.data);
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			saveYearCard() {
				const app = this.store.get('app')
				editApp({
					clientAppId: app.appId,
					title: app.basic.title,
					yearCard: this.form.yearCard
				}).then(res => {
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '保存成功'
						});
						this.store.set('app', res.data);
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			saveAliSms() {
				const app = this.store.get('app')
				editApp({
					clientAppId: app.appId,
					title: app.basic.title,
					aliSms: this.form.aliSms
				}).then(res => {
					console.log(res)
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '保存成功'
						});
						this.store.set('app', res.data);
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			}
		},
		mounted() {
			const app = this.store.get('app')
			this.form = {
				deposit: app.extra.deposit || 0,
				chargeOptions: app.extra.chargeOptions || [{
					value: 0,
					score: 0
				}],
				monthCard: app.extra.monthCard || {
					marketPrice: 0, 
					price: 0, 
					continuePrices: [{
						marketPrice: 0, 
						price: 0,
						period: 0
					}]
				},
				yearCard: app.extra.yearCard || {
					marketPrice: 0, 
					price: 0, 
					continuePrices: [{
						marketPrice: 0, 
						price: 0,
						period: 0
					}]
				},
				aliSms: app.extra.aliSms || {
					signName: '',
					accessKeyId: '',
					secretAccessKey: '',
					template: '',
					template2: '',
					template3: '',
					template4: '',
					phone: ''
				}
			}
		}
	}

</script>