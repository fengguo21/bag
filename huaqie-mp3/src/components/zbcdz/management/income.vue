<template>
	<div class="overview-wrap">
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="filters.channel" clearable placeholder="请选择">
					    <el-option
					      v-for="item in channelOptions"
					      :label="item.label"
					      :value="item.value"
						  :key='item.value'
					    >
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getIncome">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="incomeForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.orderId" label="订单号" width='250' >
			</el-table-column>
			<el-table-column prop="amount" label="收入金额" width='200'  :formatter='formatMoney'>
			</el-table-column>
			<el-table-column prop="basic.channel" label="支付方式">
				<template scope='scope'>
					<el-tag :type='scope.row.basic.channel=="wepay"?"success":scope.row.basic.channel=="alipay"?"primary":"gray"'>{{scope.row.basic.channel|filterPayStyle}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="basic.text" label="备注">
			</el-table-column>
			<el-table-column prop="created" label="收入日期" :formatter="formatDate" width="200">
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
	import { getTransactionListPage } from '@/api/api'
	import moment from 'moment'
	export default {
		name: 'income',
		data() {
			return {
				listLoading: false,
				currentPage: 1,
				total: 1,
				incomeForm: [],
				filters: {
					name: '',
					channel: ''
				},
				channelOptions: [
					{
						label: '微信支付',
						value: 'wepay'
					},
					{
						label: '支付宝支付',
						value: 'alipay'
					},
					{
						label: '等待支付',
						value: 'unkown'
					}
				]
			}
		},
		filters: {
			filterPayStyle(val) {
				switch(val) {
					case 'wepay': return '微信支付'; break;
					case 'alipay': return '支付宝支付'; break;
					default: return '等待支付';
				}
			},
		},
		created() {
			this.getIncome();
		},
		methods: {
			getIncome() {
				getTransactionListPage({
					orderId: this.filters.name,
					channel: this.filters.channel,
					page: this.currentPage,
					size: 10
				}).then(res => {
					if(res.code === 0) {
						// console.log(res.data.list);
						this.incomeForm = res.data.list;
						this.total = res.data.total
					} else {
						this.$message.error({
							message: res.message
						})
					}
					// console.log(res);
				})
			},
			// 过滤时间
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatMoney(row, column) {
				return row.amount.toFixed(2);
			},
			// 分页
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getIncome();
				// console.log(val);
			},
			// 查询
			getOrders() {

			}
		}
	}
</script>
<style scoped>
</style>