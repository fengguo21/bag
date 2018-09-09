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
    	<div class="reportBox">
    	<span style="margin-right: 20px">{{ startDate }} ~ {{ endDate }}</span>
    	 <el-date-picker
      v-model="reportDate"
      type="daterange"
      align="right"
      placeholder="选择日期范围"
      @change="changeDate"
      :picker-options="pickerOptions">
    </el-date-picker>
    
    </div>
    	<div id="chartLine" style="width:100%; height:400px;"></div>
    </el-tab-pane>
    <el-tab-pane label="收入明细" name="p2">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.orderId" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker
				      v-model="filters.period"
				      type="datetimerange"
				      :picker-options="pickerOptions"
				      placeholder="支付时间"
				      align="right">
				    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
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
	import { getBankBrief, getTransactionListPage, getDayTransactionListPage, getPeopleTransactionListPage, getWithdrawList, setWithdrawApproveMMD } from '../../api/api';
	import moment from 'moment'
	import echarts from 'echarts'

	export default {
		data() {
			return {
				balance: {},
				filters: {
					name: '',
					period: ''
				},
				 pickerOptions: {
		          shortcuts: [{
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
				},

				days: [],
				trades: [],
				reportDate: '',
				startDate: '',
				endDate: ''
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
				this.getTransactions();
			},
			handleClick() {

			},
			//获取用户列表
			getTransactions() {
				let para = {
					orderId: this.filters.orderId,
					page: this.page,
					size: 10
				}
				if(this.filters.period && this.filters.period.length == 2){
					para.startTime = (this.filters.period[0])?this.filters.period[0].valueOf():''
					para.endTime = (this.filters.period[1])?this.filters.period[1].valueOf():''
				}

				this.listLoading = true;
				getTransactionListPage(para).then(res => {
					this.listLoading = false;
					this.transactions = res.data.list
					this.total = res.data.total
				})
			},
			query() {
				console.log(this.filters.period)
				this.page = 1
				this.getTransactions()
			},
			drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: '收入'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['收入']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.days
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                            name: '收入',
                            type: 'line',
                            smooth: true,
                            data: this.trades,
                            symbol: 'circle',
                            symbolSize: 9,
                            itemStyle: {
                                normal: {
                                    color: '#ef4227'
                                }
                            }
                        }
                    ]
                });
            },
            updateReport() {
            	getDayTransactionListPage({
					startDate: this.startDate,
					endDate: this.endDate,
					page: 1,
					size: 100000000000
				}).then(res => {
					res.data.list.reverse()
					this.days = []
					this.trades = []
					res.data.list.forEach(e => {
						this.days.push(e.date),
						this.trades.push(e.balance)
					})
					this.drawLineChart()
				})
			},
            changeDate() {
            	if(this.reportDate.length == 2 && this.reportDate[0] && this.reportDate[1]){
            		this.startDate = moment(this.reportDate[0]).format('YYYY-MM-DD')
            		this.endDate = moment(this.reportDate[1]).format('YYYY-MM-DD')
            		this.updateReport()
            	}else{
            		this.startDate = moment().subtract(30, 'days').format('YYYY-MM-DD')
					this.endDate = moment().format('YYYY-MM-DD')
            		this.updateReport()
            	}
            }
		},
		mounted() {
			getBankBrief({}).then(res => {
				this.balance = res.data
			})
			this.startDate = moment().subtract(30, 'days').format('YYYY-MM-DD')
			this.endDate = moment().format('YYYY-MM-DD')
			this.updateReport()
			this.getTransactions()
		}
	}

</script>

<style scoped>
.reportBox{
	border-top: 1px solid #e3e3e3;
	padding-top: 20px;
	margin-top: 20px;
	margin-bottom: 0px;
	text-align: right;
}
.brief h3{
	font-size: 19px;
}
.brief p{
	color: #333333;
}
</style>