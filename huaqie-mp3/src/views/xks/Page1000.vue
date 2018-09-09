<template>
	<div class="collect-money">
		<el-row>
		<el-col :span="14">
		<el-form ref="dataForm" :model="dataForm" :rules="dataRules" label-width="165px"  style="margin:20px;margin-right:100px;min-width:600px;">
		  <el-form-item label="收款窗口" prop='branchId'>
		    <el-select style='width: 100%' :disabled="branchDisabled" v-model="dataForm.branchId" placeholder="请选择收款窗口">
		      <el-option :label="item.label" :value="item.value" v-for='(item, key) in branchOptins' :key='item.value'></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="收款项目" prop='title'>
		    <el-select style='width: 100%' v-model="dataForm.title" placeholder="请选择收款项目">
		      <el-option :label="item.label" :value="item.label" v-for='(item, key) in options' :key='item.value'></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="收款金额" prop='amount'>
		    <el-input v-model="dataForm.amount" placeholder='请填写收款金额'></el-input>
		  </el-form-item>
		  <el-form-item label="付款人姓名" prop='name'>
		    <el-input v-model="dataForm.name" placeholder='请填写付款人姓名'></el-input>
		  </el-form-item>
		  <el-form-item label="付款人手机" prop='phone'>
		    <el-input v-model="dataForm.phone"  placeholder='请填写付款人手机'></el-input>
		  </el-form-item>
		  <el-form-item label="付款人身份证号" prop='idcard'>
		    <el-input v-model="dataForm.idcard" placeholder='请填写付款人身份证号'></el-input>
		  </el-form-item>
		  <el-form-item label="备注" prop='note'>
		    <el-input type='textarea' resize='none' :autosize='{ minRows: 8, maxRows: 14 }' v-model="dataForm.note" placeholder='填写备注，选填'></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="onSubmit(item)" :key='item.value' v-for='item in payStyle' :disabled="isDisabled">{{item.value}}</el-button>
		  </el-form-item>
		  <el-form-item>
		  	<el-button @click="cancel">重新填写</el-button>
		  </el-form-item>

		</el-form>

		<el-dialog title="确认收款" size='tiny' v-model="checkVisible" @close='initDialog'>
		   <el-form :model="checkForm" :rules='checkRules' ref='checkForm' label-width="120px">
		   		 <el-form-item label="订单号：" prop='orderId'>
		 		  {{checkForm.orderId}}
		 		 </el-form-item>
				 <el-form-item label="收款金额：" prop='amount'>
			      {{checkForm.amount|filterAmount}}
			     </el-form-item>
				 <el-form-item label="收款方式：" prop='channel'>
		 		  {{checkForm.channel}}
		 		 </el-form-item>
			     <el-form-item label="收款码："  prop='code' v-if='checkForm.step==1||checkForm.step==3'>
			      	<el-input prop='code' v-model="checkForm.code" placeholder='请扫描收款码' auto-complete="off" :autofocus='true' v-focus icon="circle-close" :on-icon-click="initCode"></el-input>
			     </el-form-item>
			     <el-form-item label="收款码：" v-if='checkForm.step==2||checkForm.step==4'>
			     	<canvas id="canvas"></canvas>
			     </el-form-item>	
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="checkedCancel">取 消</el-button>
		    <el-button type="primary" @click="checked(checkForm.step)">确 定</el-button>
		  </div>
		</el-dialog>
		</el-col>
		<el-col :span="10">
			<div v-if="this.order.orderId">
				<p>订单标题：</p>
				<h4>{{ (order.basic)?order.basic.title:'' }}</h4>
				<p>付款人姓名：</p>
				<h4>{{ (order.basic)?order.basic.name:'' }}</h4>
				<p>订单金额：</p>
				<h4>{{ order.amount|filterTotal }}</h4>
				<p>订单状态：</p>
				<h4 v-if="order.step != 4" style="color:red;">付款中&bull;&bull;&bull;</h4>
				<h4 v-else style="color:green;">已完成</h4>
			</div>
		</el-col>
		</el-row>
	</div>
</template>
<script>
	import session from 'store'
	import total from '@/common/js/formatTotal'
	import { createService, alipayMicroPay, alipayQRPay, wechatMicroPay, wechatNativePay, getAllBranch, getOrderById, getProductListPage } from '@/api/api'
	let QRCode = require('qrcode');

	export default {
		filters: {
			filterAmount(val) {
				return total.changeAmount(val)+'元'
			},
			filterTotal(val) {
				return total.changeAmount(val)
			}
		},
		data() {
			return {
				submitTime: 0,
				submiting: false,
				isDisabled: false,
				timer: null,
				timeCount: 0,
				orderStep: 0,
				branchDisabled: false,
				order: {},
				dataForm: {
					idcard: '',
					branchId: '',
					title: '',
					amount: '',
					name: '',
					phone: '',
					note: ''
				},
				dataRules: {
					branchId: [
						{ required: true, message: '请输选择收款窗口', trigger: 'change' },
					],
					title: [
						{ required: true, message: '请输选择收款项目', trigger: 'change' },
					],
					amount: [
						{ required: true, message: '请输入收款金额', trigger: 'blur' },
					],
					name: [
						{ required: true, message: '请输入收款人姓名', trigger: 'blur' },
					]
				},
				payStyle: [
					{
						value: '支付宝条码支付',
						step: 1
					},
					/*
					{
						value: '支付宝扫码支付',
						step: 2
					},
					*/
					{
						value: '微信条码支付',
						step: 3
					},
					/*
					{
						value: '微信扫码支付',
						step: 4
					},
					*/
					{
						value: '窗口支付',
						step: 5
					}					
				],
				options: [
					{ label: '学费' }
				],
				branchOptins: [],
				dialogOptions: [
					{ label: '支付宝' },
					{ label: '微信' },
				],
				checkVisible: false,
				checkForm: {
					code: '',
					amount: '',
					channel: '',
					step: '',
					orderId: ''
				},
				checkRules: {
					code: [
						{ required: true, message: '请扫描收款码', trigger: 'blur' },
					]
				}
			}
		},
		created() {
			this.getBranchs();
			this.dataForm.branchId = session.get('user').role.branchId
			if(this.dataForm.branchId)
				this.branchDisabled = true
			getProductListPage({
				sortByOrder: 1,
				page: 1,
				size: 100
			}).then(res => {
				// console.log(res.data.list)
				this.options = res.data.list.map(e => ({
					label: e.basic.title
				}))
			})
			const orderId = this.$route.query.orderId
			if(orderId){
				getOrderById({
					orderId: orderId
				}).then( res => {
					console.log('order', res.data)
					this.dataForm.title = res.data.basic.title
					this.dataForm.amount = res.data.amount.toString()
					this.dataForm.name = res.data.basic.name
					this.dataForm.phone = res.data.basic.phone
					this.dataForm.idcard = res.data.basic.idcard
					this.dataForm.note = res.data.basic.note
				})
			}
		},
		methods: {
			formatStep(val) {
				switch(val) {
					case 1: return '待付款'; break;
					case 2: return '待发货'; break;
					case 3: return '待收货'; break;
					case 4: return '已完成'; break;
					case 5: return '已退款'; break;
					case 6: return '已取消'; break;
					default: return '未知状态';
				}
			},
			formatType(val) {
				switch(val) {
					case 'alipay.qr': return '支付宝扫码支付'; break; 
					case 'wepay.native': return '微信扫码支付'; break;
					case 'alipay.micro' : return '支付宝条码支付'; break;
					case 'wepay.micro' : return '微信条码支付'; break;
					case 'alipay.web' : return '窗口支付（支付宝）'; break;
					case 'wepay.wap' : return '窗口支付（微信）'; break;
					default: return '其他';
				}
			},
			// 弹出提示
			putTip(step, orderId) {
		        // this.isDisabled = true;
		        this.timer = setInterval(() => {
					if(this.timeCount >= 10) {
						clearInterval(this.timer);
						this.timeCount = 0;
						//this.isDisabled = false;
						this.store.set('nearOrder', { step: step, order: this.order});
					} else {
						if(this.order.step == 4) {
							clearInterval(this.timer);
							this.timeCount = 0;
							//this.isDisabled = false;
							this.store.remove('nearOrder');
							this.initDataForm();
			        		return ;
			        	}
			        	this.store.set('nearOrder', { step: step, order: this.order});
						this.getOrder(orderId);
					}			
				}, 3000)
			},
			// 获取订单状态
			getOrder(orderId) {
				// console.log('run');
				getOrderById({
					orderId
				}).then(res => {
					if(res.code === 0) {
						this.timeCount += 1;
						// console.log(res.data);
						// console.log('res.data.step', res.data.step)
						this.orderStep = res.data.step;
						this.order = res.data
						
						const h = this.$createElement;
						if(res.data.step == 4) {
							this.$notify({
							  title: '当前订单',
					          message: h('span', { style: 'color: #13CE66; fontSize: 20px'}, this.formatStep(res.data.step))
					        });
						}
						// else {
						// 	this.$notify({
						// 	  title: '当前订单',
					 //          message: h('span', { style: 'color: #FF4949; fontSize: 20px'}, this.formatStep(res.data.step))
					 //        });
						// }
						

					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			getBranchs() {
				getAllBranch({
					page: 1,
					size: 100
				}).then(res => {
					if(res.code === 0) {
						// console.log(res.data.list);
						res.data.list.forEach(item => {
							if(item.step == 1) {
								let branchItem = {};
								branchItem.label = item.basic.title;
								branchItem.value = item.branchId;
								this.branchOptins.push(branchItem);
							}	
						})
						// console.log(res);
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			onSubmit(item) {
				this.$refs['dataForm'].validate((valid) => {
		          if (valid) {
		          	if(this.submitTime > new Date().getTime() - 5000){
		          		this.$message.warning({
							message: '提交过于频繁，请稍候再试'
						})
		          		return
		          	}
		          	this.submitTime = new Date().getTime()
		          	clearInterval(this.timer);
					createService(this.dataForm).then(res => {
						if(res.code === 0) {
							this.$message.success({
								message: '订单创建成功'
							})
							this.order = res.data;
							if(item.step == 2) {
								this.alipayQR({
									orderId: res.data.orderId
								})
							} else if(item.step == 4) {
								this.wechatNative({
									orderId: res.data.orderId
								})
							} else if(item.step == 5) {
								this.putTip(item.step, res.data.orderId);
								const h = this.$createElement;
						        this.$notify({
						          message: h('p', { style: 'color: #1D8CE0; font-size: 22px;' }, '请提醒用户扫描窗口二维码')
						        });
								
								// this.initDataForm();
								return;
							}
							// console.log(res.data);
							this.checkVisible = true;
							this.checkForm.orderId = res.data.orderId;
							this.checkForm.channel = item.value;
							this.checkForm.step = item.step;
							this.checkForm.amount = res.data.extra.total;
							// if(item.step == 3)
							// console.log(res);

						} else {
							this.$message.error({
								message: res.message
							})
						}
					})
		            // console.log(this.dataForm);
		          } else {
		            this.$message.error({
						message: '信息不能为空'
					})
		            return false;
		          }
		        });
				// console.log('sub');
			},
			cancel() {
				this.initDataForm();
				this.$message({
		            type: 'success',
		            message: '重置成功!'
		        });
				/*
				this.$confirm('此操作将重置输入的信息, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.$message({
		            type: 'success',
		            message: '重置成功!'
		          });
				  this.initDataForm();
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消重置'
		          });
		        });
				*/
			},
			initDataForm() {
				this.$refs['dataForm'].resetFields();
			},
			checkedCancel() {
				this.checkVisible = false
			},
			checked(step) {
				this.$refs['checkForm'].validate((valid) => {
		          if (valid) {
		          	clearInterval(this.timer);
		          	let para = {};
		          	para.orderId = this.checkForm.orderId;
		          	para.authCode = this.checkForm.code;
		          	if(step == 1) {
		          		this.ailpayMicro(para);
		          	} else if(step == 3) {
						this.wechatMicro(para);
		          	} else if(step == 2||step == 4) {
		          		this.checkVisible = false;
						//this.initDataForm();
						this.$message.success({
							message: '等待用户确认'
						});
		          	}
		          	this.putTip(step, para.orderId, para);
		          } else {
		            this.$message.error({
						message: '信息不能为空'
					})
		            return false;
		          }
		        });
			},
			ailpayMicro(para) {
				alipayMicroPay(para).then(res => {
	          		if(res.code === 0) {
	          			if(res.data.msg === 'success') {
	          				this.$message.success({
	          					message: '提交成功'
		          			})
	          			} else if(res.data.msg === " order success pay inprocess") {
							this.$message.success({
	          					message: '等待用户确认'
		          			})
	          			}
	          			// console.log(res);
						this.checkVisible = false;
						//this.initDataForm();
						// console.log(this.checkForm);
	          		} else {
	          			this.$message.error({
	          				message: res.message
	          			})
	          		}
	          	})
			},
			alipayQR(para) {
				alipayQRPay(para).then(res => {
					if(res.code === 0) {
						// console.log(res.data);
						this.createQR(res.data.qr_code)
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			wechatMicro(para) {
				wechatMicroPay(para).then(res => {
					if(res.code === 0) {
	          			this.$message.success({
          					message: '提交成功'
	          			})
	          			// console.log(res);
						this.checkVisible = false;
						//this.initDataForm();
						// console.log(res);
	          		} else {
	          			this.$message.error({
	          				message: res.message
	          			})
	          		}
				})
			},
			wechatNative(para) {
				wechatNativePay(para).then(res => {
					if(res.code === 0) {
						// console.log(res.data.code_url);
						this.createQR(res.data.code_url)
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			createQR(msg) {
				// console.log(msg);
				let canvas = document.getElementById('canvas')
				if(canvas) {
					QRCode.toCanvas(canvas, msg, (error) => {
						if(error) {
							this.$message.error({
								message: error
							})
						}
					})
				}				
			},
			// 重新提交订单
			rePortOrderId() {
				if(this.reSubmitTime > new Date().getTime() - 5000){
					this.$message.error({
						message: '提交过于频繁，请稍后再试'
					});
					return
				}
				this.reSubmitTime = new Date().getTime()

				if(!this.store.get('nearOrder')) {
					this.$message.error({
						message: '最近没有待收款记录'
					});
				} else {
					let item = this.store.get('nearOrder');
					// console.log(item);
					let para = {
						idcard: item.order.basic.idcard,
						branchId:  item.order.basic.branchId,
						title:  item.order.basic.title,
						amount: item.order.extra.total,
						name:  item.order.basic.name,
						phone:  item.order.basic.phone,
						note:  item.order.basic.note
					}
					// console.log(item.order);
					// console.log(para);
					createService(para).then(res => {
						if(res.code === 0) {
							this.$message.success({
								message: '订单创建成功'
							})
							this.order = res.data;
							if(item.step == 2) {
								this.alipayQR({
									orderId: res.data.orderId
								})
							} else if(item.step == 4) {
								this.wechatNative({
									orderId: res.data.orderId
								})
							} else if(item.step == 5) {
								this.putTip(item.step, res.data.orderId);
								const h = this.$createElement;
						        this.$notify({
						          message: h('p', { style: 'color: #1D8CE0; font-size: 22px;' }, '请提醒用户扫描窗口二维码')
						        });
								
								this.initDataForm();
								return;
							}
							this.checkVisible = true;
							this.checkForm.orderId = res.data.orderId;
							this.checkForm.channel = this.formatType(item.order.channel);
							this.checkForm.step = item.order.step;
							this.checkForm.amount = res.data.extra.total;
							// if(item.step == 3)
							// console.log(res);

						} else {
							this.$message.error({
								message: res.message
							})
						}
					})
				}
			},
			initDialog() {
				this.$refs.checkForm.resetFields();
			},
			initCode() {
				this.checkForm.code = ''
			}
		}
	}
</script>
<style scoped></style>
