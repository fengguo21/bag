<template>
	<section>
	
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="文章标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProducts">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button  @click="handleAdd">新增文章</el-button>
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
		      <el-col :span="8" >
		     	<h3>ID: {{props.row.feedId}}</h3>
		     	<p>{{ props.row.basic.desc }}</p>
		      	<div v-html="props.row.basic.content"></div>
		      	</el-col>
		      </el-row>
		      </template>
		    </el-table-column>


			<el-table-column label="文章封面" width="200">
				<template scope="scope">
					<img :src="scope.row.basic.avatar" style="width:120px;height:60px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.title" label="标题" width="250" >
			</el-table-column>
			<el-table-column prop="basic.group" label="分组" width="250" :formatter="formatGroup">
			</el-table-column>
			<el-table-column prop="basic.desc" label="简介" :formatter="formatDesc" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" width="180" >
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
		<el-dialog title="新增文章" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="分组">
					<el-select v-model="addForm.group" placeholder="请选择">
				    <el-option
				      v-for="item in groups"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				</el-form-item>

				<el-form-item label="封面图片">
					<el-upload
				  class="avatar-uploader"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload">
				  <img v-if="imageUrl" :src="imageUrl" class="avatar-2">
				  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				</el-form-item>

				<el-form-item label="简介">
					<el-input v-model="addForm.desc" :autosize="{ minRows: 5, maxRows: 10}" type="textarea"></el-input>
				</el-form-item>

			

				<el-form-item label="文章详情" :label-width="formLabelWidth">
			      <vue-html5-editor :content="content" :height="300" :z-index="1000" :auto-height="false" :show-module-name="false" @change="updateData"></vue-html5-editor>
			    </el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="修改文章" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="分组">
					<el-select v-model="editForm.group" placeholder="请选择">
				    <el-option
				      v-for="item in groups"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				</el-form-item>

				<el-form-item label="文章封面">
					<el-upload
				  class="avatar-uploader"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload">
				  <img v-if="imageUrl" :src="imageUrl" class="avatar-2">
				  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				</el-form-item>

				<el-form-item label="简介">
					<el-input v-model="editForm.desc" :autosize="{ minRows: 5, maxRows: 10}" type="textarea"></el-input>
				</el-form-item>

				<el-form-item label="文章详情" :label-width="formLabelWidth">
			      <vue-html5-editor :content="content" :height="300" :z-index="1000" :auto-height="false" :show-module-name="false" @change="updateData"></vue-html5-editor>
			    </el-form-item>


			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getArticleList, createArticle, updateArticle, removeArticle } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				activeName: 'first',
				percentStep: false,
				catalogOptions: [],
				catalogChildrenOptions: [],
				groups: [{
					label: '英文学习方法',
					value: '1'
				},{
					label: '育儿方法',
					value: '2'
				}],
				imageUrl: '',
				imageList: [],
				albumList: [],
				checkList: [],
				filters: {
					title: '',
					price: '全部'
				},
				products: [],

				content: '',
				formLabelWidth: '120px',
				
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
						{ required: true, message: '请输入文章名称', trigger: 'blur' }
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
						{ required: true, message: '请输入文章名称', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					group: '',
					avatar: '',
					desc: '',
					content: ''
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
			updateData(val) {
				this.content = val;
				// console.log(val);
			},
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
			formatGroup: function (row, column) {
				let group = '未知'
				this.groups.forEach(e => {
					if(e.value == row.basic.group)
						group = e.label
				})
				return group
			},
			formatDesc: function(row, column) {
				return row.basic.desc.substr(0, 60)+'...'
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
					title: this.filters.title,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getArticleList(para).then((res) => {
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
				this.$confirm('确认删除文章：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feedId: row.feedId };

					removeArticle(para).then((res) => {
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
					feedId: row.feedId
				});
				this.imageUrl = this.editForm.avatar
				this.content = this.editForm.content
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
					group: '',
					avatar: '',
					desc: '',
					content: ''
				};
				this.imageUrl = ''
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm, {
								avatar: this.imageUrl,
								content: this.content
							});

							updateArticle(para).then((res) => {
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
							let para = Object.assign({}, this.addForm, {
								avatar: this.imageUrl,
								content: this.content
							});
							
							createArticle(para).then((res) => {
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