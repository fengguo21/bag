<template>
	<section>
	
	<el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="Overview" name="first">
    	<el-row class="brief">
    	<el-col :span="6">
    	<h3>¥{{ balance.date }}</h3>
    	<p>Today Income</p>
    	</el-col>
    	<el-col :span="6">
    	<h3>¥{{ balance.week }}</h3>
    	<p>This Week Income</p>
    	</el-col>
    	<el-col :span="6">
    	<h3>¥{{ balance.month }}</h3>
    	<p>This Month Income</p>
    	</el-col>
    	<el-col :span="6">
    	<h3>¥{{ balance.total }}</h3>
    	<p>Total Income</p>
    	</el-col>
    	</el-row>
    </el-tab-pane>
    <el-tab-pane label="Detail Income" name="second">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.orderId" placeholder="Order ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">search</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="transactions" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.orderId" label="Order ID" sortable>
			</el-table-column>
			<el-table-column prop="amount" label="Payment Amount" sortable>
			</el-table-column>
			<el-table-column prop="basic.channel" label="Payment Methods" sortable>
			</el-table-column>
			<el-table-column prop="created" :formatter='formatDate' label="Payment Time" min-width="180" sortable>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

    </el-tab-pane>
   
  </el-tabs>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getBankBrief, getTransactionListPage } from '../../api/api';
	import moment from 'moment'
	export default {
		data() {
			return {
				balance: {},
				filters: {
					name: ''
				},
				activeName: 'first',
				transactions: [],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
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
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getTransactions();
			},
			handleClick() {

			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				/*
				getPeopleListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
				*/
				getBankBrief({}).then(res => {
					this.balance = res.data
				})
				this.getTransactions()
			},
			getTransactions() {
				getTransactionListPage({
					orderId: this.filters.orderId,
					page: this.page,
					size: 10
				}).then(res => {
					this.listLoading = false;
					console.log('res', res)
					this.transactions = res.data.list
					this.total = res.data.total
				})
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
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
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
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
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
								this.getUsers();
							});
						});
					}
				});
			},
			query: function() {
				this.page = 1
				this.getTransactions()
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>
.brief h3{
	font-size: 19px;
}
.brief p{
	color: #333333;
}
</style>