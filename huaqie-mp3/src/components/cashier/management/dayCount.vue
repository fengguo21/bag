<template>
	<div class="overview-wrap">
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-date-picker
			      v-model="filters.period"
			      type="daterange"
			      :picker-options="pickerOptions"
			      placeholder="选择日期范围"
			      align="right">
			    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="dayCountForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="balance" label="收入金额"  :formatter='formatMoneyTotal'>
			</el-table-column>
			<el-table-column prop="wepay" label="微信支付" :formatter='formatMoneyWepay'>
			</el-table-column>
			<el-table-column prop="alipay" label="支付宝支付"  :formatter='formatMoneyAlipay'>
			</el-table-column>
			<el-table-column prop="date" label="收入日期" >
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
import moment from 'moment'

export default {
	name: 'dayCount',
	data() {
		return {
			listLoading: false,
			currentPage: 1,
			total: 0,
			dayCountForm: [],
			filters: {
				period: ''
			},
			 pickerOptions: {
          shortcuts: [{
            text: '昨天',
            onClick(picker) {
              const end = new Date(moment().subtract(1, 'd').format('YYYY-MM-DD 23:59:59'));
              const start = new Date(moment().subtract(1, 'd').format('YYYY-MM-DD 00:00:00'));
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date(moment().format('YYYY-MM-DD 00:00:00'));
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
		}
	},
	created() {
		this.getDayCountList();
	},
	methods: {
		getDayCountList() {
			let startDate = ''
			let endDate = ''
			if(this.filters.period.length && this.filters.period[0] && this.filters.period[1]){
				startDate = moment(this.filters.period[0]).format('YYYY-MM-DD')
				endDate = moment(this.filters.period[1]).format('YYYY-MM-DD')
			}
			dayTransaction({
				startDate: startDate,
					endDate: endDate,
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
		query() {
			this.page = 1
			this.getDayCountList()
		}
	}
}
</script>
<style scoped></style>