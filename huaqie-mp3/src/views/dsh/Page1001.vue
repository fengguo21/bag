<template>
	<section>
	 <el-row>
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="昵称"></el-input>
				</el-form-item>
				<el-form-item>
				<el-select v-model="filters.vip" placeholder="等级" clearable>
			    <el-option
			      v-for="item in vipOptions"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
			  </el-form-item>
			  <el-form-item>
					<el-date-picker
				      v-model="filters.period"
				      type="datetimerange"
				      :picker-options="pickerOptions"
				      placeholder="注册时间"
				      align="right">
				    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
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
			<el-table-column prop="basic.sex" label="性别" width="120" :formatter="formatSex" >
			</el-table-column>
			<el-table-column prop="province" label="省份" :formatter="formatCityName" width="200" >
			</el-table-column>
			<el-table-column prop="city" label="城市" :formatter="formatCityName" width="200" >
			</el-table-column>
			<el-table-column prop="extra.books" label="阅读数" width="120" :formatter="formatBooks" >
			</el-table-column>
			<el-table-column prop="score" label="VIP到期日" width="120" :formatter="formatVip" >
			</el-table-column>
			<el-table-column prop="created" :formatter="formatDate" label="注册时间" min-width="180" >
			</el-table-column>
			<el-table-column label="操作" width="150">
		
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleShow(scope.$index, scope.row)">查看</el-button>
				</template>
			
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
   
		</el-row>

		<!--显示详情-->
		<el-dialog title="用户详情" v-model="showFormVisible" :close-on-click-modal="false">

			<el-row class="detail">
			<el-col :span="6">
				用户ID:
			</el-col>
			<el-col :span="18">
				{{ showForm.peopleId }}
			</el-col>
			</el-row>
			<el-row class="detail">
			<el-col :span="6">
				头像:
			</el-col>
			<el-col :span="18">
				<img :src="showForm.basic && showForm.basic.avatar" class="avatar" />
			</el-col>
			</el-row>
			<el-row class="detail">
			<el-col :span="6">
				昵称:
			</el-col>
			<el-col :span="18">
				{{ showForm.basic && showForm.basic.name }}
			</el-col>
			</el-row>
			<el-row class="detail">
			<el-col :span="6">
				Vip到期日:
			</el-col>
			<el-col :span="18">
				{{ (showForm.extra && showForm.extra.vip && showForm.extra.vip.deadline)?moment(showForm.extra.vip.deadline).format('YYYY-MM-DD'):'无' }}
			</el-col>
			</el-row>
			<el-row class="detail">
			<el-col :span="6">
				注册时间:
			</el-col>
			<el-col :span="18">
				{{ (showForm.created)?moment(showForm.created).format('YYYY-MM-DD HH:mm:ss'):'无' }}
			</el-col>
			</el-row>
		
		
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>

		
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import getCityName from '../../common/js/getCityName'
	//import NProgress from 'nprogress'
	import { dshFindPeopleByState } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					name: '',
					vip: '',
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
				vipOptions: [
					{
						label: '普通',
						value: 1
					},
					{
						label: 'VIP',
						value: 2
					},
					{
						label: 'VIP已过期',
						value: 3
					}
				],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,

				showFormVisible: false,
				showForm: {},

				moment: moment
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
			formatVip: function (row, column) {
				return (row.extra.vip && row.extra.vip.deadline)?moment(row.extra.vip.deadline).format('YYYY-MM-DD'):'无'
			},
			formatBooks: function (row, column) {
				return (row.extra.books)?row.extra.books.length:0
			},
			formatCityName: function (row, column) {
				return getCityName(row.basic[column.property], (column.property == 'province')?true:false)
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showFormVisible = true;
				//this.showForm = {}
				this.showForm = Object.assign({}, row);
				/*
				getOrderById({
					peopleId: row.peopleId
				}).then(res => {
					this.showForm = res.data
				})
				*/
			},
			//获取用户列表
			getUsers() {
				let para = {
					name: this.filters.name,
					vip: this.filters.vip,
					page: this.page,
					size: 10
				};

				if(this.filters.period && this.filters.period.length == 2){
					para.startTime = (this.filters.period[0])?this.filters.period[0].valueOf():''
					para.endTime = (this.filters.period[1])?this.filters.period[1].valueOf():''
				}
				this.listLoading = true;
				//NProgress.start();
				dshFindPeopleByState(para).then((res) => {
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
			},
			query() {
				this.page = 1
				this.getUsers()
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>
.detail{
	margin-bottom: 10px;
}
.avatar{
	width: 100px;
	height: 100px;
}
.card-image{
	width: 300px;
}
.verify-button{
	margin-left: 20px;
}
.red{
	color: red;
}
</style>