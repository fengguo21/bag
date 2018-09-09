<template>
	<section>
	
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="filters.channel" placeholder="主题" clearable>
				    <el-option
				      v-for="item in channelOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.deviceCode" placeholder="柜子编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.desc" placeholder="备注"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="feedbacks" highlight-current-row v-loading="listLoading" style="width: 100%;">
	
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.channel" label="主题" :formatter="formatChannel" width="120" >
			</el-table-column>
			<el-table-column prop="basic.deviceCode" label="柜子编号" width="120" >
			</el-table-column>
			<el-table-column label="提交人" width="120" >
				<template scope="scope">
					<img :src="scope.row.people.avatar" class="table-avatar" />
				</template>
			</el-table-column>
			<el-table-column prop="people.name" label="提交人名称" width="120" >
			</el-table-column>
			<el-table-column label="附图" width="200" >
				<template scope="scope">
					<img :src="scope.row.basic.image" v-if="scope.row.basic.image" class="table-image" />
					<p v-else>无</p>
				</template>
			</el-table-column>
			<el-table-column prop="basic.desc" label="备注" width="auto" >
			</el-table-column>
			<el-table-column prop="created" :formatter="formatDate" label="提交时间" width="180" >
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					<el-button type="success" v-if="scope.row.basic.channel==3 && scope.row.basic.step!=2" size="small" @click="handleVerify(scope.$index, scope.row)">通过</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { yydFindFeedbackByState, yydFindFeedbackById, yydRemoveFeedback, yydVerifyFeedback } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					channel: '',
					deviceCode: '',
					desc: ''
				},
				channelOptions: [{
					label: '开锁',
					value: '1'
				},{
					label: '故障',
					value: '2'
				},{
					label: '举报',
					value: '3'
				}],
				feedbacks: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

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
				}

			}
		},
		methods: {
			//性别显示转换
			formatChannel: function (row, column) {
				const channels = {
					1: '开锁',
					2: '故障',
					3: '举报'
				}
				return (row.basic.channel in channels)?channels[row.basic.channel]:'未知';
			},
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getFeedbacks();
			},
			//获取用户列表
			getFeedbacks() {
				let para = {
					channel: this.filters.channel,
					deviceCode: this.filters.deviceCode,
					desc: this.filters.desc,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				yydFindFeedbackByState(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total = res.data.total;
					this.feedbacks = res.data.list;
					this.listLoading = false;
					console.log(res.data.list)
					//NProgress.done();
				});
			},
			//审核
			handleVerify: function (index, row) {
				this.$confirm('确认通过该举报吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feedId: row.feedId };
					yydVerifyFeedback(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '审核成功',
							type: 'success'
						});
						this.getFeedbacks();
					});
				}).catch(() => {

				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feedId: row.feedId };
					yydRemoveFeedback(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getFeedbacks();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getFeedbacks();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getFeedbacks();
							});
						});
					}
				});
			},
			query() {
				this.page = 1
				this.getFeedbacks()
			}
		},
		mounted() {
			this.getFeedbacks();
		}
	}

</script>

<style scoped>
.table-avatar{
	width: 40px;
	height: 40px;
}
.table-image{
	height: 100px;
	vertical-align: middle;
	margin: 5px 0;
}
</style>