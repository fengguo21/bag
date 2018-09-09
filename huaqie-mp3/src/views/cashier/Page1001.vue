<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
			<el-form-item>
					<el-select v-model="filters.step" clearable placeholder="选择订单状态">
					    <el-option
					      v-for="item in stepOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					  <el-select v-model="filters.peopleId" clearable placeholder="请选择收银员">
					    <el-option
					      v-for="item in roleOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					  </el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="dataForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			
			<el-table-column label='标题' prop='basic.title' width='200'>
			</el-table-column>
			<el-table-column label='总金额' prop='extra.total' :formatter='formatTotal' width="150">
			</el-table-column>
			<el-table-column label='支付方式' prop='channel' :formatter='formatChannel' width="200">
			</el-table-column>
			<el-table-column label='收银员' prop='people.name' width="200">
			</el-table-column>
			<el-table-column label='订单状态' width="100">
				<template scope='scope'>
					<div :class="[{'step-open': scope.row.step == 4},{'step-close': scope.row.step == 1}]">
			            {{ scope.row.step|filterStep }}
			        </div>
				</template>
			</el-table-column>
			<el-table-column label='创建时间' prop='created' :formatter="formatDate">
			</el-table-column>
			<el-table-column label="操作" width='200'>
		      <template scope="scope">
		        <!--
		        <el-button
		          size="small"
		          type="primary"
		          v-if="scope.row.step == 1"
		          @click="handleRetry(scope.row)">重新收款</el-button>
		          -->
		          <el-button
		          size="small"
		          type="danger"
		          v-if="scope.row.step == 1"
		          @click="handleCancel(scope.row)">取消</el-button>
		      </template>
		    </el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;" :current-page="page">
			</el-pagination>
		</el-col>
	</section>
</template>
<script>
	import moment from 'moment'
	import total from '@/common/js/formatTotal'
	import { getOrderListPage, cancelOrder, getAllRole } from '@/api/api'
	import session from 'store'

	export default {
		name: 'Order',
		data () {
			return {
				filters: {
					step: '',
					peopleId: ''
				},
				total: 0,
				page: 1,
				listLoading: false,
				dataForm: [],
				stepOptions: [ {
		          value: '1',
		          label: '待付款'
		        }, {
		          value: '4',
		          label: '已完成'
		        }, {
		          value: '6',
		          label: '已取消'
		        }],
		        roleOptions: []
			}
		},
		filters: {
			filterStep(val) {
				switch(val) {
					case 1: return '待付款'; break;
					case 2: return '待发货'; break;
					case 3: return '待收货'; break;
					case 4: return '已完成'; break;
					case 5: return '已退款'; break;
					case 6: return '已取消'; break;
					default: return '未知状态';
				}
			}
		},
		methods: {
			// 支付方式显示转换
			formatChannel(row, column) {
				// console.log(row.channel);
				switch(row.channel) {
					case 'alipay.qr': return '支付宝扫码支付'; break; 
					case 'wepay.native': return '微信扫码支付'; break;
					case 'alipay.micro' : return '支付宝条码支付'; break;
					case 'wepay.micro' : return '微信条码支付'; break;
					case 'alipay.web' : return '窗口支付（支付宝）'; break;
					case 'wepay.wap' : return '窗口支付（微信）'; break;
					default: return '其他';
				}
			},
			//时间显示转换
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			// 金额加,分隔
			formatTotal(row, col) {
				return total.changeAmount(row.extra.total);
			},
			getOrder() {
				const me = session.get('user')
				const level = me.role.level
				getOrderListPage({
					peopleId: (level > 1)?me.peopleId:this.filters.peopleId,
					step: this.filters.step,
					name: this.filters.name,
					page: this.page,
					size: 10
				}).then(res => {
					if(res.code === 0) {
						// console.log(res.data.list);
						this.dataForm = res.data.list;
						this.total = res.data.total
					} else {
						this.$message.error({
							message: res.message
						})
					}
					// console.log(res)
				})
			},
		// 表格操作
			// 分页
			handleCurrentChange(val) {
				this.page=val;
				this.getOrder();
			},
			// 搜索
			query() {
				this.page = 1
				this.getOrder();
			},
			handleRetry(order) {
				this.$confirm(`重新收款会取消当前订单：${order.basic.title},${order.basic.name}，确定继续？`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
			   		/******** todos *******/ 
			   		cancelOrder({
		        		orderId: order.orderId
		        	}).then( res => {
		        		if(res.code){
		        			this.$message({
					            type: 'error',
					            message: res.message
					        }); 
					        return
		        		}
		        		this.$message({
				            type: 'success',
				            message: '已取消订单'
				        });  
				        this.$router.push({path: '/xks/page1000', query:{orderId: order.orderId}})
		        	})
					  
		        }).catch(() => {
		        	  this.$message({
			            type: 'info',
			            message: '已取消删除'
			          });  
		        });
			},
			handleCancel(order) {
				this.$confirm('确定要取消订单：'+order.basic.title+','+order.basic.name+' ?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
			   		/******** todos *******/ 
			   		cancelOrder({
		        		orderId: order.orderId
		        	}).then( res => {
		        		if(res.code){
		        			this.$message({
					            type: 'error',
					            message: res.message
					        }); 
					        return
		        		}
		        		this.$message({
				            type: 'success',
				            message: '已取消订单'
				        });  
				        this.getOrder();   
		        	})
					  
		        }).catch(() => {
		        	  this.$message({
			            type: 'info',
			            message: '已取消删除'
			          });  
		        });
			}
		},
		created() {
			this.getOrder();
			getAllRole({
				page: 1,
				size: 10000
			}).then( res => {
				console.log(res)
				if(!res.data)
					return
				this.roleOptions = res.data.list.map(e => ({
					label: e.basic.name,
					value: e.peopleId
				}))
			})
		}
	}
</script>
<style scoped>
.step-open {
	color: #13CE66;
}
.step-close {
	color: #FF4949
}	
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>