<template>
	<div class="overview-wrap">
		<!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getDayCountList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col> -->

		<!--列表-->
		<el-table :data="dayCountForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="balance" label="收入金额" sortable :formatter='formatMoneyTotal'>
			</el-table-column>
			<el-table-column prop="date" label="收入日期" sortable>
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
import total from '@/common/js/formatTotal'
import { dayTransaction } from '@/api/api'
export default {
	name: 'dayCount',
	data() {
		return {
			listLoading: false,
			currentPage: 1,
			total: 1,
			dayCountForm: [],
			filters: {
				name: ''
			}
		}
	},
	created() {
		this.getDayCountList();
	},
	methods: {
		getDayCountList() {
			dayTransaction({
				page: this.currentPage,
				size: 10
			}).then( res => {
				if(res.code === 0) {
					// console.log(res);
					this.dayCountForm = res.data.list
					this.total = res.data.total;
				} else {
					this.$message.error({
						message: res.message
					})
				}
			} )
		},
		formatMoneyTotal(row) {
			return total.changeAmount(row.balance?row.balance:0);
		},
		formatMoneyWepay(row) {
			return total.changeAmount(row.wepay?row.wepay:0);
		},
		formatMoneyAlipay(row) {
			return total.changeAmount(row.alipay?row.alipay:0);
		},
		// 分页
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getDayCountList();
			// console.log(val);
		},
		// 查询
		getOrders() {

		}
	}
}
</script>
<style scoped></style>