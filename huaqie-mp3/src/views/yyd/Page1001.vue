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
					<el-select v-model="filters.verify" placeholder="认证状态" clearable>
				    <el-option
				      v-for="item in verifyOptions"
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
			<el-table-column prop="score" label="积分" width="120" >
			</el-table-column>
			<el-table-column label="手机号认证" width="120" >
				<template scope="scope">
					<span class="verify-success" v-if="scope.row.extra.verify && scope.row.extra.verify.phone">已认证</span>
					<span class="verify-fail" v-else>未认证</span>
				</template>
			</el-table-column>
			<el-table-column prop="extra.verify.cardStep" label="身份证认证" width="120" >
				<template scope="scope">
					<span class="verify-success" v-if="scope.row.extra.verify && scope.row.extra.verify.cardStep == 2">已认证</span>
					<span class="verify-fail" v-else>未认证</span>
				</template>
			</el-table-column>
			<el-table-column prop="extra.verify.cardStep3" label="其他证件认证" width="120" >
				<template scope="scope">
					<span class="verify-success" v-if="scope.row.extra.verify && scope.row.extra.verify.cardStep3 == 2">已认证</span>
					<span class="verify-fail" v-else>未认证</span>
				</template>
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
			<el-row>
			<el-col :span="6">
				用户ID:
			</el-col>
			<el-col :span="18">
				{{ showForm.peopleId }}
			</el-col>
			</el-row>
			<el-row>
			<el-col :span="6">
				昵称:
			</el-col>
			<el-col :span="18">
				{{ showForm.basic && showForm.basic.name }}
			</el-col>
			</el-row>
			<el-row>
			<el-col :span="6">
				积分:
			</el-col>
			<el-col :span="18">
				{{ showForm.score }}
			</el-col>
			</el-row>
			<el-row>
			<el-col :span="6">
				押金:
			</el-col>
			<el-col :span="18">
				{{ showForm.extra && showForm.extra.deposit }}
			</el-col>
			</el-row>
			<el-row>
			<el-col :span="6">
				认证身份证:
			</el-col>
			<el-col :span="18">
				<img v-if="showForm.extra && showForm.extra.verify && showForm.extra.verify.cardImage" :src="showForm.extra && showForm.extra.verify && showForm.extra.verify.cardImage" class="card-image"/>
				<img v-if="showForm.extra && showForm.extra.verify && showForm.extra.verify.cardImage2" :src="showForm.extra && showForm.extra.verify && showForm.extra.verify.cardImage2" class="card-image"/>
				<p v-if="showForm.extra && showForm.extra.verify && showForm.extra.verify.cardName && showForm.extra.verify.cardStep==1">{{ showForm.extra && showForm.extra.verify && showForm.extra.verify.cardName }}
				<el-button type="success" class="verify-button" @click="verify(1, showForm.peopleId)">通过</el-button>
				<el-button type="danger" class="verify-button" @click="verify(2, showForm.peopleId)">拒绝</el-button>
				</p>
				<p v-if="showForm.extra && showForm.extra.verify && showForm.extra.verify.cardName && showForm.extra.verify.cardStep==3">{{ showForm.extra && showForm.extra.verify && showForm.extra.verify.cardName }}
				<span class="red">已拒绝，拒绝理由：{{ showForm.extra && showForm.extra.verify && showForm.extra.verify.cardReject }}</span>
				</p>
				<p>{{ showForm.extra && showForm.extra.verify && showForm.extra.verify.cardName }} {{ (showForm.extra && showForm.extra.verify && showForm.extra.verify.cardStep == 2)?'已认证':'未认证' }}</p>
			</el-col>
			</el-row>
			<el-row>
			<el-col :span="6">
				认证手机号:
			</el-col>
			<el-col :span="18">
				{{ showForm.extra && showForm.extra.verify && showForm.extra.verify.phone || '未认证'}}
			</el-col>
			</el-row>
			<el-row>
			<el-col :span="6">
				认证其他证件:
			</el-col>
			<el-col :span="18">
				<img v-if="showForm.extra && showForm.extra.verify && showForm.extra.verify.cardImage3" :src="showForm.extra && showForm.extra.verify && showForm.extra.verify.cardImage3" class="card-image"/>
				<p v-if="showForm.extra && showForm.extra.verify && showForm.extra.verify.cardImage3 && showForm.extra.verify.cardStep3==1">
				<el-button type="success" class="verify-button" @click="verify(3, showForm.peopleId)">通过</el-button>
				<el-button type="danger" class="verify-button" @click="verify(4, showForm.peopleId)">拒绝</el-button>
				</p>
				<p v-if="showForm.extra && showForm.extra.verify && showForm.extra.verify.cardImage3 && showForm.extra.verify.cardStep3==3">{{ showForm.extra && showForm.extra.verify && showForm.extra.verify.cardImage3 }}
				<span class="red">已拒绝，拒绝理由：{{ showForm.extra && showForm.extra.verify && showForm.extra.verify.cardReject3 }}</span>
				</p>
				<p>{{ showForm.extra && showForm.extra.verify && showForm.extra.verify.cardImage3 }} {{ (showForm.extra && showForm.extra.verify && showForm.extra.verify.cardStep3 == 2)?'已认证':'未认证' }}</p>
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
	import { yydFindPeopleByState, yydVerifyVerify } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					name: '',
					verify: ''
				},
				verifyOptions: [
					{
						label: '已认证',
						value: 1
					},
					{
						label: '已认证手机号',
						value: 2
					},
					{
						label: '已认证身份证',
						value: 3
					},
					{
						label: '已认证其他证件',
						value: 5
					},
					{
						label: '未认证',
						value: 4
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
					verify: this.filters.verify,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				yydFindPeopleByState(para).then((res) => {
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
			verify( m, peopleId ) {
				if( m == 1 || m == 3){
					yydVerifyVerify({
		         		peopleId: peopleId,
		         		mode: m
		         	}).then(data => {
		         		this.$message.success('提交成功')
		         		this.getUsers()
		         		this.showFormVisible = false;
		         	})
				}else if(m == 2 || m == 4){
					 this.$prompt('请输入拒绝理由', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			        }).then(({ value }) => {
			         	yydVerifyVerify({
			         		peopleId: peopleId,
			         		text: value,
			         		mode: m
			         	}).then(data => {
			         		this.$message.success('提交成功')
			         		this.getUsers()
			         		this.showFormVisible = false;
			         	})
			        }).catch(() => {
			          
			        });
		    	}
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
.card-image{
	width: 300px;
}
.verify-button{
	margin-left: 20px;
}
.verify-success{
	color: green;
}
.verify-fail{
	color: red;
}
.red{
	color: red;
}
</style>