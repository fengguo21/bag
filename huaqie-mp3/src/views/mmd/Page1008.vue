<template>
	<section>
	 <el-tabs v-model="activeName">
    <el-tab-pane label="会员卡" name="first">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.cardName" placeholder="会员卡名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCards">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增会员卡</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="cards" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.title" label="会员卡名称" sortable>
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange1" :page-size="10" :total="total1" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
    <el-tab-pane label="会员" name="second">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item >
					<el-input v-model="filters.vipName" placeholder="会员姓名"></el-input>
				</el-form-item>
				<el-form-item inline>
					<el-input v-model="filters.phone" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRecords">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="records" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="card.title" label="会员卡名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="basic.name" label="会员名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="basic.phone" label="会员手机号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="balance" label="余额" width="200" sortable>
			</el-table-column>
			<el-table-column prop="created" label="申请时间" :formatter="formatDate" min-width="180" sortable>
			</el-table-column>
			<!-- <el-table-column label="操作" width="150">
			
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
				
			</el-table-column> -->
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange2" :page-size="10" :total="total2" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
  </el-tabs>
		

		<!--编辑界面-->
		<el-dialog title="修改会员卡" size='tiny' v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="会员卡名称" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="info" @click='addCharge("editForm")'>新增充值金额</el-button>
				</el-form-item>
				<el-form-item
					inline
				    v-for="(charge, index) in editForm.options"
				    :label="'充值金额' + (index+1)"
				    :key="index"
				  >
				    <el-input v-model="charge.value"></el-input><el-button @click.prevent="removeCharge('editForm', charge)">删除</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增会员卡" size='tiny'  v-model="addFormVisible" :close-on-click-modal="false" @open='initImgUrl'>
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="会员卡名称" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="info" @click='addCharge("addForm")'>新增充值金额</el-button>
				</el-form-item>
				<el-form-item
					inline
				    v-for="(charge, index) in addForm.options"
				    :label="'充值金额' + (index+1)"
				    :key="index"
				  >
				    <el-input v-model="charge.value"></el-input><el-button @click.prevent="removeCharge('addForm', charge)">删除</el-button>
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
	import { getCardListPage, getCardRecordListPage, addCard, removeCard, updateCard } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					cardName: '',
					vipName: '',
					phone: ''
				},
				activeName: 'first',
				imageUrl: '',
				cards: [],
				records: [],
				total1: 0,
				total2: 0,
				page1: 1,
				page2: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入会员卡名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					title: '',
					options: []
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入会员卡名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					options: []
				}

			}
		},
		methods: {
			addCharge(formName) {
				// console.log(this[formName].options)
				this[formName].options.push({
			        value: ''
			    });
			},
			// 移除金额
			removeCharge(formName, item) {
				const index = this[formName].options.indexOf(item)
		        if (index !== -1) {
		          this[formName].options.splice(index, 1)
		        }
			},
			initImgUrl() {
				this.imageUrl = ''
			},
			//性别显示转换
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm')
			},
			handleCurrentChange1(val) {
				this.page1 = val;
				this.getCards();
			},
			handleCurrentChange2(val) {
				this.page2 = val;
				this.getCards();
			},
			handleAvatarSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.imageUrl = res.data.url
				console.log('successUrl===='+this.imageUrl)
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
			//获取用户列表
			getCards() {
				let para = {
					title: this.filters.cardName,
					page: this.page1,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getCardListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total1 = res.data.total;
					this.cards = res.data.list;
					this.listLoading = false;
					console.log(this.cards)
					//NProgress.done();
				});
			},
			//获取会员列表
			getRecords() {
				let para = {
					name: this.filters.vipName,
					phone: this.filters.phone,
					page: this.page2,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getCardRecordListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total2 = res.data.total;
					this.records = res.data.list;
					this.listLoading = false;
					console.log(this.records)
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该会员卡：'+ row.basic.title +' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { cardId: row.cardId };
					removeCard(para).then((res) => {
						this.listLoading = false;
						console.log('res', res);
						//NProgress.done();
						if(res.code > 0) {
							this.$message({
								message: res.message,
								type: 'error'
							});
							return;
						}
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCards();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				// console.log(row);
				this.editForm = {
					cardId: row.cardId,
					title: row.basic.title,
					options: []
				}
				if(row.basic.options) {
					row.basic.options.forEach(item => {
						this.editForm.options.push({
							value: item
						})
					})
				} 
				
				// console.log(row)
				// this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					title: '',
					options: []
				};
			},
			//编辑
			editSubmit: function () {
				this.editForm.avatar = this.imageUrl;
				// console.log(this.editForm);
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = {
								cardId: this.editForm.cardId,
								title: this.editForm.title,
								options: []
							}
							this.editForm.options.forEach(item => {
								para.options.push(item.value);
							})
							updateCard(para).then((res) => {
								this.editLoading = false;
								if(res.code > 0) {
									this.$message.error({
										message: res.message
									})
									return;
								}
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getCards();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				console.log(this.addForm);
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = {
								title: this.addForm.title,
								options: []
							}
							this.addForm.options.forEach(item => {
								para.options.push(item.value);
							})
							// console.log(para);
							addCard(para).then((res) => {
								this.addLoading = false;
								if(res.code > 0) {
									this.$message.error({
										message: res.message
									})
									return ;
								}
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getCards();
							});
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
						if(res.code > 0) {
							this.$message.error({
								message: res.message
							})
							return ;
						}
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCards();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getCards();
			this.getRecords()
		}
	}

</script>

<style scoped>
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
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-2 {
  	width: 200px;
    height: 100px;
    display: block;
  }
</style>