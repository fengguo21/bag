<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="课程名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
					<el-button v-on:click="handleAdd">新增课程</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column label="头像" width="200">
				<template scope="scope">
					<img :src="scope.row.basic.avatar" style="width:120px;height:80px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.title" label="名称" width="250" >
			</el-table-column>
			<el-table-column prop="basic.price" label="价格" width="200" >
			</el-table-column>
			<el-table-column prop="basic.desc" label="简介" :formatter="formatDesc" width="400" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" >
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
				<el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
					<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增课程" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="价格">
					<el-input-number v-model="addForm.price" :min="0" :max="100000"></el-input-number>
				</el-form-item>
				<el-form-item label="封面">
					<el-upload
				  class="avatar-uploader"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload">
				  <img v-if="imageUrl" :src="imageUrl" class="avatar">
				  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				</el-form-item>
				<el-form-item label="简介">
					<el-input type="textarea" v-model="addForm.desc"></el-input>
				</el-form-item>
				<el-form-item label="详情图片">
					<el-upload
				  class="upload-demo"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :on-preview="handlePreview"
				  :on-remove="handleImageRemove"
				  :on-success="handleImageSuccess"
				  :file-list="imageList"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="修改课程" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="价格">
					<el-input-number v-model="editForm.price" :min="0" :max="100000"></el-input-number>
				</el-form-item>
				<el-form-item label="封面">
					<el-upload
				  class="avatar-uploader"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload">
				  <img v-if="imageUrl" :src="imageUrl" class="avatar">
				  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				</el-form-item>
				<el-form-item label="简介">
					<el-input type="textarea" v-model="editForm.desc"></el-input>
				</el-form-item>
				<el-form-item label="详情图片">
					<el-upload
				  class="upload-demo"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :on-preview="handlePreview"
				  :on-remove="handleImageRemove"
				  :on-success="handleImageSuccess"
				  :file-list="imageList"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--显示详情-->
		<el-dialog title="课程详情" v-model="showFormVisible" :close-on-click-modal="false">
			<el-row class="el-row">
			<el-col :span="6">
				课程ID:
			</el-col>
			<el-col :span="18">
				{{ showForm.productId }}
			</el-col>
			</el-row>
			<el-row class="el-row">
			<el-col :span="6">
				封面:
			</el-col>
			<el-col :span="18">
				<img :src="showForm.basic.avatar" style="max-width:200px"/>
			</el-col>
			</el-row>
			<el-row class="el-row">
			<el-col :span="6">
				名称:
			</el-col>
			<el-col :span="18">
				{{ showForm.basic.title }}
			</el-col>
			</el-row>
			<el-row class="el-row">
			<el-col :span="6">
				价格:
			</el-col>
			<el-col :span="18">
				¥{{ showForm.basic.price }}
			</el-col>
			</el-row>
			<el-row class="el-row">
			<el-col :span="6">
				简介:
			</el-col>
			<el-col :span="18">
				{{ showForm.basic.desc }}
			</el-col>
			</el-row>
			<el-row class="el-row">
			<el-col :span="6">
				详情图片:
			</el-col>
			<el-col :span="18">
				<img :src="img.url" v-for="img in showForm.basic.images" style="max-width:500px"/>
			</el-col>
			</el-row>
			<el-row class="el-row">
			<el-col :span="6">
				创建时间:
			</el-col>
			<el-col :span="18">
				{{ moment(showForm.created).format('YYYY-MM-DD HH:mm:ss') }}
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
	//import NProgress from 'nprogress'
	import { getProductListPage, addProduct, updateProduct, removeProduct } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					title: ''
				},
				products: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				imageUrl: '',
				imageList: [],
				moment: moment,

				showFormVisible: false,
				showForm: {
					basic: {}
				},

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					'shipment.code': [
						{ required: true, message: '请输入快递单号', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					basic: {},
					extra: {},
					shipment: {
						company: '',
						code: ''
					}
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					price: 0,
					desc: '',
					avatar: '',
					images: []
				}

			}
		},
		methods: {
			//性别显示转换
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatDesc: function (row, column) {
				return (row.basic && row.basic.desc)?row.basic.desc.substr(0, 50)+'...':''
			},
			formatTime( time ) {
				return moment( time ).format('YYYY-MM-DD HH:mm:ss')
			},
			formatStep( step ) {
				const steps = ['待支付', '待发货', '已发货', '已完成', '已退货']
				return steps[step-1]
			},
			formatStep2( row, column ) {
				return this.formatStep(row.step)
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getProducts();
			},
			handleImageSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.imageList.push({
					name: file.name,
					url: res.data.url//file.response.data.url
				})
				//console.log(res, file)
				//this.imageUrl = 'https://'+file.response.data.url
        		//this.imageUrl = URL.createObjectURL(file.raw);
		      },

			handleAvatarSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.imageUrl = res.data.url
				console.log(this.imageUrl)
        		//this.imageUrl = URL.createObjectURL(file.raw);
		      },
		      handleImageRemove(file, fileList) {
		        // console.log('handleRemove:', file, fileList);
		        // console.log(this.imageList);
		        this.imageList = fileList;
		      },
		       handlePreview(file) {
		        console.log('handlePreview',file);
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
			//获取课程列表
			getProducts() {
				let para = {
					title: this.filters.title,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getProductListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total = res.data.total;
					this.products = res.data.list;
					this.listLoading = false;
					console.log(res.data.list)
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm(`确认删除课程：${row.basic.title} 吗?`, '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { productId: row.productId };
					console.log('PARA', para)
					removeProduct(para).then((res) => {
						this.listLoading = false;
						console.log('REMOVE', res)
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getProducts();
					});
				}).catch(() => {

				});
			},
			
			//显示查看界面
			handleShow: function (index, row) {
				this.showFormVisible = true;
				this.showForm = Object.assign({}, row);
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row.basic, {
					productId: row.productId
				});
				this.imageUrl = row.basic.avatar
				this.imageList = row.basic.images
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					title: '',
					price: 0,
					desc: '',
					avatar: '',
					images: []
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({
								productId: this.editForm.productId
							}, this.editForm);
							para.images = this.imageList
							para.avatar = this.imageUrl

							updateProduct(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getProducts()
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
							para.images = this.imageList
							para.avatar = this.imageUrl
							 
							addProduct(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getProducts();
							});
						});
					}
				});
			},
			query() {
				this.page = 1
				this.getProducts()
			}
		},
		mounted() {
			this.getProducts();
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
.el-row{
	margin-bottom: 10px;
}
</style>