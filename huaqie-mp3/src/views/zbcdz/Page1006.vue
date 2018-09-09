<template>
<section>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="微信设置" name="p1" v-if='level==1'>
    	<wxpay-set></wxpay-set>	
    </el-tab-pane>
    
    <el-tab-pane label="支付宝设置" name="p2" v-if='level==1'>
    	<alipay-set></alipay-set>	
    </el-tab-pane>
    <!--
    <el-tab-pane label="提现缴费设置" name="p3" v-if="agentLevel!=3">
    	<cash-payment></cash-payment>	
    </el-tab-pane>
    -->
    <el-tab-pane label="充电桩设置" name="p4" v-if='level==1'>
    	<charge-set></charge-set>
    </el-tab-pane>
    <el-tab-pane label="充值金额设置" name="p5" v-if='level==1'>
    	<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				
				<el-form-item
					inline
				    v-for="(charge, index) in addForm.options"
				    :label="'充值金额' + (index+1)"
				    :key="index"
				  >
				    <el-input-number v-model="charge.value" :min="0" :max="100000" style="width:200px;margin-right:10px;"></el-input-number><el-button @click.prevent="removeCharge('addForm', charge)">删除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="warning" @click='addCharge("addForm")'>新增充值金额</el-button> <el-button v-if="addForm.options.length > 0" type="info" @click='addSubmit()'>保存</el-button>
				</el-form-item>
			</el-form>
    </el-tab-pane>
  </el-tabs>	
</section>
</template>

<script>
	import wxpaySet from '@/components/system/wxSet'
	import alipaySet from '@/components/system/alipaySet'
	import cashPayment from '@/components/system/cashPayment'
	import chargeSet from '@/components/system/chargeSet'
	import session from 'store'
	import { editApp, getCurrentAgent } from '@/api/api'

	export default {
		data() {
			return {
				// activeName: 'first',
				level: '',
				agentLevel: '',
				activeName: (this.level != 1)?'p3':'p1',
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入会员卡名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					options: []
				}
			}
		},
		created() {
			this.level = this.store.get('user').role.level
			if(this.level == 1)
				this.activeName = 'p1'
			getCurrentAgent({
				peopleId: this.store.get('user').peopleId
			}).then(res => {
				if(res && res.data)
					this.agentLevel = res.data.extra.level
			})
			this.init()
			// console.log()
			// console.log(this.store.get('user').role)
		},
		components: {
			wxpaySet,
			alipaySet,
			cashPayment,
			chargeSet
		},
		methods: {
			// tab切换时触发事件
			handleClick(tab, event) {
				// console.log(tab, event)
			},
			addCharge(formName) {
				// console.log(this[formName].options)
				this[formName].options.push({
			        value: ''
			    });
			},
			removeCharge(formName, item) {
				const index = this[formName].options.indexOf(item)
		        if (index !== -1) {
		          this[formName].options.splice(index, 1)
		        }
			},
			init() {
				const app = session.get('app')
				console.log(app.extra)
				this.addForm.options = (app.extra.chargeOptions)?app.extra.chargeOptions.map(e => ({
					value: e
				})):[]
			},
			//新增
			addSubmit: function () {
				console.log(this.addForm);
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = {
								title: session.get('app').basic.title,
								clientAppId: session.get('app').appId,
								chargeOptions: []
							}
							this.addForm.options.forEach(item => {
								if(!item)
										return
								console.log('ITEM.value', item.value)
								para.chargeOptions.push(item.value);
							})
							console.log('PAPA', para)
							

							// console.log(para);
							editApp(para).then((res) => {
								this.addLoading = false;
								if(res.code > 0) {
									this.$message.error({
										message: res.message
									})
									return ;
								}
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								console.log('RES>DATA', res.data)
								session.set('app', res.data)
							});
						});
					}
				});
			}
		}
	}

</script>