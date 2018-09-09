<template>
	<section>
		<el-tabs v-model="activeName">
			<el-tab-pane label="余额交易" name="p1">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="filters.deviceCode" placeholder="设备号"></el-input>
						</el-form-item>
						<el-form-item>
							<el-select v-model="filters.peopleId" clearable placeholder="选择代理商">
							    <el-option
							      v-for="item in allAgentList"
							      :key="item.basic.name"
							      :label="item.basic.name"
							      :value="item.extra.peopleId">
							    </el-option>
							</el-select>
						</el-form-item>
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
						<el-form-item>
							<el-button type="primary" v-on:click="query">查询</el-button>
							<el-button v-on:click="report(1)">生成报表</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!--列表-->
				<el-table :data="batterys" highlight-current-row v-loading="listLoading" style="width: 100%;">
					<el-table-column type="index" width="60">
					</el-table-column>
					<el-table-column prop="basic.tradeNo" label="充电单号" width="300" ></el-table-column>
					<el-table-column prop="basic.deviceCode" label="设备编号" width="250">
					</el-table-column>
					<el-table-column prop="basic.port" label="充电端口" width="120" >
					</el-table-column>
					<el-table-column prop="basic.chargeTime" label="充电时长" width="120" >
					</el-table-column>
					<el-table-column prop="basic.payFee" label="充电费用" width="120" >
					</el-table-column>
					<el-table-column prop="basic.people.name" label="用户昵称" width="180" >
					</el-table-column>
					<el-table-column prop="basic.result" label="充电状态" :formatter="formatResult" min-width="180">
					</el-table-column>
					<el-table-column prop="basic.refuseReason" label="错误状态" :formatter="formatrefuseReason" min-width="180">
					</el-table-column>
					<el-table-column prop="basic.result" label="创建时间" :formatter="formatDate" min-width="180">
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;" :current-page="page">
					</el-pagination>
				</el-col>
			</el-tab-pane>
			<el-tab-pane label="刷卡交易" name="p2">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="filters.deviceCode" placeholder="设备号"></el-input>
						</el-form-item>
						<el-form-item>
							<el-select v-model="filters.peopleId" clearable placeholder="选择代理商">
							    <el-option
							      v-for="item in allAgentList"
							      :key="item.basic.name"
							      :label="item.basic.name"
							      :value="item.extra.peopleId">
							    </el-option>
							</el-select>
						</el-form-item>
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
					    
		  			</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="query2">查询</el-button>
							<el-button v-on:click="report(2)">生成报表</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<!--列表-->
				<el-table :data="cardPays" highlight-current-row v-loading="listLoading" style="width: 100%;">
					<el-table-column type="index" width="60">
					</el-table-column>

					<el-table-column prop="basic.deviceCode" label="设备编号" width="250">
					</el-table-column>
					<el-table-column prop="basic.coin" label="投币支付" width="250" >
					</el-table-column>
					<el-table-column prop="basic.ic" label="IC卡支付" width="250" >
					</el-table-column>
					<el-table-column prop="basic.result" label="创建时间" :formatter="formatDate" min-width="180">
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total, prev, pager, next" @current-change="handleCardChange" :page-size="10" :total="cardTotal" style="float:right;" :current-page="cardPage">
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
	import { getBatteryCharge, reportCharge, getAllAgent, getAgentList } from '@/api/api'
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
				batterys: [],
				cardPays: [],
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
		        stepOptions: [{
		          value: '20',
		          label: '成功'
		        }, {
		          value: '40',
		          label: '设备拒绝服务'
		        }, {
		          value: '30',
		          label: '设备未响应'
		        }],
		        reportDownloadVisible: false,
		        reportDownloadUrl: ''
			}
		},
		created() {
			this.getBatteryChargeList();
			this.getBatteryChargeList2()
			let user = this.store.get('user');
			this.getAllAgent()
		},
		methods: {
			formatResult(row, col) {
				// console.log(row);
				switch(row.basic.result) {
					case 20: return '成功'; break;
					case 30: return '设备未响应'; break;
					case 40: return '设备拒绝服务'; break;
					default: return '未知状态';
				}
			},
			formatrefuseReason(row, col) {
				// console.log(row);
				switch(row.basic.refuseReason) {
					case 11: return '充电站故障'; break;
					case 12: return '端口已经被使用'; break;
					default: return '无错误信息';
				}
			},
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			// 获取所有代理商
			getAllAgent() {
				getAllAgent({}).then(res => {
					if(res.code > 0) {
						this.$message.error({
							message: res.message
						})
					}
					// console.log(res.data);
					this.allAgentList = res.data
					// console.log(res);
				})
			},
			getBatteryChargeList() {
				// console.log(this.filters.period);
				getBatteryCharge({
					deviceCode: this.filters.deviceCode,
					peopleId: this.filters.peopleId,
					startTime: (this.filters.period && this.filters.period.length == 2 && this.filters.period[0])?this.filters.period[0].valueOf():'',
					endTime: (this.filters.period && this.filters.period.length == 2 && this.filters.period[1])?this.filters.period[1].valueOf():'',
					result: this.filters.result,
					page: this.page,
					size: 10 
				}).then(res => {
					if(res.code === 0) {
						// console.log(res);
						this.batterys = res.data.list;
						this.total = res.data.total;
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			getBatteryChargeList2() {
				// console.log(this.filters.period);
				getBatteryCharge({
					deviceCode: this.filters.deviceCode,
					peopleId: this.filters.peopleId,
					startTime: (this.filters.period && this.filters.period.length == 2 && this.filters.period[0])?this.filters.period[0].valueOf():'',
					endTime: (this.filters.period && this.filters.period.length == 2 && this.filters.period[1])?this.filters.period[1].valueOf():'',
					result: this.filters.result,
					local: true,
					page: this.cardPage,
					size: 10 
				}).then(res => {
					if(res.code === 0) {
						// console.log(res);
						this.cardPays = res.data.list;
						this.cardTotal = res.data.total;
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
				this.getBatteryChargeList();
			},
			handleCardChange(val) {
				this.cardPage = val;
				this.getBatteryChargeList2();
			},
			query() {
				this.page = 1
				this.getBatteryChargeList()
			},
			query2() {
				this.page = 1
				this.getBatteryChargeList2()
			},
			report(v) {
				if(!this.filters.period || this.filters.period.length != 2){
					this.$message.warning({
						message: '请选择时间范围'
					})
					return
				}
				reportCharge({
					deviceCode: this.filters.deviceCode,
					peopleId: this.filters.peopleId,
					startTime: (this.filters.period && this.filters.period.length == 2 && this.filters.period[0])?this.filters.period[0].valueOf():'',
					endTime: (this.filters.period && this.filters.period.length == 2 && this.filters.period[1])?this.filters.period[1].valueOf():'',
					result: this.filters.result,
					local: (v==2)?true:''
				}).then( res => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.reportDownloadVisible = true
					this.reportDownloadUrl = res.data.url
				})
			}
		}
	}
</script>
<style></style>