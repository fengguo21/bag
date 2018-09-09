<template>
<section>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<!-- <el-col :span="10">
				
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
				
			</el-col> -->

			<el-col :span="10" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}@{{sysAppName}}</span>
					<el-dropdown-menu slot="dropdown">
						<!--<el-dropdown-item>我的消息</el-dropdown-item>-->
						<el-dropdown-item @click.native="handleUpdate">设置个人信息</el-dropdown-item>
						<el-dropdown-item @click.native="handleUpdatePassword">修改密码</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed" style="padding-top: 20px">
					<template v-for="(item,index) in menus" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item style="padding-left: 30px;" v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item style="padding-left: 30px;" v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.meta.name}}</strong>
						<!--
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
						-->
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
	<!--设置个人信息界面-->
		<el-dialog title="设置个人信息" v-model="editFormVisible" :close-on-click-modal="false">
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
				<el-form-item label="头像">
					<el-upload
				  class="avatar-uploader"
				  action="https://g2.huaqie.com/cloud/app/upload"
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
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--设置密码界面-->
		<el-dialog title="修改密码" v-model="editPasswordFormVisible" :close-on-click-modal="false" @close='initPSW'>
			<el-form :model="editPasswordForm" label-width="120px" :rules="editPasswordFormRules" ref="editPasswordForm">
				<el-form-item label="旧密码" prop="oldPassword">
					<el-input type='password' v-model="editPasswordForm.oldPassword" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="password">
					<el-input type='password' v-model="editPasswordForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="重复新密码" prop="rePassword">
					<el-input type='password' v-model="editPasswordForm.rePassword" auto-complete="off"></el-input>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editPasswordFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editPasswordSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		</section>
</template>

<script>
import session from 'store'
import { getMasterMenu, editPassword, updatePeople } from '../api/api';

	export default {
		data() {
			var validatePass2 = (rule, value, callback) => { 
		        if (value !== this.editPasswordForm.password) {
		          callback(new Error('两次输入密码不一致!'));
		        } else {
		          callback();
		        }
		    };
			return {
				sysName:'花茄管理系统',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				sysAppName: '',
				imageUrl: '',
				
				menus: [],
				editFormVisible: false,//新增界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				editForm: {
					name: '',
					sex: 0,
					avatar: ''
				},
				editPasswordFormVisible: false,
				editPasswordFormRules: {
					oldPassword: [
					{ required: true, message: '请输入旧密码', trigger: 'blur' }
					],
					password: [
					{ required: true, message: '请输入新密码', trigger: 'blur' }
					],
					rePassword: [
					{ required: true, message: '请重复输入新密码', trigger: 'blur' },
					 { validator: validatePass2, trigger: 'blur' }
					]
				},
				editPasswordForm: {
					oldPassword: '',
					password: '',
					rePassword: ''
				},
				routePath: ''
			}
		},
		watch: {
			// 监听路由，并且为右侧导航栏选定状态
			'$route': 'listenRouter'
		},
		methods: {
			handleAvatarSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.editForm.avatar = res.data.url
        		//this.imageUrl = URL.createObjectURL(file.raw);
		      },
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
			initPSW() {
				this.$refs.editPasswordForm.resetFields();
			},
			editPasswordSubmit() {
				this.$refs.editPasswordForm.validate((valid) => {
		          if (valid) {
		          	this.$confirm('确定要修改当前密码?', '提示', {
						type: 'warning'
					}).then(() => {
						this.editPasswordFormVisible = false;
			            editPassword({
			            	oldPassword: this.editPasswordForm.oldPassword,
							password: this.editPasswordForm.password
			            }).then(res => {
			            	if(res.code === 0) {
			            		this.$message.success({
			            			message: '密码修改成功，请重新登陆'
			            		});
			            		session.remove('user');
								this.$router.push('/login');
			            	} else {
			            		this.$message.error({
			            			message: res.message
			            		})
			            	}
			            })
					}).catch(() => {
						this.$message({
	            			message: '已取消修改'
	            		})
					});
					// console.log(this.editPasswordForm);
		          } else {
		            this.$message.error({
		            	message: '信息出错'
		            })
		            return false;
		          }
		        });	
			},
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
		          if (valid) {
		          	this.$confirm('确定要修改个人信息吗?', '提示', {
						type: 'warning'
					}).then(() => {
						this.editFormVisible = false;
			            updatePeople({
			            	appId: session.get('user').appId,
			            	peopleId: session.get('user').peopleId,
			            	name: this.editForm.name,
			            	avatar: this.editForm.avatar,
			            	sex: this.editForm.sex
			            }).then(res => {
			            	if(res.code === 0) {
			            		this.$message.success({
			            			message: '个人信息修改成功'
			            		});
			            		const oldUser = session.get('user')
			            		oldUser.basic.name = this.editForm.name
			            		oldUser.basic.avatar = this.editForm.avatar
			            		oldUser.basic.sex = this.editForm.sex
			            		session.set('user', oldUser)
			            		this.sysUserName = this.editForm.name
								this.sysUserAvatar = this.editForm.avatar
			            		//session.remove('user');
								//this.$router.push('/login');
			            	} else {
			            		this.$message.error({
			            			message: res.message
			            		})
			            	}
			            })
					}).catch(() => {
						this.$message({
	            			message: '已取消修改'
	            		})
					});
					// console.log(this.editPasswordForm);
		          } else {
		            this.$message.error({
		            	message: '信息出错'
		            })
		            return false;
		          }
		        });	
			},
			listenRouter() {
				// console.log(this.routePath);
				this.routePath = this.$route.path;
			},
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect(a, b) {
				
			},
			handleUpdate() {
				this.editFormVisible = true
			},
			handleUpdatePassword() {
				this.editPasswordFormVisible = true;
			},
			//退出登录
			logout() {
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					console.time()
					session.remove('user');
					console.timeEnd();
					this.$router.push('/login');
				}).catch(() => {
					console.timeEnd();
				});
			},
			//折叠导航栏
			collapse(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		created() {
			var user = session.get('user');
			var app = session.get('app')
			if (user && app) {
				this.sysUserName = user.basic.name || '';
				this.sysUserAvatar = user.basic.avatar || '';
				this.sysAppName = app.basic.title
				this.editForm.name = user.basic.name
				this.editForm.sex = user.basic.sex
				this.editForm.avatar = user.basic.avatar
			}
			getMasterMenu({}).then( data => {
				data.data.forEach( m => {
					this.menus.push({
						children: [
							{
								name: m.name,
								path: m.path
							}
						],
						name: '',
						leaf: true,
						iconCls: 'fa '+m.icon
					})
				})
			})
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 50%;
						margin: 8px 0px 10px 10px;
						float: right;
						border:2px solid white;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				/*border-right-style: solid;*/
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				background-color: #eef1f6;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
	 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border:1px dashed gray;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>