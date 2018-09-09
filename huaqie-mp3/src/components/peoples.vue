<template>
	<section>
	
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="昵称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column label="头像" width="120">
				<template scope="scope">
					<img :src="scope.row.basic.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.name" label="昵称" width="200" >
			</el-table-column>
			<el-table-column prop="basic.sex" label="性别" width="200" :formatter="formatSex" >
			</el-table-column>
			<el-table-column prop="province" label="省份" :formatter="formatCityName" width="200" >
			</el-table-column>
			<el-table-column prop="city" label="城市" :formatter="formatCityName" width="200" >
			</el-table-column>
			<el-table-column prop="score" label="积分" width="200" >
			</el-table-column>
			<el-table-column prop="created" :formatter="formatDate" label="注册时间" min-width="180" >
			</el-table-column>
			<el-table-column label="操作" width="150">
			<!--
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
				-->
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		
	</section>
</template>

<script>
	import util from '../common/js/util'
	import getCityName from '../common/js/getCityName'
	//import NProgress from 'nprogress'
	import { getPeopleListPage } from '../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.basic.sex == 1 ? '男' : row.basic.sex == 2 ? '女' : '未知';
			},
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatCityName: function (row, column) {
				return getCityName(row.basic[column.property], (column.property == 'province')?true:false)
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getPeopleListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total = res.data.total;
					this.users = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>