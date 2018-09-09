<template>
	<div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="提现ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="withdraw" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="amount" label="提现金额" sortable>
			</el-table-column>
			<el-table-column prop="peopleId" label="提现人" sortable>
			</el-table-column>
			<el-table-column prop="step" label="提现状态" sortable>
				<template scope="scope">
			        <el-tag
			         :type="scope.row.step == '1' ? 'danger' : 'success'"
			         close-transition>{{scope.row.step|filterStep}}</el-tag>
			    </template>
			</el-table-column>
			<el-table-column prop="created" :formatter='formatDate' label="提现时间" min-width="180" sortable>
			</el-table-column>
			
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" type='primary' @click="handleEdit(scope.$index, scope.row)">审核</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</div>
</template>
<script>
import { getWithdrawList, setWithdrawApproveMMD } from '@/api/api'
import moment from 'moment'
export default {
	data() {
		return {
			filters: {
				name:''
			},
			page: 1,
			total: 0,
			listLoading: false,
			withdraw: []
		}
	},
	created() {
		this.getWithdrawList()
	},
	filters: {
		filterStep(val) {
			return val == '1'? '提现中': '已提现'
		}
	},
	methods: {
		formatDate: function (row, column) {
			return moment(row.created).format('YYYY-MM-DD HH:mm')
		},
		getWithdrawList() {
			getWithdrawList({
				page: this.page,
				size: 10,
				direction: ''
			}).then(res => {
				if(res.code === 0) {
					this.withdraw = res.data.list;
					this.total = res.data.total;
					console.log('WithdrawList',res);
				} else {
					this.$message.error({
						message: res.message
					})
				}
			})
		},
		handleEdit(index, row) {
			this.$confirm('此操作通过该提现订单审核, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	setWithdrawApproveMMD({
	        		withdrawId: row.withdrawId
	        	}).then(res => {
	        		if(res.code === 0) {
	        			this.$message({
	        			  type: 'success',
	        			  message: '审核成功!'
	        			});
	        			this.getWithdrawList();
	        		} else {
	        			this.$message({
	        			  type: 'error',
	        			  message: res.message
	        			});
	        		}
	        	})
	          
	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消审核'
	          });          
	        });
			// console.log(row);
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getWithdrawList()
		},
		query() {}
	}
}
</script>
<style scoped></style>