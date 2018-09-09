<template>
	<div class="overview-wrap">
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getWithdrawal">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="withdrawalForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<!-- <el-table-column prop="withdrawId" label="订单号" width='220' sortable>
			</el-table-column> -->
			<el-table-column prop="amount" :formatter='formatMoney' label="提现金额" width='140' >
			</el-table-column>
			<el-table-column prop="basic.name" :formatter="formatName" label="提现人" width='100' >
			</el-table-column>
			<el-table-column prop="basic.phone" :formatter="formatPhone" label="提现人手机" width='140' >
			</el-table-column>
			<el-table-column prop="basic.bank" :formatter="formatBank" label="提现银行" width='120' ></el-table-column>
			<el-table-column prop="basic.account" :formatter="formatAccount" label="提现账号" ></el-table-column>
			<el-table-column prop="created" label="提现日期" :formatter="formatDate" width="180" >
			</el-table-column>
			<el-table-column prop="step" label="状态" width="100" :formatter='formatStep'>
				<template scope="scope">
					<el-tag type="danger" v-if='scope.row.step==1'>提现中</el-tag>
					<el-tag type="success" v-else>已提现</el-tag>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" :page-size="10" @current-change="handleCurrentChange" style="float:right;" :total="total" :current-page="currentPage">
			</el-pagination>
		</el-col>
		
	</div>
</template>
<script>
	import { getWithdrawList, setWithdrawApprove } from '@/api/api'
	import moment from 'moment'
	export default {
		name: 'withdrawal',
		data() {
			return {
				listLoading: false,
				currentPage: 1,
				total: 1,
				withdrawalForm: [],
				filters: {
					name: ''
				}
			}
		},
		created() {
			this.getWithdrawal();
		},
		computed: {
			reChage() {
				return this.$store.getters.getWithdraw
			}
		},
		methods: {
			// 过滤状态
			formatStep(row, column) {
				return row.step == 1? '提现中': row.step == 2? '已提现': '未知状态'
			},
			// 过滤时间
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatName(row, column) {
				return row.basic.name?row.basic.name:'无'
			},
			formatPhone(row, column) {
				return row.basic.phone?row.basic.phone:'无'
			},
			formatBank(row, column) {
				// console.log(row);
				return row.basic.bank?row.basic.bank:'无'
			},
			formatAccount(row, column) {
				return row.basic.account?row.basic.account:'无'
			},
			formatMoney(row, column) {
				return row.amount.toFixed(2);
			},
			getWithdrawal() {
				getWithdrawList({
					phone: this.filters.name,
					direction: 2,
					page: this.currentPage,
					size: 10
				}).then(res => {
					if(res.code === 0) {
						this.withdrawalForm = res.data.list;
						this.total = res.data.total;
					} else {
						this.$message.error({
							message: res.message
						})
					}
					// console.log(res.data);
				})
			},
			// 过滤行样式
			tableRowClassName(row, index) {
				// console.log(row);
				if(row.step == 1) {
					return 'no-pass'
				} else {
					return ''
				}
			},
			// 分页
			handleCurrentChange(val) {
				// console.log(val);
				this.currentPage = val;
				this.getWithdrawal();
			},
			// 查询
			getOrders() {

			}
		}
	}
</script>
<style scoped>
.el-table .no-pass {
   color: #f00!important;
}
</style>