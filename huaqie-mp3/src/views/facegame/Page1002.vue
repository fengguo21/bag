<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="脸星名字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button v-on:click="getOrders">查询</el-button>
					<el-button type="primary" v-on:click="handleAdd">新增脸星</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="orderId" label="订单号" width="220" >
			</el-table-column>
			<el-table-column prop="basic.title" label="标题" width="250" >
			</el-table-column>
			<el-table-column prop="extra.total" label="订单金额" width="100" >
			</el-table-column>
			<el-table-column prop="channel" label="支付方式" width="120" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" width="180" >
			</el-table-column>
			
			<el-table-column label="操作" width="200">
				<template scope="scope">
				<el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
					<el-button v-if="scope.row.step==2" size="small" @click="handleEdit(scope.$index, scope.row)">发货</el-button>

					<el-button size="small" @click="handleReject(scope.$index, scope.row)">退货</el-button>
					<!--<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增今日脸星" v-model="addFormVisible" :close-on-click-modal="false">
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

		<!--编辑界面-->
		<el-dialog title="发货" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="订单号" prop="name">
					<el-input v-model="editForm.orderId" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="订单标题" prop="name">
					<el-input v-model="editForm.basic.title" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="订单金额" prop="name">
					<el-input v-model="editForm.extra.total" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="快递单号" prop="shipment.code">
					<el-input v-model="editForm.shipment.code"  auto-complete="off"></el-input>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
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
				<p>{{ showForm.basic && showForm.basic.address.phone }} {{ showForm.basic && showForm.basic.address.name }}</p>
				<p></p>
				<p>{{ showForm.basic && showForm.basic.address.zone }} {{ showForm.basic && showForm.basic.address.address }}</p>
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				创建时间:
			</el-col>
			<el-col :span="18">
				{{ formatTime(showForm.created) }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				支付信息:
			</el-col>
			<el-col :span="18">
				<p>¥{{ showForm.payment && showForm.payment.amount }}</p>
				<p>{{ formatTime(showForm.payment && showForm.payment.created) }}</p>
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				发货信息:
			</el-col>
			<el-col :span="18">
				<p>{{ showForm.shipment && showForm.shipment.company }} {{ showForm.shipment && showForm.shipment.code }}</p>
				<p>{{ formatTime(showForm.shipment && showForm.shipment.created) }}</p>
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				买家ID:
			</el-col>
			<el-col :span="18">
				{{ showForm.peopleId }}
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
	import { getOrderListPage, shipment, orderReject } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					name: ''
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
						{ required: true, message: '请输入快递单号', trigger: 'blur' }
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
			handleCurrentChange(val) {
				this.page = val;
				this.getOrders();
			},
			//获取用户列表
			getOrders() {
				let para = {
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
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
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
			// 退货
			handleReject: function (index, row) {
				this.$confirm('订单：'+row.orderId+' 确认退货吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { orderId: row.orderId };
					orderReject(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '退货成功',
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
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({
								orderId: this.editForm.orderId
							}, this.editForm.shipment);

							shipment(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								//this.getOrders();
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
			}
		},
		mounted() {
			this.getOrders();
		}
	}

</script>

<style scoped>

</style>