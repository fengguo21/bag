<template>
	<section>
	
	<el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="概览" name="p1">
    	<el-row class="brief">
    	<el-col :span="6">
    	<h3>¥{{ formatCurrency(balance.date) }}</h3>
    	<p>今日收入</p>
    	</el-col>
    	<el-col :span="6">
    	<h3>¥{{ formatCurrency(balance.week) }}</h3>
    	<p>本周收入</p>
    	</el-col>
    	<el-col :span="6">
    	<h3>¥{{ formatCurrency(balance.month) }}</h3>
    	<p>本月收入</p>
    	</el-col>
    	<el-col :span="6">
    	<h3>¥{{ formatCurrency(balance.total) }}</h3>
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
    <el-tab-pane label="已退押金记录" name="p3">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.phone" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="deposits" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column label="头像" width="100">
				<template scope="scope">
					<img :src="scope.row.people.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="people.name" label="昵称" width="120" >
			</el-table-column>
			<el-table-column prop="basic.amount" label="金额" width="120" >
			</el-table-column>
			<el-table-column prop="basic.amount" label="退款方式" width="120" :formatter="formatMethod">
			</el-table-column>
			<el-table-column prop="basic.bank" label="银行" width="250"  >
			</el-table-column>
			<el-table-column prop="basic.account" label="银行卡号" width="200" >
			</el-table-column>
			<el-table-column prop="basic.name" label="开户人姓名" width="200" >
			</el-table-column>
			<el-table-column prop="basic.phone" label="手机号" width="200" >
			</el-table-column>
			<el-table-column prop="created" label="申请时间" :formatter="formatDate" min-width="180" >
			</el-table-column>
			<el-table-column prop="updated" label="确认时间" :formatter="formatDate2" min-width="180" >
			</el-table-column>
			<!--
			<el-table-column label="操作" width="150">
				<template scope="scope">
				</template>
			</el-table-column>
			-->
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total2" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
    <el-tab-pane label="退押金申请" name="p4">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.phone" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="deposits2" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column label="头像" width="100">
				<template scope="scope">
					<img :src="scope.row.people.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="people.name" label="昵称" width="120" >
			</el-table-column>
			<el-table-column prop="basic.amount" label="金额" width="120" >
			</el-table-column>
			<el-table-column prop="basic.bank" label="银行" width="250"  >
			</el-table-column>
			<el-table-column prop="basic.account" label="银行卡号" width="200" >
			</el-table-column>
			<el-table-column prop="basic.name" label="开户人姓名" width="200" >
			</el-table-column>
			<el-table-column prop="basic.phone" label="手机号" width="200" >
			</el-table-column>
			<el-table-column prop="created" label="申请时间" :formatter="formatDate" min-width="180" >
			</el-table-column>
			
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleWithdraw(1, scope.row)">原路退回</el-button>
					<el-button type="warning" size="small" @click="handleWithdraw(2, scope.row)">银行退款</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total3" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
  </el-tabs>

  <!--银行退款弹窗-->
		<el-dialog title="银行退款" v-model="bankFormVisible" :close-on-click-modal="false" @close='bankFormVisible=false'>
			<el-form :model="bankForm" label-width="120px" :rules="bankFormRules" ref="bankForm">
				<el-form-item label="退款人昵称">
					{{ bankForm.peopleName }}
				</el-form-item>
				<el-form-item label="退款人手机号">
					{{ bankForm.phone }}
				</el-form-item>
				<el-form-item label="退款金额">
					¥{{ bankForm.amount }}
				</el-form-item>

				<el-form-item label="银行" prop="bank">
					<el-input v-model="bankForm.bank" class='small-el-input' auto-complete="off" placeholder='请输入银行'></el-input>
				</el-form-item>

				<el-form-item label="卡号" prop='account'>
					<el-input type="text" v-model="bankForm.account" class='small-el-input' placeholder='请输入卡号'></el-input>
				</el-form-item>
				
				<el-form-item label="开户人姓名" prop='name'>
					<el-input v-model="bankForm.name" class='small-el-input' placeholder='请输入开户人姓名'></el-input>
				</el-form-item>
			</el-form>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="bankFormVisible=false">取消</el-button>
				<el-button type="primary" @click.native="bankSubmit" :loading="addLoading">确认退款</el-button>
			</div>
		</el-dialog>
		
		

	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getBankBrief, getTransactionListPage, yydFindWithdrawDepositByState, yydWithdrawDepositVerify } from '../../api/api';
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

				deposits: [],
				page2: 1,
				total2: 0,

				deposits2: [],
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
				},

				bankFormVisible: false,//新增界面是否显示
				bankFormRules: {
					bank: [
						{ required: true, message: '请输入银行', trigger: 'blur' }
					],
					account: [
						{ required: true, message: '请输入银行卡号', trigger: 'blur' }
					],
					name: [
						{ required: true, message: '请输入开户人姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				bankForm: {
					feedId: '',
					peopleName: '',
					phone: '',
					amount: 0,
					bank: '',
					account: '',
					name: ''
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
			formatDate2: function (row, column) {
				return moment(row.updated).format('YYYY-MM-DD HH:mm:ss')
			},
			formatMethod: function (row, column) {
				return (row.basic.withdrawMethod == 1)?'原路退回':'银行退款'
			},
			formatCurrency: function( num ) {
				return util.formatCurrency(num)
			},
			formatChannel(row, column ) {
				const channels = {
					'wepay': '微信支付'
				}
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
				if(this.activeName == 'p3'){
					this.getWithdrawDeposits()
				}else if(this.activeName == 'p4'){
					this.getWithdrawDeposits2()
				}
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				getBankBrief({}).then(res => {
					this.balance = res.data
				})
				getTransactionListPage({
					page: this.page,
					size: 10
				}).then(res => {
					this.listLoading = false;
					this.transactions = res.data.list
					this.total = res.data.total
				})
			},
			getWithdrawDeposits() {
				this.listLoading = true;
				yydFindWithdrawDepositByState({
					phone: this.filters.phone,
					page: this.page2,
					step: 2,
					size: 10
				}).then(res => {
					this.listLoading = false
					this.total2 = res.data.total
					this.deposits = res.data.list
				})
			},
			getWithdrawDeposits2() {
				this.listLoading = true;
				yydFindWithdrawDepositByState({
					phone: this.filters.phone,
					page: this.page3,
					step: 1,
					size: 10
				}).then(res => {
					this.listLoading = false
					this.total3 = res.data.total
					this.deposits2 = res.data.list
				})
			},
			//确认退款
			handleWithdraw: function (method, row) {
				if(method == 2){
					this.bankFormVisible = true
					this.bankForm = Object.assign({}, row.basic, {
						feedId: row.feedId,
						peopleName: row.people.name,
						amount: row.basic.amount,
						phone: row.basic.phone
					})
					return
				}
				this.$confirm(`手机号：${row.basic.phone}, 金额：${row.basic.amount} ，确认退款吗?`, '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { 
						feedId: row.feedId,
						method: method
					};
					yydWithdrawDepositVerify(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						if(res.code){
							this.$message.error(res.message)
							return
						}
						this.$message({
							message: '确认成功',
							type: 'success'
						});
						this.getWithdrawDeposits2()
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
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
			//确认退款
			bankSubmit: function () {
				this.listLoading = true;
				//NProgress.start();
				let para = { 
					feedId: this.bankForm.feedId,
					method: 2,
					bank: this.bankForm.bank,
					account: this.bankForm.account,
					name: this.bankForm.name
				};
				yydWithdrawDepositVerify(para).then((res) => {
					this.listLoading = false;
					//NProgress.done();
					this.$message({
						message: '确认成功',
						type: 'success'
					});
					this.bankFormVisible = false
					this.getWithdrawDeposits2()
				})
			},
			query2() {
				this.page2 = 1
				this.getPeopleTransactions()
			},
			queryWithdraw() {
				this.page3 = 1
				this.getWidthdraws()
			}
		},
		mounted() {
			this.getUsers();
			this.getWithdrawDeposits()
			this.getWithdrawDeposits2()
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