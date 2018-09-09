<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
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
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="appId" label="ID" width="250" sortable>
			</el-table-column>
			<el-table-column prop="basic.title" label="名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="basic.company" label="公司" width="300" sortable>
			</el-table-column>
			<el-table-column prop="basic.desc" label="简介" width="300" sortable>
			</el-table-column>
			<el-table-column prop="extra.group" label="类型" width="100" sortable>
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
				<el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--详情界面-->
		<el-dialog title="详情" v-model="showFormVisible" :close-on-click-modal="false">
			 <el-tabs v-model="activeName">
    <el-tab-pane label="基本" name="first">
    <p>ID: {{showForm.appId}}</p>
    	<h3>{{showForm.basic && showForm.basic.title}}</h3>
    	<p>{{showForm.basic && showForm.basic.company}}</p>
    	<p>{{showForm.basic && showForm.basic.desc}}</p>
    </el-tab-pane>
    <el-tab-pane label="菜单" name="second">
    <el-button type="primary" style="margin-bottom: 15px;" @click="addMenu()">新增菜单</el-button>
     <el-table
      :data="menus"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="icon"
        label="icon">
      </el-table-column>
      <el-table-column
        prop="order"
        label="排序">
      </el-table-column>
    </el-table>
    </el-tab-pane>
    <el-tab-pane label="员工" name="third">
    <el-button type="primary" style="margin-bottom: 15px;" @click="updateRole()">新增员工</el-button>
    	 <el-table
      :data="roles"
      style="width: 100%">
      <el-table-column
        prop="basic.name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="extra.phone"
        label="手机号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role.title"
        label="职务">
      </el-table-column>
    </el-table>
    </el-tab-pane>
  </el-tabs>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showFormVisible = false">取消</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="公司" prop="company">
					<el-input v-model="editForm.company" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="editForm.desc"></el-input>
				</el-form-item>
				<el-form-item label="应用类型" prop="group">
					<el-input v-model="editForm.group" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增应用" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="公司" prop="company">
					<el-input v-model="addForm.company" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="addForm.desc"></el-input>
				</el-form-item>
				<el-form-item label="应用类型" prop="group">
					<el-input v-model="addForm.group" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增角色界面-->
		<el-dialog title="新增员工" v-model="addRoleFormVisible" :close-on-click-modal="false">
			<el-form :model="addRoleForm" label-width="80px" :rules="addRoleFormRules" ref="addRoleForm">
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="addRoleForm.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="职务" prop="title">
					<el-input v-model="addRoleForm.title" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addRoleFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addRoleSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增菜单界面-->
		<el-dialog title="新增菜单" v-model="addMenuFormVisible" :close-on-click-modal="false">
			<el-form :model="addMenuForm" label-width="80px" :rules="addMenuFormRules" ref="addMenuForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addMenuForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="路径" prop="path">
					<el-input v-model="addMenuForm.path" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="icon" prop="icon">
					<el-input v-model="addMenuForm.icon" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="order">
					<el-input v-model="addMenuForm.order" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addMenuFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addMenuSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getAppListPage, addApp, getPeopleListPage, superCreateRole, getMasterMenu, addMenu, editApp } from '../../api/api';
	import moment from 'moment'
	import session from 'store'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				activeName: 'first',

				showFormVisible: false,
				showForm: {},
				roles: [],
				menus: [],

				addRoleFormVisible: false,
				addRoleForm: {
					phone: '',
					title: ''
				},
				addRoleFormRules: {
					phone: [
						{ required: true, message: '请输入手机号', trigger: 'blur' }
					],
					title: [
						{ required: true, message: '请输入职务', trigger: 'blur' }
					]
				},

				addMenuFormVisible: false,
				addMenuForm: {
					name: '',
					path: '',
					order: '',
					icon: ''
				},
				addMenuFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					path: [
						{ required: true, message: '请输入路径', trigger: 'blur' }
					]
				},

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入应用名称', trigger: 'blur' }
					],
					company: [
						{ required: true, message: '请输入公司名称', trigger: 'blur' }
					],
					group: [
						{ required: true, message: '请输入应用类型', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					clientAppId: '',
					title: '',
					company: '',
					desc: '',
					group: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入应用名称', trigger: 'blur' }
					],
					company: [
						{ required: true, message: '请输入公司名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					company: '',
					desc: '',
					group: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
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
					//name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getAppListPage(para).then((res) => {
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
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
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
			},
			addMenu: function() {
				this.addMenuFormVisible = true;
				this.editLoading = false
				this.addMenuForm = {
					icon: 'fa-id-card-o'
				}
			},
			updateRole: function() {
				this.addRoleFormVisible = true;
				this.addRoleForm = {}
			},
			//显示详情界面
			handleShow: function (index, row) {
				this.showFormVisible = true;
				this.showForm = Object.assign({}, row);

				this.roles = []

				getMasterMenu({toAppId: this.showForm.appId}).then(res => {
					this.menus = res.data
				})
				
				getPeopleListPage({roleAppId: this.showForm.appId, page: 1, size: 10}).then(res => {
					this.roles = res.data.list
				})
				
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, {
					clientAppId: row.appId,
					title: row.basic.title,
					company: row.basic.company,
					desc: row.basic.desc,
					group: row.extra.group
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					title: '',
					company: '',
					desc: '',
					group: ''
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


							
							editApp(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
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
							
							addApp(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							}, err => {});
						}, err => {});
					}
				});
			},
			//新增员工
			addRoleSubmit: function () {
				this.$refs.addRoleForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({
								roleAppId: this.showForm.appId
							}, this.addRoleForm);
							
							superCreateRole(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addRoleForm'].resetFields();
								this.addRoleFormVisible = false;
								//this.getUsers();
								getPeopleListPage({roleAppId: this.showForm.appId, page: 1, size: 10}).then(res => {
									this.roles = res.data.list
								})
							}, err => {});
						}, err => {});
					}
				});
			},
			//新增菜单
			addMenuSubmit: function () {
				this.$refs.addMenuForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({
								toAppId: this.showForm.appId
							}, this.addMenuForm);

							
							addMenu(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addMenuForm'].resetFields();
								this.addMenuFormVisible = false;
								//this.getUsers();
								
								getMasterMenu({toAppId: this.showForm.appId}).then(res => {
									this.menus = res.data
								})
								
							}, err => {});
						}, err => {});
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
		}
	}

</script>

<style scoped>

</style>