<template>
	<div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.url" placeholder="网址"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="query">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 表主体 -->
		<el-table :data="advertises" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column label="图片" width="300">
				<template scope="scope">
					<img :src="scope.row.basic.image" style="width:120px;height:60px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.url" label="网址" width="auto" sortable>
			</el-table-column>

			<el-table-column prop="created" label="创建时间" width="auto" :formatter="formatDate" sortable>
			</el-table-column>
			
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>	
		<!--分页工具条-->
		<el-col :span="24" class="toolbar">	
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增广告" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="广告网址" prop="title">
					<el-input v-model="addForm.url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="广告图片">
					<el-upload
				  class="avatar-uploader"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload">
				  <img v-if="addForm.image" :src="addForm.image" class="avatar">
				  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑广告" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="广告网址" prop="title">
					<el-input v-model="editForm.url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="广告图片">
					<el-upload
				  class="avatar-uploader"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess2"
				  :before-upload="beforeAvatarUpload">
				  <img v-if="editForm.image" :src="editForm.image" class="avatar">
				  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import util from '../../common/js/util'
import { getAdvertiseListPage, addAdvertise, updateAdvertise, removeAdvertise } from '../../api/api';
import moment from 'moment'
export default {
	name: 'queryVip',
	data () {
		return {
			filters: {
				url: ''
			},
			total: 0,
			page: 1,
			listLoading: false,
			advertises: [],
			productId: '',
			peopleId: '',

			options: [{
          value: '',
          label: ''
        }],
        	level: '',

			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				url: [
					{ required: true, message: '请输入广告网址', trigger: 'blur' }
				]
			},
			//新增界面数据
			addForm: {
				image: '',
				url: ''
			},

			editFormVisible: false,//新增界面是否显示
			editLoading: false,
			editFormRules: {
				url: [
					{ required: true, message: '请输入广告网址', trigger: 'blur' }
				]
			},
			//新增界面数据
			editForm: {
				image: '',
				url: ''
			}
		}
	},
	methods: {
		formatDate(index, row) {
			return moment(index.created).format('YYYY-MM-DD HH:mm:ss')
		},
		handleAvatarSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.addForm.image = res.data.url
        		//this.imageUrl = URL.createObjectURL(file.raw);
		      },
		      handleAvatarSuccess2(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.editForm.image = res.data.url
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
		getAdvertises() {
			let para = {
				url: this.filters.url,
				page: this.page,
				size: 10
			};
			if(this.filters.name !== '') {
				para.name = this.filters.name;
			} 
			if(this.peopleId !== '') {
				para.peopleId = this.peopleId;
			}
			// console.log(para); 
			this.listLoading = true;
			//NProgress.start();
			getAdvertiseListPage(para).then((res) => {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				console.log(res);
				this.total = res.data.total;
				this.advertises = res.data.list;
				this.listLoading = false;
				//NProgress.done();
			});
		},
		// 换页
		handleCurrentChange(val) {
			this.page = val;
			this.getUsers();
		},
		//新增广告
		addSubmit: function () {
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						//NProgress.start();
						
						const para = {
							image: this.addForm.image,
							url: (this.addForm.url.indexOf('http')==0)?this.addForm.url:('http://'+this.addForm.url)
						}
						
						
						addAdvertise(para).then((res) => {
							this.addLoading = false;
							console.log('res', res)
							if(res.code){
								this.$message({
									message: res.message,
									type: 'error'
								});
								return
							}
							//NProgress.done();
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['addForm'].resetFields();
							this.addFormVisible = false;
							this.getAdvertises();
						});
					});
				}
			});
		},
		//编辑广告
		editSubmit: function () {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						//NProgress.start();
						
						const para = {
							advertiseId: this.editForm.advertiseId,
							image: this.editForm.image,
							url: (this.editForm.url.indexOf('http')==0)?this.editForm.url:('http://'+this.editForm.url)
						}
						
						
						updateAdvertise(para).then((res) => {
							this.editLoading = false;
							console.log('res', res)
							if(res.code){
								this.$message({
									message: res.message,
									type: 'error'
								});
								return
							}
							//NProgress.done();
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
							this.getAdvertises();
						});
					});
				}
			});
		},
		handleAdd() {
			this.addFormVisible = true
			
		},
		handleEdit(index, row) {
			this.editFormVisible = true
			this.editForm = {
				advertiseId: row.advertiseId,
				url: row.basic.url,
				image: row.basic.image
			}
		},
		handleDel(index, row) {
			this.$confirm('确认删除该广告吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { advertiseId: row.advertiseId };
					removeAdvertise(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getAdvertises();
					});
				}).catch(() => {

				});
		},
		query() {
			this.page = 1
			this.getAdvertises()
		}
	},
	created() {
		this.productId = this.$store.getters.getGoodsID;
	},
	mounted() {
		this.getAdvertises();
		// console.log(this.$store.getters.getGoodsID);
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
    width: 300px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border:1px dashed gray;
  }
  .avatar {
    width: 300px;
    height: 178px;
    display: block;
  }
</style>