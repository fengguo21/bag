<template>
	<section>
		<el-tabs v-model="activeName">
			<el-tab-pane label="借出" name="p1">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="filters.boxDeviceCode" placeholder="柜子编号"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="filters.deviceCode" placeholder="器材编号"></el-input>
						</el-form-item>
						<!--
						<el-form-item>
						<el-date-picker
					      v-model="filters.period"
					      type="datetimerange"
					      :picker-options="periodOptions"
					      placeholder="选择时间范围"
					      align="right">
					    </el-date-picker>
					    </el-form-item>
					    <el-form-item>
					    
					    <el-select v-model="filters.result" clearable placeholder="请选择充电状态">
					    <el-option
					      v-for="item in stepOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					  
		  			</el-form-item>
		  			-->
						<el-form-item>
							<el-button type="primary" v-on:click="query">查询</el-button>
							<!--<el-button v-on:click="report(1)">生成报表</el-button>-->
						</el-form-item>
					</el-form>
				</el-col>
				<!--列表-->
				<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
					<el-table-column type="index" width="60">
					</el-table-column>
					<el-table-column label="头像" width="120">
						<template scope="scope">
							<img :src="scope.row.people.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
						</template>
					</el-table-column>
					<el-table-column prop="people.name" label="用户昵称" width="150" ></el-table-column>
					<el-table-column prop="basic.phone" label="用户手机号" width="150" ></el-table-column>
					<el-table-column prop="basic.deviceCode" label="器材编号" width="150">
					</el-table-column>
					<el-table-column prop="basic.equipment.title" label="器材名称" width="150">
					</el-table-column>
					<el-table-column prop="basic.boxDeviceCode" label="柜子编号" width="150" >
					</el-table-column>
					<el-table-column prop="basic.cellNo" label="格子编号" width="150" >
					</el-table-column>
					
					<el-table-column prop="basic.price" label="租用价格" width="150" >
					</el-table-column>
					<el-table-column prop="basic.created" label="借出时间" :formatter="formatDate" min-width="180">
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;" :current-page="page">
					</el-pagination>
				</el-col>
			</el-tab-pane>
			<el-tab-pane label="归还" name="p2">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="filters.boxDeviceCode" placeholder="柜子编号"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="filters.deviceCode" placeholder="器材编号"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="query2">查询</el-button>
							<!--<el-button v-on:click="report(2)">生成报表</el-button>-->
						</el-form-item>
					</el-form>
				</el-col>
				<!--列表-->
				<el-table :data="list2" highlight-current-row v-loading="listLoading" style="width: 100%;">
					<el-table-column type="index" width="60">
					</el-table-column>
					<el-table-column label="头像" width="120">
						<template scope="scope">
							<img :src="scope.row.people.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
						</template>
					</el-table-column>
					<el-table-column prop="people.name" label="用户昵称" width="150" ></el-table-column>
					<el-table-column prop="basic.phone" label="用户手机号" width="150" ></el-table-column>
					<el-table-column prop="basic.deviceCode" label="器材编号" width="150">
					</el-table-column>
					<el-table-column prop="basic.equipment.title" label="器材名称" width="150">
					</el-table-column>
					<el-table-column prop="basic.boxDeviceCode" label="柜子编号" width="150" >
					</el-table-column>
					<el-table-column prop="basic.cellNo" label="格子编号" width="150" >
					</el-table-column>
					<el-table-column prop="created" label="租用时长" width="150" :formatter="formatPeriod" >
					</el-table-column>
					<el-table-column prop="basic.price" label="租用价格" width="150" >
					</el-table-column>
					<el-table-column prop="basic.result" label="借出时间" :formatter="formatDate2" min-width="180">
					</el-table-column>
					<el-table-column prop="basic.result" label="归还时间" :formatter="formatDate" min-width="180">
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange2" :page-size="10" :total="total2" style="float:right;" :current-page="page2">
					</el-pagination>
				</el-col>
			</el-tab-pane>
		</el-tabs>
		
		
		<!-- 报表下载窗口 -->
		<el-dialog
		  title="充电报表下载"
		  :visible.sync="reportDownloadVisible"
		  size="tiny">
		  <span>下载地址：<a :href="reportDownloadUrl">{{reportDownloadUrl}}</a></span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="reportDownloadVisible = false">关闭</el-button>
		  </span>
		</el-dialog>
	</section>
</template>
<script>
	import { yydFindBorrowRestoreByState } from '@/api/api'
	import moment from 'moment'
	export default {
		name: 'chargeRecord',
		filters: {
			filterTradeNo(val) {
				return val.match(/\d/g).join('');
			}
		},
		data() {
			return {
				cardTotal: 0,
				cardPage: 1,
				activeName: 'p1',
				filters: {
					deviceCode: '',
					peopleId: '',
					result: '',
					period: ''
				},
				allAgentList: [],
				page: 1,
				total: 0,
				page2: 1,
				total2: 0,
				list: [],
				list2: [],
				listLoading: false,
				 periodOptions: {
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
		        reportDownloadVisible: false,
		        reportDownloadUrl: ''
			}
		},
		created() {
			this.getBorrowRestoreList()
			this.getBorrowRestoreList2()
		},
		methods: {
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatDate2(row, column) {
				return moment(row.basic.borrowTime).format('YYYY-MM-DD HH:mm:ss')
			},
			formatPeriod(row, column) {
				const hours = moment(row.basic.borrowTime).diff(moment(row.created), 'h')
				return hours+'小时'
			},
			getBorrowRestoreList() {
				// console.log(this.filters.period);
				yydFindBorrowRestoreByState({
					deviceCode: this.filters.deviceCode,
					peopleId: this.filters.peopleId,
					startTime: (this.filters.period && this.filters.period.length == 2 && this.filters.period[0])?this.filters.period[0].valueOf():'',
					endTime: (this.filters.period && this.filters.period.length == 2 && this.filters.period[1])?this.filters.period[1].valueOf():'',
					result: this.filters.result,
					direction: 1,
					page: this.page,
					size: 10 
				}).then(res => {
					if(res.code === 0) {
						this.list = res.data.list;
						this.total = res.data.total;
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			getBorrowRestoreList2() {
				// console.log(this.filters.period);
				yydFindBorrowRestoreByState({
					deviceCode: this.filters.deviceCode,
					peopleId: this.filters.peopleId,
					startTime: (this.filters.period && this.filters.period.length == 2 && this.filters.period[0])?this.filters.period[0].valueOf():'',
					endTime: (this.filters.period && this.filters.period.length == 2 && this.filters.period[1])?this.filters.period[1].valueOf():'',
					result: this.filters.result,
					direction: 2,
					page: this.page2,
					size: 10 
				}).then(res => {
					if(res.code === 0) {
						this.list2 = res.data.list;
						this.total2 = res.data.total;
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.getBorrowRestoreList();
			},
			// 分页
			handleCurrentChange2(val) {
				this.page2 = val;
				this.getBorrowRestoreList2();
			},
			query() {
				this.page = 1
				this.getBorrowRestoreList()
			},
			query2() {
				this.page2 = 1
				this.getBorrowRestoreList2()
			}
		}
	}
</script>
<style></style>