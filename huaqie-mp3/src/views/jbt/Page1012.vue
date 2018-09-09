<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="vin码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="entities" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!--<el-table-column type="selection" width="55">
			</el-table-column>-->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.code" label="会员卡号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="basic.phone" label="手机号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="basic.peopleId" label="用户ID" width="150" sortable>
			</el-table-column>
			<el-table-column prop="basic.step" label="激活状态" width="150" :formatter="formatStep" sortable>
			</el-table-column>
			<el-table-column prop="basic.step" label="创建时间"  :formatter="formatTime" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑会员卡" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="vin码" prop="code">
					<el-input v-model="editForm.code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input v-model="editForm.phone"></el-input>
				</el-form-item>
				<!--
				<el-form-item label="出厂日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.date"></el-date-picker>
				</el-form-item>
				<el-form-item label="简介">
					<el-input type="textarea" v-model="editForm.text"></el-input>
				</el-form-item>
				<el-form-item label="图片">
					<el-upload
					  class="upload-demo"
					  action="https://g1.huaqie.com/storeMaster/app/upload"
					  :data="args"
					  :on-success="handleSuccess"
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					  :file-list="fileList2"
					  list-type="picture">
					  <el-button size="small" type="primary">点击上传</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>
				-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增会员卡" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="卡号" prop="code">
					<el-input v-model="addForm.code" auto-complete="off"></el-input>
				</el-form-item>
				<!--<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>-->
				<!--
				<el-form-item label="价格">
					<el-input-number v-model="addForm.price" :min="0" :max="100000"></el-input-number>
				</el-form-item>
				<el-form-item label="生产日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.date"></el-date-picker>
				</el-form-item>
				<el-form-item label="简介">
					<el-input type="textarea" v-model="addForm.text"></el-input>
				</el-form-item>
				<el-form-item label="图片">
					<el-upload
					  class="upload-demo"
					  action="https://g1.huaqie.com/storeMaster/app/upload"
					  :data="args"
					  :on-success="handleSuccess"
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					  :file-list="fileList2"
					  list-type="picture">
					  <el-button size="small" type="primary">点击上传</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>
				-->
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
	import session from 'store'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	import { createEntity, getEntityByState, updateEntity, removeEntity } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				args: {
					sessionId: session.get('sessionId')
				},
				entities: [],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					code: [
						{ required: true, message: '请输入会员卡号', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					entityId: 0,
					code: '',
					phone: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					code: [
						{ required: true, message: '请输入会员卡号', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					code: ''
				},
				 fileList2: []

			}
		},
		methods: {
			//性别显示转换
			formatTime: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm')
			},
			formatStep: function(row, column) {
				return (row.basic.step==1)?'未激活':'已激活'
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getEntities();
			},
			getEntities() {
				this.listLoading = true
				getEntityByState({
					mode: 3,
					page: this.page,
					size: 10
				}).then( res => {
					console.log(res.data)
					this.total = res.data.total
					this.entities = res.data.list
					this.listLoading = false

					console.log('res', res)
				})
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			handleSuccess(file, fileList) {
				if(file.code){
					this.$message.error(file.message)
					return
				}
				this.fileList2.push({
					name: fileList.name,
					url: 'https://'+file.data.url
				})
				this.$message.success('图片上传成功')
			},
			handleRemove(file, fileList) {
		        console.log(file, fileList);
		      },
		      handlePreview(file) {
		        console.log(file);
		      },
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { entityId: row.entityId };
					console.log(para)
					removeEntity(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getEntities();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, {
					entityId: row.entityId,
					code: row.basic.code,
					price: row.basic.price,
					date: row.basic.date,
					text: row.basic.text
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					code: '',
					price: 0,
					date: '',
					text: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let params = Object.assign({
								mode: 3
							}, this.editForm);
							params.date = (!params.date || params.date == '') ? '' : util.formatDate.format(new Date(params.date), 'yyyy-MM-dd');
							
							console.log(params)
								
							updateEntity(params).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getEntities();
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
							let params = Object.assign({
								mode: 3
							}, this.addForm);

							

							console.log(params)
							
							
							createEntity( params ).then ( res => {
								this.addLoading = false
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getEntities();
							})
							
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
			this.getEntities()
		}
	}

</script>

<style scoped>

</style>