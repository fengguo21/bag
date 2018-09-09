<template>
	<div class="overview-wrap">
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
				<el-date-picker
			      v-model="filters.period"
			      type="datetimerange"
			      :picker-options="pickerOptions"
			      placeholder="选择时间范围"
			      align="right">
			    </el-date-picker>
				</el-form-item>
				<el-form-item>
				<el-select style='width: 100%' v-model="filters.branchId" placeholder="请选择收款窗口">
		      <el-option :label="item.label" :value="item.value" v-for='(item, key) in branchOptions' :key='key'></el-option>
		    </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="query">查询</el-button>
					<el-button @click="report">生成报表</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="incomeForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="transactionId" label="订单号" width='250' sortable>
			</el-table-column>
			<el-table-column prop="amount" label="收款金额" width='200' sortable :formatter='formatMoney'>
			</el-table-column>
			<el-table-column prop="basic.channel" label="支付方式" width='200' :formatter='formatChannel' sortable>
			</el-table-column>
			<el-table-column prop="basic.name" label="付款人姓名" width='200'>
			</el-table-column>
			<el-table-column prop="basic.text" label="备注" width='250'>
			</el-table-column>
			<el-table-column prop="branch.title" label="收款窗口">
			</el-table-column>
			<el-table-column prop="created" label="收款日期" :formatter="formatDate" width="200" sortable>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" :page-size="10" @current-change="handleCurrentChange" style="float:right;" :total="total" :current-page="currentPage">
			</el-pagination>
		</el-col>
		<!-- 打印报表窗口 -->
		<el-dialog title="生成报表" v-model="reportVisible">
		  <el-form :model="reportForm" :rules='reportRules' label-width="140px" ref="reportForm">
				<el-form-item label="时间范围" prop="period">
				<el-date-picker
			      v-model="reportForm.period"
			      type="datetimerange"
			      :picker-options="pickerOptions"
			      placeholder="选择时间范围"
			      align="right">
			    </el-date-picker>
				</el-form-item>
				<el-form-item label="收款窗口">
				<el-select v-model="reportForm.branchId" placeholder="请选择收款窗口">
		      <el-option :label="item.label" :value="item.value" v-for='(item, key) in branchOptions' :key='key'></el-option>
		    </el-select>
				</el-form-item>
				<el-form-item label="收银员" prop="checkedRoles">
				<el-checkbox :indeterminate="reportForm.isIndeterminate" v-model="reportForm.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				  <div style="margin: 15px 0;"></div>
				  <el-checkbox-group v-model="reportForm.checkedRoles" @change="handleCheckedRolesChange">
				    <el-checkbox v-for="city in reportForm.roles" :label="city.label" :key="city.key">{{city.label}}</el-checkbox>
				  </el-checkbox-group>
				</el-form-item>
				
		   
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="reportVisible = false">取 消</el-button>
		    <el-button @click="submitReport(1)">下 载</el-button>
		    <el-button type="primary" @click="submitReport(2)">打 印</el-button>
		  </div>
		</el-dialog>
		<!-- 报表下载窗口 -->
		<el-dialog
		  title="资金报表下载"
		  :visible.sync="dialogVisible"
		  size="tiny">
		  <span>下载地址：<a :href="reportDownloadUrl">{{reportDownloadUrl}}</a></span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">关闭</el-button>
		  </span>
		</el-dialog>
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
				total: 1,
				incomeForm: [],
				branchOptions: [{
					label: '全部',
					value: ''
				}],
				filters: {
					name: '',
					period: '',
					branchId: ''
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
        },
        	reportVisible: false,
        	reportForm: {
        		period: '',
        		branchId: '',
        		roles: [],
        		checkAll: false,
        		checkedRoles: [],
        		isIndeterminate: true
        	},
        	reportRules: {
					period: [
						{ required: true, message: '请输入时间范围', trigger: 'blur' },
						{ validator(r, v, b){(v.length==2)?b():b(new Error('请输入时间范围'))}}
					],
					checkedRoles: [
						{ required: true, message: '请选择收银员', trigger: 'blur' },
						{ validator(r, v, b){console.log('checkv', v);(v.length>0)?b():b(new Error('请选择收银员'))}}
					],
				},
				dialogVisible: false,
				reportDownloadUrl: ''
			}
		},
		created() {
			this.getIncome();
			getAllBranch({
				page: 1,
				size: 100
			}).then(res => {
				if(res.code === 0) {
					// console.log(res.data.list);
					res.data.list.forEach(item => {
						if(item.step == 1) {
							let branchItem = {};
							branchItem.label = item.basic.title;
							branchItem.value = item.branchId;
							this.branchOptions.push(branchItem);
						}	
					})
					// console.log(res);
				} else {
					this.$message.error({
						message: res.message
					})
				}
			})
			
		},
		methods: {
			handleCheckAllChange(event) {
		        this.reportForm.checkedRoles = event.target.checked ? this.reportForm.roles.map(e => e.label) : [];
		        this.reportForm.isIndeterminate = false;
		      },
	      handleCheckedRolesChange(value) {
	        let checkedCount = value.length;
	        this.reportForm.checkAll = checkedCount === this.reportForm.roles.length;
	        this.reportForm.isIndeterminate = checkedCount > 0 && checkedCount < this.reportForm.roles.length;
	      },
			getIncome() {
				let startTime = ''
				let endTime = ''
				if(this.filters.period.length && this.filters.period[0] && this.filters.period[1]){
					startTime = (this.filters.period[0]).getTime()
					endTime = (this.filters.period[1]).getTime()
				}
				getTransactionListPage({
					branchId: this.filters.branchId,
					startTime: startTime,
					endTime: endTime,
					page: this.currentPage,
					size: 10
				}).then(res => {
					if(res.code === 0) {
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
				return total.changeAmount(row.amount);
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
			// 查询
			query() {
				this.currentPage = 1
				this.getIncome()
			},
			// 生成报表 
			report() {
				this.reportForm = {
					period: '',
        			branchId: '',
	        		checkAll: false,
	        		roles: [],
	        		checkedRoles: [],
	        		isIndeterminate: true
				}
				getAllRole({
					page: 1,
					size: 100
				}).then(res => {
					if(res.code === 0) {
						// console.log(res.data.list);
						this.reportForm.roles = res.data.list.map(e => ({
							label: e.basic.name,
							key: e.peopleId
						}))
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
				this.reportVisible = true
				
			},
			submitReport(v) {
				//this.$refs.reportForm.validate((valid) => {
					

				const para = {
					branchId: this.reportForm.branchId,
					flag: v
				}
				const idList = []
				this.reportForm.roles.forEach(e => {
					this.reportForm.checkedRoles.forEach( c => {
						if(c == e.label)
							idList.push(e.key)
					})
				})
				para.idList = idList.join(',')

				let startTime = ''
				let endTime = ''
				if(this.reportForm.period.length && this.reportForm.period[0] && this.reportForm.period[1]){
					startTime = (this.reportForm.period[0]).getTime()
					endTime = (this.reportForm.period[1]).getTime()
				}
				para.startTime = startTime
				para.endTime = endTime
				console.log(para)
				if(!para.startTime || !para.endTime){
					this.$message.warning({
						message: '请选择时间范围'
					})
					return
				}else if(para.idList.length == 0){
					this.$message.warning({
						message: '请选择收银员'
					})
					return
				}
				if(this.submiting){
					this.$message.warning({
						message: '正在提交中，请稍后再试'
					})
					return
				}
				this.submiting = true
				reportTransaction(para).then(res => {
					this.submiting = false
					if(res.code === 0) {
						console.log(res)
						if(v == 1){
							this.reportVisible = false
							this.dialogVisible = true
							this.reportDownloadUrl = res.data.url
						 }else if(v == 2){
						 	this.myPrint(res.data)
						 }
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
				//})
			},
			// 打印报表
			myPrint(data) {
				const newWindow = window.open("_blank")
				let html = '<title>打印报表</title>'
				html += `
					<style>
					h2{
						margin: 0;
						font-size: 19px;
						margin-bottom: 5px;
					}
					table {
						width: 100%;
						font-family: verdana,arial,sans-serif;
						font-size:11px;
						color:#333333;
						border-width: 1px;
						border-color: #666666;
						border-collapse: collapse;
					}
					table th {
						border-width: 1px;
						padding: 8px;
						border-style: solid;
						border-color: #666666;
						background-color: #dedede;
					}
					table td {
						border-width: 1px;
						padding: 8px;
						border-style: solid;
						border-color: #666666;
						background-color: #ffffff;
					}
					</style>
				`
				html += '<table>'
				let flag = 1
				data.forEach( e => {
					if(!e[0] && flag){
						html += '</table>'
						html += '<p></p>'
						flag = 0
					}else if(!e[0]){

					}else if(flag == 0){
						flag = 1
						html += '<table>'
						html += '<tr>'
						e.forEach( p => {
							html += '<td>'+p+'</td>'
							console.log(p)
						})
						html += '</tr>'
					}else {
						
						html += '<tr>'
						e.forEach( p => {
							html += '<td>'+p+'</td>'
							console.log(p)
						})
						html += '</tr>'
					}
				})
				html += '</table>'
				newWindow.document.write(html)
				    newWindow.document.close()
				    newWindow.print()
				    return true
			}	 
			
		}
	}
</script>
<style scoped>
</style>