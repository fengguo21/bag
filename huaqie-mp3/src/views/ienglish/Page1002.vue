<template>
	<section>
	
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="课程名称"></el-input>
				</el-form-item>
				<el-form-item>
				<el-radio-group v-model="filters.price">
					<el-radio-button label="全部"></el-radio-button>
				    <el-radio-button label="收费"></el-radio-button>
				    <el-radio-button label="免费"></el-radio-button>
				  </el-radio-group>
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
		<el-table :data="products" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>

			<el-table-column type="expand">
		      <template scope="props">
		      <el-row>
		      <el-col :span="12" >
		      	<div>{{ props.row.basic.text }}</div>
		      	<div>
		      		<img :src="img.url" class="detail-image" v-for="img in props.row.basic.images" />
		      	</div>
		      	</el-col>
		      	<el-col :span="12">
		        <el-form label-position="left" inline class="demo-table-expand">
		        <div v-for="(item, index) in props.row.basic.list">
		          
		          <el-form-item label="">
		            <span>{{ item.title }}</span>
		          </el-form-item>
		          <el-form-item label="音频地址">
		            <span>{{ item.audio }}</span>
		             
		          </el-form-item>
		          <div label="轮播图">
		            <img :src="img.url" v-for="img in item.images" class="course-image" />
		          </div>
				<el-button type="primary" size="small" icon="edit" @click="handleEditList(props.row.productId, index, item)"></el-button>
					<el-button type="danger" size="small" icon="delete" @click="handleDelList(props.row.productId, index, item)"></el-button>
		          </div>
		          
		        </el-form>
		        </el-col>
		        </el-row>
		      </template>
		    </el-table-column>


			<el-table-column label="课程封面" width="150">
				<template scope="scope">
					<img :src="scope.row.basic.avatar" style="width:120px;height:60px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.title" label="标题" width="250" >
			</el-table-column>
			<el-table-column prop="basic.price" label="价格" width="200" >
			</el-table-column>
			<el-table-column prop="basic.list.length" label="课时" width="200" >
			</el-table-column>
			<el-table-column prop="basic.sold" label="销量" width="200" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" >
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button size="small" type="primary" @click="handleAddList(scope.$index, scope.row)">新增课时</el-button>
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

				<el-form-item label="封面图片">
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
					<el-input-number v-model="addForm.price" :min="0" :max="10000"></el-input-number>
				</el-form-item>

				<el-form-item label="简介">
					<el-input v-model="addForm.text" :autosize="{ minRows: 5, maxRows: 10}" type="textarea"></el-input>
				</el-form-item>

				<el-form-item label="详情图片">
					<el-upload
				  class="upload-demo"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :on-preview="handlePreview"
				  :on-remove="handleRemove"
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
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="课程封面">
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
					<el-input-number v-model="editForm.price" :min="0" :max="10000"></el-input-number>
				</el-form-item>

				<el-form-item label="简介">
					<el-input v-model="editForm.text" :autosize="{ minRows: 5, maxRows: 10}" type="textarea"></el-input>
				</el-form-item>

				<el-form-item label="详情图片">
					<el-upload
				  class="upload-demo"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :on-preview="handlePreview"
				  :on-remove="handleRemove"
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

		<!--新增课时界面-->
		<el-dialog title="新增课程课时" v-model="addListFormVisible" :close-on-click-modal="false">
			<el-form :model="addListForm" label-width="80px" :rules="addListFormRules" ref="addListForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="addListForm.title" ></el-input>
				</el-form-item>

				<el-form-item label="音频地址" prop="audio">
					<el-input v-model="addListForm.audio" ></el-input>
				</el-form-item>

				<el-form-item label="轮播图">
					<el-upload
				  class="upload-demo"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :on-preview="handlePreview"
				  :on-remove="handleRemove"
				  :on-success="handleAlbumSuccess"
				  :file-list="albumList"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addListFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addListSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--修改课时界面-->
		<el-dialog title="修改课程课时" v-model="editListFormVisible" :close-on-click-modal="false">
			<el-form :model="editListForm" label-width="80px" :rules="editListFormRules" ref="editListForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editListForm.title" ></el-input>
				</el-form-item>

				<el-form-item label="音频地址" prop="audio">
					<el-input v-model="editListForm.audio" ></el-input>
				</el-form-item>

				<el-form-item label="轮播图">
					<el-upload
				  class="upload-demo"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :on-preview="handlePreview"
				  :on-remove="handleRemove"
				  :on-success="handleAlbumSuccess"
				  :file-list="albumList"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editListFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editListSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getProductListPage, createCourse, updateCourse, removeProduct, addTag, getTagListPage, addCatalog, getCatalogListPage, removeTag, removeCatalog } from '../../api/api';
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
					title: '',
					price: '全部'
				},
				products: [],
				
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				addListFormVisible: false,
				addListFormRules: {
					title: [
						{ required: true, message: '请输入课时名称', trigger: 'blur' }
					],
					audio: [
						{ required: true, message: '请输入音频地址', trigger: 'blur' }
					]
				},
				//新增课时界面数据
				addListForm: {
					title: '',
					audio: '',
					images: [],
					list: []
				},

				editListFormVisible: false,
				editListFormRules: {
					title: [
						{ required: true, message: '请输入课时名称', trigger: 'blur' }
					],
					audio: [
						{ required: true, message: '请输入音频地址', trigger: 'blur' }
					]
				},
				//修改课时界面数据
				editListForm: {
					title: '',
					audio: '',
					images: [],
					list: []
				},


				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					title: '',
					avatar: '',
					price: 0,
					text: '',
					list: []
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					avatar: '',
					price: 0,
					text: '',
					images: [],
					list: []
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
				let free = ''
				if(this.filters.price == '免费')
					free = 1
				else if(this.filters.price == '收费')
					free = 2
				let para = {
					title: this.filters.title,
					free: free,
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
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row.basic, {
					productId: row.productId
				});
				this.editForm.images = (row.basic.images)?row.basic.images:[]
				this.imageUrl = this.editForm.avatar
				this.imageList = this.editForm.images
			},
			//显示新增课时界面
			handleAddList: function (index, row) {
				this.addListFormVisible = true;
				this.addListForm = Object.assign({}, {
					productId: row.productId,
					list: row.basic.list
				});
				this.albumList = []
			},
			//显示新增课时界面
			handleEditList: function (productId, index, row) {
				console.log(index, row)
				this.editListFormVisible = true;
				this.editListForm = Object.assign({}, row, {
					index: index,
					productId: productId
				});
				this.albumList = row.images
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					title: '',
					avatar: '',
					price: 0,
					list: []
				};
				this.imageUrl = ''
				this.albumList = []
				this.imageList = []
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
							para.images = this.imageList

							updateCourse(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.addListFormVisible = false
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
							para.images = this.imageList
							


							createCourse(para).then((res) => {
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
			//新增课时
			addListSubmit: function () {
				this.$refs.addListForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();

							this.addListForm.list.push({
								title: this.addListForm.title,
								audio: this.addListForm.audio,
								images: this.albumList
							})

							let para = Object.assign({}, {
								productId: this.addListForm.productId,
								list: this.addListForm.list
							})
							
							updateCourse(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addListForm'].resetFields();
								this.addListFormVisible = false;
								this.addListFormVisible = false
								this.getProducts();
							});
						});
					}
				});
			},
			//修改课时
			editListSubmit: function () {
				this.$refs.editListForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();

							console.log('editListForm', this.editListForm)

							let list = []

							this.products.forEach(e => {
								if(e.productId == this.editListForm.productId){
									e.basic.list[this.editListForm.index].title = this.editListForm.title
									e.basic.list[this.editListForm.index].audio = this.editListForm.audio
									e.basic.list[this.editListForm.index].images = this.albumList
									list = e.basic.list
								}
							})

							const para = Object.assign({}, {
								productId: this.editListForm.productId,
								list: list
							})
							
							updateCourse(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editListForm'].resetFields();
								this.editListFormVisible = false;
							});
						});
					}
				});
			},
			//删除课时
			handleDelList: function (productId, index, row) {
				console.log('handleDelList', productId, index, row)
				this.$confirm('确认删除课时：'+row.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.editLoading = true;
						//NProgress.start();

					let list = []

					this.products.forEach(e => {
						if(e.productId == productId){
							e.basic.list.forEach((j, k) => {
								if(k == index){
									e.basic.list.splice(k, 1)
								}
							})
							list = e.basic.list
						}
					})

					let para = Object.assign({}, {
						productId: productId,
						list: list
					})
					
					updateCourse(para).then((res) => {
						this.editLoading = false;
						//NProgress.done();
						this.$message({
							message: '提交成功',
							type: 'success'
						});
					});
				}).catch(() => {

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
  .course-image{
  	height: 150px;
  	margin-right: 10px;
  }
  .detail-image{
  	display: block;
  	margin-top: 10px;
  }
</style>