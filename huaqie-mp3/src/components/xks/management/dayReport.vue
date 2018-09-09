<template>
	<div class="overview-wrap">
		<div class="report-box">
		<el-row>
		<el-col :span="6">
		<h3><span class="mini-title">日期</span> {{today}}</h3>
		</el-col>
		<el-col :span="6">
		<h3><span class="mini-title">总收款</span> ¥{{formatMoney2(report1[0])}}</h3>
		</el-col>
		<el-col :span="6">
		<h3><span class="mini-title">微信收款</span> ¥{{formatMoney2(report1[1])}}</h3>
		</el-col>
		<el-col :span="6">
		<h3><span class="mini-title">支付宝收款</span> ¥{{formatMoney2(report1[2])}}</h3>
		</el-col>
		</el-row>
		</div>

		<!--列表-->
		<el-table :data="report2" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="amount" label="收款金额" width='200' sortable :formatter='formatMoney'>
			</el-table-column>
			<el-table-column prop="basic.channel" label="支付方式" width='200' sortable>
			</el-table-column>
			<el-table-column prop="basic.name" label="付款人姓名" width='200'>
			</el-table-column>
			<el-table-column prop="basic.text" label="备注" width='250'>
			</el-table-column>
			<el-table-column prop="branch.title" label="收款窗口">
			</el-table-column>
			<el-table-column prop="created" label="收款日期"  width="200" sortable>
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
	import { getTransactionListPage, reportTransaction, getAllBranch, getAllRole } from '@/api/api'
	import session from 'store'
	import moment from 'moment'
	export default {
		name: 'income',
		data() {
			return {
				submiting: false,
				listLoading: false,
				currentPage: 1,
				total: 0,
				incomeForm: [],
				today: moment().format('YYYY年MM月DD日'),
				report1: [],
				report2: [],
				
        	reportVisible: false,
        	reportForm: {
        		period: '',
        		branchId: '',
        		roles: [],
        		checkAll: false,
        		checkedRoles: [],
        		isIndeterminate: true
        	},
        	
				dialogVisible: false,
				reportDownloadUrl: ''
			}
		},
		created() {
			this.getReport()
			
		},
		methods: {
			
			
			// 过滤时间
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatMoney2(money) {
				return (money)?money.toFixed(2):0;
			},
			formatMoney(row, column) {
				return (row.amount)?row.amount.toFixed(2):0;
			},
			formatChannel(row, column) {
				let channel = '其他'
				if(row.basic.channel == 'wepay')
					channel = '微信支付'
				else if(row.basic.channel == 'alipay')
					channel = '支付宝支付'
				return channel;
			},
			// 分页
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getIncome();
				// console.log(val);
			},
			
			getReport() {
				//this.$refs.reportForm.validate((valid) => {
					

				const para = {
					branchId: this.reportForm.branchId,
					flag: 2,
					idList: session.get('user').peopleId
				}
				

				
				para.startTime = moment(moment().format('YYYY-MM-DD 00:00:00')).valueOf()
				para.endTime = moment().valueOf()
				
				this.submiting = true
				reportTransaction(para).then(res => {
					this.submiting = false
					if(res.code === 0) {
						console.log(res)
						if(res.data.length < 6)
							return
						this.report1 = res.data[6]
						if(res.data.length < 9)
							return
						for(let i = 9; i < res.data.length; i++){
							if(!res.data[i][0])
								break
							this.report2.push({
								amount: res.data[i][0],
								basic: {
									channel: res.data[i][1],
									name: res.data[i][2],
									text: res.data[i][3]	
								},
								branch: {
									title: res.data[i][4]
								},
								created: res.data[i][5]
							})
							this.total += 1
						}
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			}
		}
	}
</script>
<style scoped>
.report-box{
	margin-bottom: 20px;
	border: 1px solid #bbb;
	border-radius: 10px;
	padding: 20px;
}
.mini-title{
	color: #999999;
	margin-right: 10px;
}
</style>