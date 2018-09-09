<template>
	<section>
	
	<el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="概览" name="p1">
    	<el-row class="brief">
    	<el-col :span="6">
    	<h3>¥{{ balance.date && balance.date.toFixed(2) }}</h3>
    	<p>今日收入</p>
    	</el-col>
    	<el-col :span="6">
    	<h3>¥{{ balance.week && balance.week.toFixed(2) }}</h3>
    	<p>本周收入</p>
    	</el-col>
    	<el-col :span="6">
    	<h3>¥{{ balance.month && balance.month.toFixed(2) }}</h3>
    	<p>本月收入</p>
    	</el-col>
    	<el-col :span="6">
    	<h3>¥{{ balance.total && balance.total.toFixed(2) }}</h3>
    	<p>总收入</p>
    	</el-col>
    	</el-row>
    </el-tab-pane>
    <el-tab-pane label="收入明细" name="p2">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="transactions" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="amount" label="金额" width="120" >
			</el-table-column>
			<el-table-column prop="basic.orderId" label="订单号" width="250"  >
			</el-table-column>
			<el-table-column prop="basic.name" label="支付人" width="200" >
			</el-table-column>
			<el-table-column prop="basic.channel" label="支付方式" :formatter="formatChannel" width="200" >
			</el-table-column>
			<el-table-column prop="created" label="支付时间" :formatter="formatDate" min-width="180" >
			</el-table-column>
			
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<!--
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					-->
				</template>
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
				activeName: 'p1',
				transactions: [],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				peopleTransactions: [],
				page2: 1,
				total2: 0,

				withdraws: [],
				page3: 1,
				total3: 0,

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
			formatChannel(row, column ) {
				const channels = {
					'wepay': '微信支付'
				}
				console.log(row.basic.channel)
				return (row.basic.channel in channels)?channels[row.basic.channel]:'未知'
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			handleCurrentChange2(val) {
				this.page2 = val;
				this.getPeopleTransactions();
			},
			handleCurrentChange3(val) {
				this.page3 = val;
				this.getWithdraws();
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
				getTransactionListPage({
					page: 1,
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