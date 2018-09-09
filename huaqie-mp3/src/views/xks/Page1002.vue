<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="addCashier">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="dataForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop='name' label="收银员姓名" width="200">
			</el-table-column>
			<el-table-column label="性别" width="100">
			</el-table-column>
			<el-table-column label="手机号" width="180" sortable>
			</el-table-column>
			<el-table-column label="所属收银窗口">
			</el-table-column>
			<el-table-column label="创建时间" width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width='200'>
		      <template scope="scope">
		        <el-button
		          size="small"
		          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
		        <el-button
		          size="small"
		          type="danger"
		          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
		      </template>
		    </el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;" :current-page="page">
			</el-pagination>
		</el-col>
	</section>
</template>
<script>
	import moment from 'moment'
	export default {
		name: 'Cashier',
		data () {
			return {
				filters: {
					name: ''
				},
				total: 0,
				page: 1,
				listLoading: false,
				dataForm: [
					{
						name: ''
					}
				]
			}
		},
		methods: {
		// 表格操作	
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				/********       todos     *******/ 
			},
			// 格式化表格数据
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			// 新增操作模块
			addCashier() {

			},
			// 修改功能模块
			handleEdit(index, row) {

			},
			editCashier() {

			},
			// 删除功能模块
			handleDelete(index, row) {
				this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
			   		/******** todos *******/ 
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			deleteCashier() {

			}, 
			// 搜索
			query() {

			}
		}
	}
</script>
<style scoped>
	
</style>