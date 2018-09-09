<template>
	<section>
	<el-tabs v-model="activeName">
    <el-tab-pane label="图库" name="p1">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="图库名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProducts">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button  @click="handleAdd">新增图库</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
		
			<el-table-column prop="basic.title" label="标题" width="250" >
			</el-table-column>
			<el-table-column prop="basic.catalog" label="一级分类" width="150" >
			</el-table-column>
			<el-table-column prop="basic.childCatalog" label="二级分类" width="150" >
			</el-table-column>
			<el-table-column prop="basic.images.length" label="图片张数" min-width="150" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" width="180" >
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleShow(scope.$index, scope.row)">查看</el-button>
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
    
		</el-tab-pane>
		<el-tab-pane label="分类" name="p2">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="分类名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProducts">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button  @click="handleAddCatalog">新增分类</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="catalogs" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			
			<el-table-column prop="basic.title" label="标题" width="250" >
			</el-table-column>
			<el-table-column prop="basic.children" label="二级分类" :formatter="formatChildren" min-width="300" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" width="180" >
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
					<el-button size="small" @click="handleEditCatalog(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="handleDelCatalog(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange2" :page-size="10" :total="total2" style="float:right;">
			</el-pagination>
		</el-col>
		</el-tab-pane>
		</el-tabs>

		

		<!--新增界面-->
		<el-dialog title="新增图库" v-model="addFormVisible" :close-on-click-modal="false" @open='initForm'>
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="分类" >
					<el-select v-model="addForm.catalog" @change="catalogChange" placeholder="请选择一级分类">
					    <el-option 
					      v-for="item in catalogOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					  <el-select v-model="addForm.childCatalog" placeholder="请选择二级分类">
					    <el-option
					      v-for="item in catalogOptions2"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>

				

				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="修改图库" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="分类" >
					<el-select v-model="editForm.catalog" @change="catalogChange" placeholder="请选择一级分类">
					    <el-option 
					      v-for="item in catalogOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					  <el-select v-model="editForm.childCatalog" placeholder="请选择二级分类">
					    <el-option
					      v-for="item in catalogOptions2"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>

				<el-form-item label="图片集">
					<div v-for="(item, index) in editForm.images" class="single-image">
						<img :src="item.url" class="single-image">
						<p>{{item.text}}</p>
						<p style="text-align:right">
						<el-button type="text" @click="handleUpdateImage(index, item)">修改</el-button>
						<el-button type="text" @click="handleRemoveImage(index)">删除</el-button>
						</p>
					</div>
					<el-button type="primary" icon="plus" @click="handleAddImage"></el-button>
				</el-form-item>





			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增分类界面-->
		<el-dialog title="新增分类" v-model="addCatalogFormVisible" :close-on-click-modal="false">
			<el-form :model="addCatalogForm" label-width="120px" :rules="addCatalogFormRules" ref="addCatalogForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="addCatalogForm.title" placeholder="分类标题" auto-complete="off"></el-input>
				</el-form-item>

				
				
				<el-form-item label="子分类">
					<el-input type="textarea" :rows="10" placeholder="每行一个子分类名称" v-model="addCatalogForm.children"></el-input>
				</el-form-item>

				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addCatalogFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addCatalogSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑分类界面-->
		<el-dialog title="修改分类" v-model="editCatalogFormVisible" :close-on-click-modal="false">
			<el-form :model="editCatalogForm" label-width="80px" :rules="editCatalogFormRules" ref="editCatalogForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editCatalogForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="子分类">
					<el-input type="textarea" :rows="10" v-model="editCatalogForm.children"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editCatalogFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editCatalogSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增图片-->
		<el-dialog title="新增图片" v-model="addImageVisible" :close-on-click-modal="false">
			<el-form :model="addImageForm" label-width="120px" :rules="addImageFormRules" ref="addImageForm">
				

				

				<el-form-item label="图片">
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

				
				
				<el-form-item label="说明">
					<el-input type="textarea" :rows="5" v-model="addImageForm.text"></el-input>
				</el-form-item>

				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addImageVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addImageSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--修改图片-->
		<el-dialog title="修改图片" v-model="updateImageVisible" :close-on-click-modal="false">
			<el-form :model="updateImageForm" label-width="120px" :rules="updateImageFormRules" ref="updateImageForm">
				

				

				<el-form-item label="图片">
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

				
				
				<el-form-item label="说明">
					<el-input type="textarea" :rows="5" v-model="updateImageForm.text"></el-input>
				</el-form-item>

				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="updateImageVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updateImageSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--显示详情-->
		<el-dialog title="图库详情" v-model="showFormVisible" :close-on-click-modal="false">
			<el-row>
			<el-col :span="6">
				图库ID:
			</el-col>
			<el-col :span="18">
				{{ showForm.feedId }}
			</el-col>
			</el-row>
			
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				图库标题:
			</el-col>
			<el-col :span="18">
				{{ showForm.basic && showForm.basic.title }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				一级分类:
			</el-col>
			<el-col :span="18">
				{{ showForm.basic && showForm.basic.catalog }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				二级分类:
			</el-col>
			<el-col :span="18">
				{{ showForm.basic && showForm.basic.childCatalog }}
			</el-col>
			</el-row>
			
			
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				图片集:
			</el-col>
			<el-col :span="18">
				<div v-for="item in showForm.basic && showForm.basic.images">
				<img :src="item.url"  class="single-image"/>
				<p>{{item.text}}</p>
				</div>
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				创建时间:
			</el-col>
			<el-col :span="18">
				{{ formatTime(showForm.created) }}
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
	import { getHssyAlbumList, addHssyAlbum, editHssyAlbum, removeHssyAlbum, addHssyCatalog, getHssyCatalogList, editHssyCatalog, removeHssyCatalog } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				activeName: 'p1',
				percentStep: false,
				catalogOptions: [],
				catalogOptions2: [],
				allCatalogs: [],
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
				total2: 0,
				page2: 1,
				listLoading: false,
				sels: [],//列表选中列

				showFormVisible: false,
				showForm: {},

				editStockFormVisible: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入图库名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					feedId: '',
					title: '',
					tags: [],
					catalog: '',
					childCatalog: '',
					avatar: '',
					price: 0,
					text: '',
					images: []
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					tags: [],
					price: 0,
					catalog: '',
					childCatalog: '',
					avatar: '',
					text: '',
					images: []
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
					channel: 1,
					children: '',
					order: 0
				},

				editCatalogFormVisible: false,//新增界面是否显示
				editCatalogFormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				editCatalogForm: {
					title: '',
					children: '',
					order: 0
				},

				addImageVisible: false,
				addImageForm: {
					text: '',
					avatar: '',
					feedId: ''
				},
				addImageFormRules: {
					
				},

				updateImageVisible: false,
				updateImageForm: {
					text: '',
					avatar: '',
					feedId: ''
				},
				updateImageFormRules: {
					
				},

			}
		},
		methods: {
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatTime( time ) {
				return moment( time ).format('YYYY-MM-DD HH:mm:ss')
			},
			catalogChange(catalog) {
				this.allCatalogs.forEach(c => {
					if(c.basic.title == catalog)
						this.catalogOptions2 = c.basic.children.map(e => ({
							label: e,
							value: e
						}))
				})
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
				return row.basic.children.join(', ')
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
			handleCurrentChange2(val) {
				this.page2 = val;
				this.getCatalogs();
			},
			handleClick(){

			},
			handleAddImage() {
				this.addImageVisible = true
				this.addImageForm = {
					text: '',
					avatar: '',
					feedId: this.editForm.feedId
				}
				this.imageUrl = ''
			},
			//获取用户列表
			getProducts() {
				let para = {
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getHssyAlbumList(para).then((res) => {
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

			//获取用户列表
			getCatalogs() {
				let para = {
					channel: 1,
					page: this.page2,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getHssyCatalogList(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					
					this.total2 = res.data.total;
					this.catalogs = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},

			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除图库：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feedId: row.feedId };

					removeHssyAlbum(para).then((res) => {
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
			//删除分类
			handleDelCatalog: function (index, row) {
				this.$confirm('确认删除分类：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feedId: row.feedId };

					removeHssyCatalog(para).then((res) => {
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
			handleRemoveImage(index) {
				this.editForm.images.forEach((e, k) => {
					if(k == index)
						this.editForm.images.splice(k, 1)
				})
			},
			handleUpdateImage(index, row) {
				console.log(index)
				this.updateImageVisible = true
				this.updateImageForm = row
				this.updateImageForm.index = index
				this.imageUrl = row.url
			},
			updateImageSubmit() {
				this.editForm.images.forEach((e, k) => {
					if(k == this.updateImageForm.index)
						this.editForm.images[k] = {
							url: (this.imageUrl)?this.imageUrl:this.updateImageForm.url,
							text: this.updateImageForm.text
						}
				})
				this.updateImageVisible = false
			},
			//显示详情
			handleShow: function (index, row) {
				this.showFormVisible = true;
				this.showForm = row
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row.basic, {
					feedId: row.feedId
				});
				console.log(row)
				this.imageUrl = this.editForm.avatar
				this.imageList = this.editForm.images
				console.log('htis.editForm......', this.editForm)
			},
			//显示编辑界面
			handleEditCatalog: function (index, row) {
				this.editCatalogFormVisible = true;
				this.editCatalogForm = Object.assign({}, row.basic, {
					feedId: row.feedId
				});
				this.editCatalogForm.children = row.basic.children.join('\n')
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					title: '',
					tags: [],
					price: 0,
					catalog: '',
					childCatalog: '',
					avatar: '',
					text: '',
					images: []
				};
				this.imageUrl = ''
				this.imageList = []
			},
			//显示新增界面
			handleAddCatalog: function () {
				this.addCatalogFormVisible = true;
				this.addCatalogForm = {
					title: '',
					channel: 1,
					children: ''
				};
			},
			
			
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);

							para.tags = this.checkList
							para.avatar = this.imageUrl
							para.images = this.imageList
							
							addHssyAlbum(para).then((res) => {
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



							editHssyAlbum(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getProducts();
							});
						});
					}
				});
			},
			//新增分类
			addCatalogSubmit: function () {
				this.$refs.addCatalogForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addCatalogForm);
							para.children = para.children.trim().split('\n')
							
							addHssyCatalog(para).then((res) => {
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
			//编辑分类
			editCatalogSubmit: function () {
				this.$refs.editCatalogForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editCatalogForm);
							para.children = para.children.trim().split('\n')



							editHssyCatalog(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editCatalogForm'].resetFields();
								this.editCatalogFormVisible = false;
								this.getCatalogs();
							});
						});
					}
				});
			},
			//新增图片
			addImageSubmit: function () {
				this.$refs.addImageForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							console.log('this.editFOrm.images', this.editForm.images)

							this.editForm.images.push({
								url: this.imageUrl,
								text: this.addImageForm.text
							})


							let para = {
								feedId: this.editForm.feedId,
								images: this.editForm.images || []
								
							}

							editHssyAlbum(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addImageForm'].resetFields();
								this.addImageVisible = false;
							});
						});
					}
				});
			},

		},
		mounted() {
			this.getProducts();
			this.getCatalogs();
			getHssyCatalogList({
				channel: 1
			}).then(res => {
				if(!res.data){
					return
				}
				this.catalogOptions = res.data.list.map(e => ({
					label: e.basic.title,
					value: e.basic.title
				}))
				this.allCatalogs = res.data.list
			})
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
  .single-image{
  	border-bottom:1px solid #e3e3e3;
  	margin-bottom: 10px;
  	max-width: 100%;
  }
</style>