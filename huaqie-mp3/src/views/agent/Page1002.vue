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
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.title" label="名称" width="170" >
			</el-table-column>
			<el-table-column prop="basic.company" label="公司" width="300" >
			</el-table-column>
			<el-table-column prop="basic.province" label="省份" width="150" >
			</el-table-column>
			<el-table-column prop="basic.city" label="城市" width="150" >
			</el-table-column>
			<el-table-column prop="basic.desc" label="简介" width="300" >
			</el-table-column>
			<el-table-column prop="extra.group" label="类型" :formatter="formatGroup" width="150" >
			</el-table-column>
			<el-table-column label="状态" width="150" >
			<template scope="scope">
				<el-tag type="success">运行中</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" >
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template scope="scope">
				<el-button size="small" @click="handleCreateRole(scope.row)">新增管理员</el-button>
				<el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
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
     <el-table
      :data="menus"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="250">
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
		<el-tabs v-model="activeName" type="card">
		    <el-tab-pane label="基本信息" name="p1">
		    	<el-form :model="editForm" label-width="165px" style="margin:20px;width:60%;min-width:600px;" :rules="editFormRules" ref="editForm">
				<el-form-item label="应用名称" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="应用简介">
					<el-input type="textarea" v-model="editForm.desc"></el-input>
				</el-form-item>
				<el-form-item label="公司名称" prop="company">
					<el-input v-model="editForm.company" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="公司省份">
					<el-select v-model="editForm.province" placeholder="请选择公司所在省份">
						<el-option label="上海市" value="上海市"></el-option>
						<el-option label="浙江省" value="浙江省"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="">
						<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
					</el-form-item>
				
			</el-form>
			
		    </el-tab-pane>
		    <el-tab-pane label="支付宝服务商" name="p2">
		    	<el-form ref="alipaySetForm" :model="editForm.alipayFacilitator" label-width="165px" style="margin:20px;width:60%;min-width:600px;">
					<el-form-item label="服务商AppID">
						<el-input v-model="editForm.alipayFacilitator.appId"></el-input>
					</el-form-item>
					<el-form-item label="已授权AppId">
						{{this.editForm.alipayFacilitator.app_id}}
					</el-form-item>
					<el-form-item>
						<el-button type="warning" @click='goAlipayAuth'>获取授权</el-button>
					</el-form-item>
				</el-form>
		    </el-tab-pane>
		    <el-tab-pane label="微信服务商" name="p3">
		    	<el-form ref="wepaySetForm" :model="editForm.wepayFacilitator" :rules="editFormRules" label-width="165px" style="margin:20px;width:60%;min-width:600px;">
					<el-form-item label="服务商AppID">
						<el-input v-model="editForm.wepayFacilitator.appId"></el-input>
					</el-form-item>
					<el-form-item label="微信子商户公众账号ID">
						<el-input v-model="editForm.wepayFacilitator.sub_app_id"></el-input>
					</el-form-item>
					<el-form-item label="微信子商户号">
						<el-input v-model="editForm.wepayFacilitator.sub_mchId"></el-input>
					</el-form-item>
					<el-form-item label="">
						<el-button type="primary" @click.native="editWepaySubmit" :loading="editLoading">保存</el-button>
					</el-form-item>
				
				</el-form>
		    </el-tab-pane>
		  </el-tabs>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">关闭</el-button>
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
				<el-form-item label="密码" prop="password">
					<el-input v-model="addRoleForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="头像" prop='avatar'>
						<el-upload
						  class="avatar-uploader"
						  :action=avaterUrl
						  :show-file-list="false"
						  :on-success="handleAvatarSuccess"
						  :before-upload="beforeAvatarUpload">
						  <img v-if="addRoleForm.avatar" :src="addRoleForm.avatar" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="姓名" prop="name">
					<el-input v-model="addRoleForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addRoleForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="2">女</el-radio>
					</el-radio-group>
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
	import { getAppList, addApp, getApp, editAppWepayFacilitator, getPeopleListPage, createRole, getMasterMenu, addMenu, editApp, avaterUrl } from '../../api/api';
	import moment from 'moment'
	import session from 'store'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				avaterUrl: '',
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				activeName: 'p1',

				showFormVisible: false,
				showForm: {},
				roles: [],
				menus: [],

				addRoleFormVisible: false,
				addRoleForm: {
					clientAppId: '',
					phone: '',
					name: '',
					password: '',
					avatar: '',
					sex: 0,
					title: ''
				},
				addRoleFormRules: {
					phone: [
						{ required: true, message: '请输入手机号', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
					name: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
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
					province: '',
					alipayFacilitator: {},
					wepayFacilitator: {}
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
				},

				alipaySetForm: {}

			}
		},
		methods: {
			//性别显示转换
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatGroup(row) {
				const groups = {
					'qrcodereferee': '公众号二维码推广',
					'xks': '移动收款',
					'facegame': '认脸小程序',
					'cashier': '收钱宝',
					'common': '小商铺',
					'mmd': '批发分销商城',
					'hyb': '会员宝',
					'hssy': '婚纱摄影',
					'zbcdz': '共享充电',
					'ienglish': '爱英语',
					'ztwl': '中铁物流',
					'college': '学校',
					'meirongWeAppManager': '美容小程序管理',
					'yyd': '易运动',
					'dsh': '读书会'
				}
				return (row.extra.group in groups)?groups[row.extra.group]:'未知'
			},
			goAlipayAuth(appId) {
				if(!this.editForm.alipayFacilitator.appId){
					this.$message.warning({
						message: '请填写服务商appId'
					})
					return
				}
				getApp({
					appId: this.editForm.alipayFacilitator.appId
				}).then(res => {
					console.log(res)
					if(res.code){
						this.$message.warning({
							message: res.message
						})
						return
					}
					if(!res.data || !res.data.extra || !res.data.extra.alipay){
						this.$message.warning({
							message: '服务商配置错误'
						})
						return
					}
					this.editFormVisible = false
					window.open(`https://openauth.alipay.com/oauth2/appToAppAuth.htm?app_id=${res.data.extra.alipay.app_id}&redirect_uri=https://g2.huaqie.com/cloud/thirdPartyAuth/alipay?appId=${this.editForm.alipayFacilitator.appId}&subAppId=${this.editForm.clientAppId}`)
				})
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
				getAppList(para).then((res) => {
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
			// 图片上传成功钩子
			handleAvatarSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.addRoleForm.avatar = res.data.url
			},
			// 图片上传前
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
		        const isPNG = file.type === 'image/png';
		        const isLt2M = file.size / 1024 / 1024 < 2;

		        if (!isJPG && !isPNG) {
		          this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
		        }
		        if (!isLt2M) {
		          this.$message.error('上传头像图片大小不能超过 2MB!');
		        }
		        return (isJPG || isPNG) && isLt2M;
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
			handleCreateRole: function(row) {
				this.addRoleFormVisible = true;
				this.addRoleForm = {
					clientAppId: row.appId,
					phone: '',
					name: '',
					password: '123456',
					avatar: 'https://dn-huaqie.qbox.me/483023546.jpg',
					sex: 1,
					title: ''
				}
			},
			//显示详情界面
			handleShow: function (index, row) {
				this.showFormVisible = true;
				this.showForm = Object.assign({}, row);

				this.roles = []

				getMasterMenu({toAppId: row.appId}).then(res => {
					this.menus = res.data
				})
				getPeopleListPage({roleAppId: row.appId, page: 1, size: 10}).then(res => {
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
					province: row.basic.province,
					alipayFacilitator: row.extra.alipayFacilitator || {},
					wepayFacilitator: row.extra.wepayFacilitator || {}
				});
				console.log('form:', this.editForm)
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
			//编辑
			editWepaySubmit: function () {
				this.$refs.wepaySetForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, {config:this.editForm.wepayFacilitator}, {
								appId: this.editForm.clientAppId
							});

								
							
							editAppWepayFacilitator(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['wepaySetForm'].resetFields();
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
							let para = Object.assign({
								
							}, this.addRoleForm);

							createRole(para).then((res) => {
								this.addLoading = false;
								if(res.code){
									this.$message({
									message: res.message,
									type: 'error'
								});
									return
								}
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addRoleForm'].resetFields();
								this.addRoleFormVisible = false;
								
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
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>
  .avatar-uploader .el-upload {
    overflow: hidden;
    position: relative;
  }
  .avatar-uploader .el-upload:hover {
    /* border-color: #20a0ff; */
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 175px;
    height: 175px;
    line-height: 175px;
    text-align: center;
    border: 1px dashed #d9d9d9 ;
    cursor: pointer;
  }
  .avatar-uploader-icon:hover {
  	border-color: #20a0ff;
  }
  .avatar {
    width: 175px;
    height: 175px;
    display: block;
  }	
</style>