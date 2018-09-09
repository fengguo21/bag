<template>
	<section>
	 <el-row>
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
			<el-form-item>
				<el-select v-model="filters.catalog" placeholder="书籍分类" clearable>
				    <el-option
				      v-for="item in allCatalogs"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				  </el-select>
			</el-form-item>
			<el-form-item>
					<el-input v-model="filters.title" placeholder="书籍"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.text" placeholder="内容"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.step" placeholder="审核状态" clearable>
				    <el-option
				      v-for="item in verifyOptions"
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
					<img :src="scope.row.basic.people.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.people.name" label="昵称" width="200" >
			</el-table-column>
			<el-table-column prop="basic.book.title" label="书籍名称" width="200"  >
			</el-table-column>
			<el-table-column prop="basic.text" label="内容" width="200"  >
			</el-table-column>
			<el-table-column prop="score" label="状态" width="120" >
				<template scope="scope">
					<p v-if="scope.row.basic.step==1">待处理</p>
					<p v-if="scope.row.basic.step==2" style="color: green">已通过</p>
					<p v-if="scope.row.basic.step==3" style="color: red">已拒绝</p>
				</template>
			</el-table-column>
			<el-table-column prop="created" :formatter="formatDate" label="提交时间" min-width="180" >
			</el-table-column>
			<el-table-column label="操作" width="150">
		
				<template scope="scope">
				<el-button size="small" type="primary" v-if="scope.row.basic.step==2 || scope.row.basic.step==3" @click="handleVerify(1, scope.row)">待处理</el-button>
				<el-button size="small" type="success" v-if="scope.row.basic.step==1 || scope.row.basic.step==3" @click="handleVerify(2, scope.row)">通过</el-button>
				<el-button size="small" type="danger" v-if="scope.row.basic.step==1 || scope.row.basic.step==2" @click="handleVerify(3, scope.row)">拒绝</el-button>
				
				</template>
			
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
   
		</el-row>


		
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import getCityName from '../../common/js/getCityName'
	//import NProgress from 'nprogress'
	import { dshUpdateComment, dshRemoveComment, dshFindCommentByState, dshFindCatalogByState } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					title: '',
					text: '',
					step: '',
					period: ''
				},
				allCatalogs: [],
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
				verifyOptions: [
					{
						label: '待处理',
						value: 1
					},
					{
						label: '已通过',
						value: 2
					},
					{
						label: '已拒绝',
						value: 3
					}
				],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,

				showFormVisible: false,
				showForm: {}
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
			formatVerifyPhone: function (row, column) {
				return (row.extra.verify && row.extra.verify.phone)?'已认证':'未认证'
			},
			formatVerifyIdCard: function (row, column) {
				return (row.extra.verify && row.extra.verify.cardStep == 2)?'已认证':'未认证'
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getComments();
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
			getComments() {
				let para = {
					catalog: this.filters.catalog,
					title: this.filters.title,
					text: this.filters.text,
					step: this.filters.step,
					page: this.page,
					size: 10
				};
				if(this.filters.period && this.filters.period.length == 2){
					para.startTime = (this.filters.period[0])?this.filters.period[0].valueOf():''
					para.endTime = (this.filters.period[1])?this.filters.period[1].valueOf():''
				}
				this.listLoading = true;
				//NProgress.start();
				dshFindCommentByState(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total = res.data.total;
					this.users = res.data.list;
					this.listLoading = false;
					console.log(res.data.list)
					//NProgress.done();
				});
			},
			handleVerify( step, row ) {
					dshUpdateComment({
		         		feedId: row.feedId,
		         		step: step
		         	}).then(data => {
		         		this.$message.success('提交成功')
		         		this.getComments()
		         		this.showFormVisible = false;
		         	})
			},
			//获取代理商列表
			getAllCatalogList() {
				dshFindCatalogByState({
					page: 1,
					size: 1000
				}).then((res) => {
					if(res.code === 0) {
						this.listLoading = false;
						this.allCatalogs = res.data.list.map(e => {
							return e.basic.title
						})
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
					}
				})
			},
			query() {
				this.page = 1
				this.getComments()
			}
		},
		mounted() {
			this.getComments();
			this.getAllCatalogList()
		}
	}

</script>

<style scoped>
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