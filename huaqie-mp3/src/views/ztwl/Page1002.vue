<template>
	<div>
		<section v-if='level == 1'>
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input v-model="filters.name" placeholder="会员姓名"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="query">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-on:click="addRole">新增会员</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="dataForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column label="头像" width="120">
					<template scope="scope">
						<img :src="scope.row.basic?scope.row.basic.avatar: ''" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
					</template>
				</el-table-column>
				<el-table-column prop='extra.customId' label="会员ID" width="150">
				</el-table-column>
				<el-table-column label="姓名" prop='basic.name' width="150">
				</el-table-column>
				<el-table-column label="性别" prop='basic.sex' :formatter='formatSex' width="100">
				</el-table-column>
				<el-table-column label="手机号" width="200" >
					<template scope="scope">
						<p v-for="phone in scope.row.extra.phones" style="padding:0; margin:0">{{phone}}</p>
					</template>
				</el-table-column>
				
				
				<el-table-column label="创建时间" prop='created' :formatter='formatDate' >
				</el-table-column>
				<el-table-column label="操作" width='250'>
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
				<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;" :current-page="page">
				</el-pagination>
			</el-col>

			<!--新增界面-->
			<el-dialog title="新增会员" v-model="addFormVisible" @close='initForm' :close-on-click-modal="false">
				<el-form :model="addForm" :rules='addRules' label-width="80px" ref="addForm">
					<el-form-item label="会员ID" prop='customId'>
						<el-input v-model="addForm.customId"></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop='name'>
						<el-input v-model="addForm.name" auto-complete="off"></el-input>
					</el-form-item>
					
					<el-form-item label="性别" prop='sex'>
						<el-radio-group v-model="addForm.sex">
							<el-radio class="radio" :label="1">男</el-radio>
							<el-radio class="radio" :label="2">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="头像" prop='avatar'>
						<el-upload
						  class="avatar-uploader"
						  :action=avatarUrl
						  :show-file-list="false"
						  :on-success="handleAvatarSuccess"
						  :before-upload="beforeAvatarUpload">
						  <img v-if="addForm.avatar" :src="addForm.avatar" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="手机号" prop='phones'>
						<div v-for="(key,index) in addForm.phones">
						<el-input v-model="addForm.phones[index]" class="phone-input"></el-input>
						<el-button type="danger" icon="minus" size="small" @click="removePhone(index)"></el-button>
						</div>
						<el-button type="primary" icon="plus" size="small" @click="addPhone"></el-button>
					</el-form-item>
					<el-form-item label="密码" prop='password'>
						<el-input v-model="addForm.password"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="addFormVisible = false">取消</el-button>
					<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
				</div>
			</el-dialog>

			<!--修改界面-->
			<el-dialog title="修改会员" v-model="editFormVisible" :close-on-click-modal="false">
				<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="会员ID" prop='title'>
				{{editForm.customId}}
					</el-form-item>
					<el-form-item label="姓名" prop='name'>
						<el-input v-model="editForm.name" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item label="手机号" prop='phones'>
						<div v-for="(key,index) in editForm.phones">
						<el-input v-model="editForm.phones[index]" class="phone-input"></el-input>
						<el-button type="danger" icon="minus" size="small" @click="removePhone2(index)"></el-button>
						</div>
						<el-button type="primary" icon="plus" size="small" @click="addPhone2"></el-button>
					</el-form-item>
					
					<el-form-item label="性别" prop='sex'>
						<el-radio-group v-model="editForm.sex">
							<el-radio class="radio" :label="1">男</el-radio>
							<el-radio class="radio" :label="2">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="头像" prop='avatar'>
						<el-upload
						  class="avatar-uploader"
						  :action=avatarUrl
						  :show-file-list="false"
						  :on-success="handleAvatarSuccess"
						  :before-upload="beforeAvatarUpload">
						  <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="editFormVisible = false">取消</el-button>
					<el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
				</div>
			</el-dialog>

			
		</section>
		<div v-if='level != 1'>
			<h1 class='no-power'>没有管理权限</h1>
		</div>
	</div>
</template>
<script>
	import moment from 'moment'
	import { getPeopleListPage, createUserByCustomId, avatarUrl, updateRole, removePeople } from '@/api/api'
	import session from 'store'

 	export default {
		name: 'Role',
		data () {
			return {
				level: '',
				avatarUrl,
				filters: {
					name: ''
				},
				total: 0,
				page: 1,
				listLoading: false,
				options: [{label:'x',value:'x'}],
        		branchId: '',
				dataForm: [],
				addFormVisible: false,
				addLoading: false,
				addForm: {
					name: '',
					sex: 1,
					phones: [''],
					avatar: '',
					customId: '',
					password: '123456'
				},
				editFormVisible: false,
				editForm: {
					peopleId: '',
					name: '',
					sex: 1,
					avatar: '',
					title: '',
					phones: [],
					password: ''
				},
				addRules: {
					name: [
						{ required: true, message: '请输入会员姓名', trigger: 'blur' }
					],
					customId: [
						{ required: true, message: '请输入会员ID', trigger: 'blur' }
					],
					avatar: [
						{ required: true, message: '请上传会员头像', trigger: 'blur' }
					],
					phone: [
						{ required: true, message: '请输入会员手机号', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入会员密码', trigger: 'blur' }
					],
				},
				editBindBranchFormVisible: false,
				editBindBranchForm: {
					peopleId: '',
					name: ''
				}
			}	
		},
		created() {
			this.getPeoples(); 
			this.level = this.store.get('user').role.level;
		},
		methods: {
			addPhone() {
				this.addForm.phones.push('')
			},
			removePhone(key) {
				this.addForm.phones.splice(key, 1)
			},
			addPhone2() {
				this.editForm.phones.push('')
			},
			removePhone2(key) {
				this.editForm.phones.splice(key, 1)
			},
			getPeoples() {
				getPeopleListPage({
					page: this.page,
					size: 10
				}).then(res => {
					if(res.code === 0) {
						this.dataForm = res.data.list;
						this.total = res.data.total;
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			// 图片上传成功钩子
			handleAvatarSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.addForm.avatar = res.data.url
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
			
		// 表格操作
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.getPeoples();
			},
			// 格式化表格数据
			formatDate(row, column) {
				// console.log(row);
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatSex(row, col) {
				// console.log(row);
				return row.basic?row.basic.sex == 1? '男':row.basic.sex == 2? '女':'未知':'未知' 
			},
			formatPhones(row, col) {
				return (row.extra.phones)?row.extra.phones.join(', '):''
			},
			formatBranch(row, col) {
				// console.log(row);
				return row.branch?row.branch.title:'未绑定' 
			},
			// 新增角色模块
			addRole() {
				this.addFormVisible = true;
			},
			// 新增会员
			addSubmit() {
				this.$refs.addForm.validate((valid) => {
		          if (valid) {
		    		
		    		createUserByCustomId(this.addForm).then(res => {
		    			if(res.code === 0) {
		    				this.$message.success({
		    					message: '新增成功'
		    				})
		    				this.addFormVisible = false;
		    				this.getPeoples();
		    			} else {
		    				this.$message.error({
		    					message: res.message
		    				})
		    			}
		    		})
		          } else {
		            this.$message.error({
		            	message: '信息不能为空'
		            })
		            return false;
		          }
        		});	
			},
			initForm() {
				this.addForm = {
					name: '',
					sex: 1,
					phones: [''],
					avatar: '',
					title: '',
					password: '123456'
				}
			}, 
			// 修改功能模块
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.editRole(row);
			},
			editRole(row) {
				console.log('row', row)
				this.editForm = Object.assign({}, {
					peopleId: row.peopleId,
					name: row.basic.name,
					sex: row.basic.sex,
					avatar: row.basic.avatar,
					customId: row.extra.customId,
					phones: row.extra.phones || []
				})
			},
			editSubmit() {
				updateRole(this.editForm).then(res => {
					this.editFormVisible = false
					this.$message({
				            type: 'success',
				            message: '已修改会员'
			        });
		   			this.getPeoples()
				})		
			},
			// 绑定收款窗口功能模块
			handleBindBranchEdit(index, row) {
				getAllBranch({
					page: 1,
					size: 1000
				}).then (res => {
					console.log( 'res', res.data.list )
					this.options = res.data.list.map(e => ({
						label: e.basic.title,
						value: e.branchId
					}))
				})
				this.editBindBranchFormVisible = true;
				this.editBindBranchRole(row);
			},
			editBindBranchRole(row) {
				this.editBindBranchForm = {
					peopleId: row.peopleId,
					name: row.basic.name
				}
			},
			editBindBranchSubmit() {
				updateRole({
					peopleId: this.editBindBranchForm.peopleId,
					branchId: this.branchId
				}).then(res => {
					this.editBindBranchFormVisible = false
					this.$message({
				            type: 'success',
				            message: '已绑定收款窗口'
			        });
		   			this.getPeoples()
				})		
			},
			// 删除功能模块
			handleDelete(index, row) {
				this.$confirm('是否删除该会员：'+row.extra.customId+'?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
			   		/******** todos *******/ 
			   		removePeople({
			   			peopleId: row.peopleId
			   		}).then( res => {
			   			this.$message({
				            type: 'success',
				            message: '已删除会员'
				        });
			   			this.getPeoples()
			   		})
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			deleteRole() {

			},
			// 搜索
			query() {

			}
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
  .no-power {
	font-size: 20px;
	margin-top: 60px;
	text-align: center;
  }
  .phone-input{
  	margin-bottom: 10px;
  	width: 250px;
  }
</style>