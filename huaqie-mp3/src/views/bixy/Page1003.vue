<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.orderId" placeholder="Order ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getOrders">Search</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="orderId" label="Order ID" width="230" >
			</el-table-column>
			<el-table-column prop="basic.title" label="Title" width="250" >
			</el-table-column>
			<el-table-column prop="extra.total" label="Order Amount" width="140" >
			</el-table-column>
			<el-table-column prop="channel" label="Payment Method" width="150" >
			</el-table-column>
			<el-table-column prop="created" label="Create Time" :formatter="formatDate" width="180" >
			</el-table-column>
			<el-table-column prop="step" label="Order Status" :formatter="formatStep2" min-width="150" >
			</el-table-column>
			<el-table-column label="Options" width="250">
				<template scope="scope">
				
				<el-button size="small" @click="handleShow(scope.$index, scope.row)">Check</el-button>
				<el-button v-if="scope.row.step==1" size="small" type='warning' @click="checkOut(scope.$index, scope.row)">Confirm Paid</el-button>
					<el-button v-if="scope.row.step==2" size="small" type='primary' @click="handleEdit(scope.$index, scope.row)">Deliver</el-button>

					<!--<el-button size="small" @click="handleReject(scope.$index, scope.row)">退货</el-button>-->
					<!--<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="Deliver" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="Order ID" prop="name">
					<el-input v-model="editForm.orderId" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Order Title" prop="name">
					<el-input v-model="editForm.basic.title" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Order Amount" prop="name">
					<el-input v-model="editForm.extra.total" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Courier Company" prop="shipment.company">
					<el-select v-model="editForm.shipment.company" placeholder="请选择">
				    <el-option
				      v-for="item in shipments"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="Tracking Number" prop="shipment.code">
					<el-input v-model="editForm.shipment.code"  auto-complete="off"></el-input>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">Submit</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="Add" v-model="addFormVisible" :close-on-click-modal="false">
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
		<el-dialog title="Oeder detail" v-model="showFormVisible" :close-on-click-modal="false">
			<el-row>
			<el-col :span="6">
				Order ID:
			</el-col>
			<el-col :span="18">
				{{ showForm.orderId }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				Order Title:
			</el-col>
			<el-col :span="18">
				{{ showForm.basic && showForm.basic.title }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				Order Amount:
			</el-col>
			<el-col :span="18">
				¥{{ showForm.extra && showForm.extra.total }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				Paid:
			</el-col>
			<el-col :span="18">
				¥{{ showForm.amount }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				Prouct List:
			</el-col>
			<el-col :span="18">
				<p v-for="p in (showForm.basic && showForm.basic.products)">{{ p.basic.title }} {{p.spec}} x{{ p.count }}</p>
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				Receiver info.:
			</el-col>
			<el-col :span="18">
				<p>{{ showForm.basic && showForm.basic.address.phone }} {{ showForm.basic && showForm.basic.address.name }}</p>
				<p></p>
				<p>{{ showForm.basic && showForm.basic.address.zone }} {{ showForm.basic && showForm.basic.address.address }}</p>
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				Date:
			</el-col>
			<el-col :span="18">
				{{ formatTime(showForm.created) }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				Payment info.:
			</el-col>
			<el-col :span="18">
				<p>Paid amount：¥{{ showForm.payment && showForm.payment.transactionAmount }}</p>
				<p>Payment receipt No.：{{ showForm.payment && showForm.payment.transactionId }}</p>
				<p>Payer：{{ showForm.payment && showForm.payment.transactionName }}</p>
				<p>Payment Time：{{ formatTime(showForm.payment && showForm.payment.created) }}</p>
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;" v-if="showForm.shipment && showForm.shipment.created">
			<el-col :span="6">
				Delivery info.:
			</el-col>
			<el-col :span="18">
				<p>{{ showForm.shipment && showForm.shipment.company }} {{ showForm.shipment && showForm.shipment.code }}</p>
				<p>{{ formatTime(showForm.shipment && showForm.shipment.created) }}</p>
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				Order Status:
			</el-col>
			<el-col :span="18">
				{{ formatStep(showForm.step) }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				Buyer ID:
			</el-col>
			<el-col :span="18">
				{{ showForm.peopleId }}
			</el-col>
			</el-row>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showFormVisible = false">Close</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getOrderListPage, shipment, orderReject, offlinePayVerify } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				shipments: ['顺丰快递', '圆通快递', 'EMS', '天天快递', '宅急送', '韵达快递'],
				filters: {
					orderId: ''
				},
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
					'shipment.code': [
						{ required: true, message: 'Please enter the express number', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					basic: {},
					extra: {},
					shipment: {
						company: '',
						code: ''
					}
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: 'Please enter the name', trigger: 'blur' }
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
			formatStep( step ) {
				const steps = ['Pendding to Pay', 'Pending to deliver', 'Shipped', 'Completed', 'Returned']
				return steps[step-1]
			},
			formatStep2( row, column ) {
				return this.formatStep(row.step)
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getOrders();
			},
			checkOut(index, row) {
				// console.log(row.step);
				this.$confirm('The order has confirmed receipt?', 'prompt', {
					confirmButtonText: 'Confirm',
	          		cancelButtonText: 'Cancel',
					type: 'warning'
				}).then(() => {
					offlinePayVerify({
						orderId: row.orderId
					}).then(res => {
						if(res.code === 0) {
							this.$message.success({
								message: 'Order confirmation is successful'
							});
							this.getOrders();
						} else {
							this.$message.error({
								message: res.message
							})
						}
					})
				}).catch(() => {
					this.$message({
						message: 'Cancel confirmation operation'
					})
				});
			},
			//获取用户列表
			getOrders() {
				let para = {
					orderId: this.filters.orderId,
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
				this.$confirm('Are you sure you want to delete the record?', 'prompt', {
					confirmButtonText: 'Confirm',
	          		cancelButtonText: 'Cancel',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: 'Successfully deleted',
							type: 'success'
						});
						this.getOrders();
					});
				}).catch(() => {

				});
			},
			// 退货
			handleReject: function (index, row) {
				this.$confirm('Order：'+row.orderId+' Are you sure to return?', 'prompt', {
					confirmButtonText: 'Confirm',
	          		cancelButtonText: 'Cancel',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { orderId: row.orderId };
					orderReject(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: 'Return successful',
							type: 'success'
						});
						//this.getOrders();
					});
				}).catch(() => {

				});
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showFormVisible = true;
				this.showForm = Object.assign({}, row);
				console.log('ROW========', row)
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				row.shipment = {
					company: '',
					code: ''
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
						if(!this.editForm.shipment.company) {
							this.$message.error('Logistics company can not be empty！')
							return;
						}
						this.$confirm('Are you sure to submit?', 'prompt', {
							confirmButtonText: 'Confirm',
	          				cancelButtonText: 'Cancel',
						}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({
								orderId: this.editForm.orderId
							}, this.editForm.shipment);

							shipment(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: 'Submitted successfully',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getOrders();
							});
						});
					} else {
						this.$message.error('Logistics company can not be empty！')
						return;
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('Are you sure to submit?', 'prompt', {
							confirmButtonText: 'Confirm',
	          				cancelButtonText: 'Cancel',
						}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: 'Submitted successfully',
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
				this.$confirm('Are you sure you want to delete the record?', 'prompt', {
					confirmButtonText: 'Confirm',
	          		cancelButtonText: 'Cancel',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: 'Successfully deleted',
							type: 'success'
						});
						this.getOrders();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getOrders();
		}
	}

</script>

<style scoped>

</style>