<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.orderId" clearable placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.step" :clearable="true" placeholder="请选择订单类型">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="orderId" label="订单号" width="250" >
			</el-table-column>
			<el-table-column prop="basic.title" label="标题" width="250" >
			</el-table-column>
			<el-table-column prop="extra.total" label="订单金额" width="100" >
			</el-table-column>
			<el-table-column prop="channel" label="支付方式" :formatter="formatChannel" width="120" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate"  >
			</el-table-column>
			<el-table-column label='订单状态' width="100">
				<template scope='scope'>
					<el-tag type="gray" v-if="scope.row.step==1">待付款</el-tag>
					<el-tag type="primary" v-if="scope.row.step==2">待发货</el-tag>
					<el-tag type="warning" v-if="scope.row.step==3">待收货</el-tag>
					<el-tag type="success" v-if="scope.row.step==4">已完成</el-tag>
					<el-tag v-if="scope.row.step==6">已取消</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
				<el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
					<el-button v-if="scope.row.step==2" type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">发货</el-button>
					<el-button v-if="scope.row.step==2 && (!scope.row.extra.refund || scope.row.extra.refund < scope.row.amount)" size="small" type="warning" @click="handleRefund(scope.$index, scope.row)">退款</el-button>
					<el-button type="danger" v-if="scope.row.step==1" size="small" @click="handleDel(scope.$index, scope.row)">取消</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="订单发货" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="订单号">
					{{editForm.orderId}}
				</el-form-item>
				<el-form-item label="订单标题">
					{{editForm.basic.title}}
				</el-form-item>
				<el-form-item label="付款金额">
					¥{{editForm.amount}}
				</el-form-item>
				<el-form-item label="退款金额" v-if="editForm.extra.refund">
					<span style="color:red">¥{{editForm.extra.refund || 0}}</span>
				</el-form-item>
				<el-form-item label="商品清单">
					<el-row v-for="p in editForm.basic.products" :key='p.basic.title'>
						<el-col :span="4">
						{{p.basic.title}}
						</el-col>
						<el-col :span="12">
						x{{p.count}}
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="收货人">
					<el-row>
					<el-col :span="4">
					姓名
					</el-col>
					<el-col :span="12">
					{{editForm.basic && editForm.basic.address && editForm.basic.address.name}}
					</el-col>
					</el-row>
					<el-row>
					<el-col :span="4">
					手机号
					</el-col>
					<el-col :span="12">
					{{editForm.basic && editForm.basic.address && editForm.basic.address.phone}}
					</el-col>
					</el-row>
					<el-row>
					<el-col :span="4">
					地址
					</el-col>
					<el-col :span="12">
					{{editForm.basic && editForm.basic.address && editForm.basic.address.zone.join(',')+editForm.basic.address.detail}}
					</el-col>
					</el-row>
					<el-row>
					<el-col :span="4">
					备注
					</el-col>
					<el-col :span="12">
					{{editForm.basic && editForm.basic.note || '无'}}
					</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="快递公司" v-if="!editForm.shipment.self" prop="shipment.company">
				  <shipment :company="editForm.shipment.company" @on-company-change="onCompanyChange"></shipment>
				</el-form-item>

				<el-form-item label="快递单号" v-if="!editForm.shipment.self" prop="shipment.code">
					<el-input v-model="editForm.shipment.code"  auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="自有配送" prop="shipment.self">
				  <el-switch
					  v-model="editForm.shipment.self"
					  on-text=""
					  off-text="">
					</el-switch>
				</el-form-item>
				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--显示详情-->
		<el-dialog title="订单详情" v-model="showFormVisible" :close-on-click-modal="false">
			<el-row>
			<el-col :span="6">
				订单ID:
			</el-col>
			<el-col :span="18">
				{{ showForm.orderId }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				订单标题:
			</el-col>
			<el-col :span="18">
				{{ showForm.basic && showForm.basic.title }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				订单金额:
			</el-col>
			<el-col :span="18">
				¥{{ showForm.extra && showForm.extra.total }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				实际支付:
			</el-col>
			<el-col :span="18">
				¥{{ showForm.amount }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				退款金额:
			</el-col>
			<el-col :span="18">
				¥{{ showForm.extra && showForm.extra.refund || 0 }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				商品清单:
			</el-col>
			<el-col :span="18">
				<p v-for="p in (showForm.basic && showForm.basic.products)">{{ p.basic.title }} {{p.spec}} x{{ p.count }}</p>
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				收货人信息:
			</el-col>
			<el-col :span="18">
				<p>联系人：{{ showForm.basic && showForm.basic.address.phone }} {{ showForm.basic && showForm.basic.address.name }}</p>
				<p></p>
				<p>地址：{{ showForm.basic && showForm.basic.address.zone.join(',') }} {{ showForm.basic && showForm.basic.address.detail }}</p>
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				提交时间:
			</el-col>
			<el-col :span="18">
				{{ formatTime(showForm.created) }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;" v-if="showForm.step >= 2">
			<el-col :span="6">
				支付信息:
			</el-col>
			<el-col :span="18">
				<p v-if="showForm.payment && showForm.payment.created">支付金额：¥{{ showForm.payment && (showForm.payment.total_fee/100).toFixed(2) }}</p>
				<p v-if="showForm.payment && showForm.payment.created">支付时间：{{ formatTime(showForm.payment && showForm.payment.created) }}</p>
				<p v-if="!showForm.payment || !showForm.payment.created">未支付</p>
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;" v-if="showForm.shipment && showForm.shipment.created">
			<el-col :span="6">
				发货信息:
			</el-col>
			<el-col :span="18">
				<p>{{ showForm.shipment && showForm.shipment.company }} {{ showForm.shipment && showForm.shipment.code }}</p>
				<p>{{ formatTime(showForm.shipment && showForm.shipment.created) }}</p>
			</el-col>
			</el-row>
			<el-row>
					<el-col :span="6">
					备注:
					</el-col>
					<el-col :span="18">
					{{showForm.basic && showForm.basic.note || '无'}}
					</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				订单状态:
			</el-col>
			<el-col :span="18">
				{{ formatStep(showForm.step) }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				买家:
			</el-col>
			<el-col :span="18">
				<p><img v-if="showForm.people && showForm.people.avatar" :src="showForm.people && showForm.people.avatar" class="avatar" /></p>
				<p>ID：{{ showForm.peopleId }}</p>
				<p>昵称：{{ showForm.people && showForm.people.name }}</p>

			</el-col>
			</el-row>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getOrderListPage, getOrderById, shipment, orderRefund, cancelOrder } from '../../api/api';
	import moment from 'moment'
	import Shipment from '@/components/system/shipment'

	export default {
		components: {
			Shipment
		},
		data() {
			return {
				shipments: ['顺丰快递', '圆通快递', 'EMS', '天天快递', '宅急送', '韵达快递', '中通速递'],
				filters: {
					orderId: '',
					step: ''
				},
				options: [{
					label: '待付款',
					value: 1
				}, {
					label: '待发货',
					value: 2
				}, {
					label: '待收货',
					value: 3
				}, {
					label: '已完成',
					value: 4
				}, {
					label: '已取消',
					value: 6
				}],
				orders: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				showFormVisible: false,
				showForm: {},

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					'shipment.company': [
						{ required: true, message: '请选择快递公司', trigger: 'blur' }
					],
					'shipment.code': [
						{ required: true, message: '请输入快递单号', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					basic: {},
					extra: {},
					shipment: {
						company: '',
						code: '',
						self: false
					}
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatTime( time ) {
				return moment( time ).format('YYYY-MM-DD HH:mm:ss')
			},
			formatChannel(row, column ) {
				const channels = {
					'wepay.widget': '小程序支付'
				}
				return (row.channel in channels)?channels[row.channel]:'未知'
			},
			formatStep( step ) {
				const steps = ['待支付', '待发货', '已发货', '已完成', '已退款', '已取消']
				return steps[step-1]
			},
			formatStep2( row, column ) {
				return this.formatStep(row.step)
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getOrders();
			},
			onCompanyChange(val) {
				console.log('VAL======', val)
				this.editForm.shipment.company = val
			},
			//获取用户列表
			getOrders() {
				let para = {
					orderId: this.filters.orderId,
					step: this.filters.step,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getOrderListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total = res.data.total;
					this.orders = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认取消订单：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { orderId: row.orderId };
					cancelOrder(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '取消成功',
							type: 'success'
						});
						this.getOrders();
					});
				}).catch(() => {

				});
			},
			// 退款
			handleRefund: function (index, row) {
				const refund = (row.extra.refund)?row.extra.refund:0
				this.$prompt(`订单号：${row.orderId}，付款人：${row.basic.name}，最多可退款：${(row.amount-refund).toFixed(2)}，请输入退款金额：`, '订单退款', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          inputPattern: /^\d+(?:\.\d{1,2})?$/,
		          inputErrorMessage: '退款金额必须为数字且不超过两位小数'
		        }).then(({ value }) => {
		          this.listLoading = true;
					//NProgress.start();
					let para = { orderId: row.orderId, refund: value };
					orderRefund(para).then((res) => {
						this.listLoading = false;
						if(res.code){
							this.$message({
								message: res.message,
								type: 'error'
							})
							return
						}
						//NProgress.done();
						this.$message({
							message: '退款成功',
							type: 'success'
						});
						this.getOrders();
					});
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '取消退款'
		          });       
		        });
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showFormVisible = true;
				this.showForm = {}
				//this.showForm = Object.assign({}, row);
				getOrderById({
					orderId: row.orderId
				}).then(res => {
					this.showForm = res.data
				})
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				row.shipment = {
					company: '',
					code: '',
					self: false
				}
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({
								orderId: this.editForm.orderId
							}, this.editForm.shipment);

							if(para.self){
								para.company = '自有配送'
								para.code = '无'
							}

							shipment(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getOrders();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getOrders();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getOrders();
					});
				}).catch(() => {

				});
			},
			query() {
				this.page = 1
				this.getOrders()
			}
		},
		mounted() {
			this.getOrders();
		}
	}

</script>

<style scoped>
.avatar{
	width: 96px;
	height: 96px;
}
</style>