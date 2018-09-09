<template>
	<section>
	
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="课程名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProducts">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button  @click="handleAdd">新增课程</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column label="头像" width="100">
				<template scope="scope">
					<img :src="scope.row.basic.avatar" style="width:60px;height:60px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.title" label="标题" width="250" >
			</el-table-column>
			<el-table-column prop="basic.price" label="价格" width="200" >
			</el-table-column>

			<el-table-column prop="basic.sold" label="销量" width="200" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" >
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
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
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="头像">
					<el-upload
				  class="avatar-uploader"
				  action="https://g5.huaqie.com/upload"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload">
				  <img v-if="imageUrl" :src="imageUrl" class="avatar">
				  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				</el-form-item>

				

				<el-form-item label="价格">
					<el-input-number v-model="addForm.price" :min="0" :max="200"></el-input-number>
				</el-form-item>

				

				
				<el-form-item label="课程说明">
					<el-input type="textarea" v-model="addForm.desc"></el-input>
				</el-form-item>

				<el-form-item label="视频时长">
					<el-input v-model="addForm.parameters" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="视频地址" prop="url">
					<el-input v-model="addForm.url" auto-complete="off"></el-input>
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
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="头像">
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

				<el-form-item label="价格">
					<el-input-number v-model="editForm.price" :min="0" :max="200"></el-input-number>
				</el-form-item>

				<el-form-item label="课程说明">
					<el-input type="textarea" v-model="editForm.desc"></el-input>
				</el-form-item>

				<el-form-item label="视频时长">
					<el-input v-model="editForm.parameters" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="视频地址" prop="url">
					<el-input v-model="editForm.url" auto-complete="off"></el-input>
				</el-form-item>


			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑库存界面-->
		<el-dialog title="修改课程库存" v-model="editStockFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					{{editForm.title}}
				</el-form-item>

				<el-form-item label="头像">
				
				  <img v-if="imageUrl" :src="imageUrl" class="avatar">
				 
				</el-form-item>

				<el-form-item label="库存">
					<el-input-number v-model="editForm.stock" :min="0" :max="2000000"></el-input-number>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editStockFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getProductListPage, addProduct, updateProduct, removeProduct, addTag, getTagListPage, addCatalog, getCatalogListPage, removeTag, removeCatalog } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				activeName: 'first',
				percentStep: false,
				catalogOptions: [],
				catalogChildrenOptions: [],
				imageUrl: '',
				imageList: [],
				albumList: [],
				checkList: [],
				filters: {
					name: ''
				},
				percentages: [{
					count: 0,
					percentage: 0
				}],
				products: [],
				tags: [],
				catalogs: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editStockFormVisible: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					],
					url: [
						{ required: true, message: '请输入视频地址', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					title: '',
					avatar: '',
					price: 0,
					desc: '',
					parameters: '',
					url: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					],
					url: [
						{ required: true, message: '请输入视频地址', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					avatar: '',
					price: 0,
					desc: '',
					parameters: '',
					url: ''
				},

				addTagFormVisible: false,//新增界面是否显示
				addTagFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addTagForm: {
					title: '',
					order: 0
				},

				addCatalogFormVisible: false,//新增界面是否显示
				addCatalogFormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addCatalogForm: {
					title: '',
					order: 0
				},

				addCatalogChildFormVisible: false,//新增界面是否显示
				addCatalogChildFormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addCatalogChildForm: {
					catalogId: '',
					title: '',
					order: 0
				}

			}
		},
		methods: {
			catalogChange(catalog) {
				const t = []
				this.catalogs.forEach(c => {
					if(c.basic.title == catalog){
						c.basic.children.forEach( cc => {
							t.push({
								label: cc.title,
								value: cc.title
							})
						})			
					}
				})
				this.catalogChildrenOptions = t
				this.addForm.childCatalog = ''
			},
			 handleRemove(file, fileList) {
		        this.imageList = fileList
		      },
		      handlePreview(file) {
		        console.log('handlePreview',file);
		      },
		       handleAlbumSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.albumList.push({
					name: file.name,
					url: res.data.url//file.response.data.url
				})
				//console.log(res, file)
				//this.imageUrl = 'https://'+file.response.data.url
        		//this.imageUrl = URL.createObjectURL(file.raw);
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
			//性别显示转换
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm')
			},
			formatChildren: function (row, column) {
				return row.basic.children.map(c => c.title).join(',')
			},
			formatPercent1: function(row, column) {
				if(typeof(row.basic.percent) == 'object')
					return row.basic.percent[0]
				return row.basic.percent
			},
			formatPercent2: function(row, column) {
				if(typeof(row.basic.percent) == 'object')
					return row.basic.percent[1]
				return row.basic.percent
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getProducts();
			},
			handleClick(){

			},
			//获取用户列表
			getProducts() {
				let para = {
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
					console.log(this.products)
					//NProgress.done();
				});
			},

			minusPercentage() {
				this.percentages.pop()
			},

			plusPercentage() {
				this.percentages.push({
					count: 0,
					percentage: 0
				})
			},

			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除课程：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { productId: row.productId };

					removeProduct(para).then((res) => {
						this.listLoading = false;
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
			//删除标签
			handleDelTag: function (index, row) {
				this.$confirm('确认删除标签：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { tagId: row.tagId };

					removeTag(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getTags();
					});
				}).catch(() => {

				});
			},
			//删除分类
			handleDelCatalog: function (index, row) {
				this.$confirm('确认删除分类：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { catalogId: row.catalogId };

					removeCatalog(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCatalogs();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row.basic, {
					productId: row.productId
				});
				this.imageUrl = this.editForm.avatar
				
			},
			//显示编辑界面
			handleEditStock: function (index, row) {
				this.editStockFormVisible = true;
				this.editForm = Object.assign({}, row.basic, {
					productId: row.productId
				});
				this.imageUrl = this.editForm.avatar
				this.imageList = this.editForm.images
				this.editForm.specs = this.editForm.specs.join('\n')
				this.editForm.parameters = this.editForm.parameters.join('\n')
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					title: '',
					tags: [],
					catalog: '',
					childCatalog: '',
					avatar: '',
					stock: 0,
					price: 0,
					percentage: 0,
					percent1: 0,
					percent2: 0,
					weight: 0,
					specs: '',
					parameters: '',
					album: [],
					images: []
				};
				this.imageUrl = ''
				this.images = []
				this.percentages = [{
					count: 0,
					percentage: 0
				}]
			},
			//显示新增界面
			handleAddCatalog: function () {
				this.addCatalogFormVisible = true;
				this.addCatalogForm = {
					title: '',
					avatar: '',
					children: []
				};
			},
			//显示新增界面
			handleAddCatalogChild: function (index, row) {
				this.addCatalogChildFormVisible = true;
				this.addCatalogChildForm = {
					catalogId: row.catalogId,
					title: '',
					avatar: '',
					order: 0
				};
			},
			//显示新增界面
			handleAddTag: function () {
				this.addTagFormVisible = true;
				this.addTagForm = {
					title: '',
					order: 0
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
								this.editStockFormVisible = false
								this.getProducts();
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
			//新增Tag
			addTagSubmit: function () {
				this.$refs.addTagForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addTagForm);

							addTag(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addTagForm'].resetFields();
								this.addTagFormVisible = false;
								this.getTags();
							});
						});
					}
				});
			},
			//新增Tag
			addCatalogSubmit: function () {
				this.$refs.addCatalogForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign(this.addCatalogForm, {
								avatar: this.imageUrl
							});
							addCatalog(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addCatalogForm'].resetFields();
								this.addCatalogFormVisible = false;
								this.getCatalogs();
							});
						});
					}
				});
			},
			//新增子分类
			addCatalogChildSubmit: function () {
				this.$refs.addCatalogChildForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign(this.addCatalogChildForm, {
								avatar: this.imageUrl
							});

							addCatalog(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addCatalogChildForm'].resetFields();
								this.addCatalogChildFormVisible = false;
								this.getCatalogs();
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
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getProducts();
					});
				}).catch(() => {

				});
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
</style>