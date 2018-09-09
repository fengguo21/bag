<template>
	<section>
		<el-tabs v-model="activeName">
	    	<el-tab-pane label="书单" name="p1">
	    	<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="filters.title" placeholder="书单标题"></el-input>
						</el-form-item>
						<el-form-item>
							<el-select v-model="filters.catalog" placeholder="书单分类" clearable>
							    <el-option
							      v-for="item in allCatalogs"
							      :key="item"
							      :label="item"
							      :value="item">
							    </el-option>
							  </el-select>
						</el-form-item>
						<el-form-item>
							<el-select v-model="filters.step" placeholder="书单状态" clearable>
							    <el-option
							      v-for="item in stepOptions"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							  </el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="queryBooks">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button  @click="handleAdd">新增书单</el-button>
						</el-form-item>
					</el-form>
				</el-col>

			<!--列表-->
				<el-table :data="books" highlight-current-row v-loading="listLoading" style="width: 100%;" >
					<el-table-column type="expand" style='overflow: hidden'>
				      <template scope="props">
				        <div>
				        	<h3 style='margin-top: 0;'>ID: {{ props.row.productId }}</h3>
				        	<p style='margin-top: 0;'>简介: {{ props.row.basic.text }}</p>
				        
				        	<p style='margin-top: 0;'>音频列表</p>
				        	<el-row>
				        	<el-col :span="4">
				        	<h4>序号</h4>
				        	</el-col>
				        	<el-col :span="4">
				        	<h4>标题</h4>
				        	</el-col>
				        	<el-col :span="4">
				        	<h4>时长</h4>
				        	</el-col>
				        	<el-col :span="8">
				        	<h4>地址</h4>
				        	</el-col>
				        	<el-col :span="4">
				        	<h4>文稿</h4>
				        	</el-col>
				        	</el-row>
				        	<el-row v-for="(item, key) in props.row.basic.audios">
				        		<el-col :span="4">
				        		{{key}}
				        		</el-col>
				        		<el-col :span="4">
				        		{{item.title}}
				        		</el-col>
				        		<el-col :span="4">
				        		{{item.period}}s
				        		</el-col>
				        		<el-col :span="8">
				        		{{item.path}}
				        		</el-col>
				        		<el-col :span="4">
				        		<span style="cursor:pointer;color:#20a0ff" @click="handleShowDoc(item)">查看文稿</span>
					        	</el-col>
				        	</el-row>
				        	
			        		
				        </div>
				      </template>
				    </el-table-column>
				    <el-table-column type="index" width="60"></el-table-column>
				    <el-table-column label="封面" width="100">
						<template scope="scope">
							<img :src="scope.row.basic.avatar" class="book-avatar" />
						</template>
					</el-table-column>
					<el-table-column prop="basic.title" label="标题" width="250" >
					</el-table-column>
					<el-table-column prop="basic.catalog" label="分类" width="100">
					</el-table-column>
					<el-table-column prop="basic.price" label="价格" width="100">
					</el-table-column>
					<el-table-column prop="basic.tags" label="标签" width="100">
					</el-table-column>
					<el-table-column prop="basic.audios.length" label="音频数" width="100">
					</el-table-column>
					<el-table-column prop="basic.readCount" label="阅读数">
					</el-table-column>
					<el-table-column prop="basic.order" label="权重">
					</el-table-column>
					<el-table-column prop="basic.step" label="状态">
						<template scope="scope">
							<p v-if="scope.row.basic.step==1" style="color: green">已上架</p>
							<p v-if="scope.row.basic.step==0" style="color: red">已下架</p>
						</template>
					</el-table-column>
					<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" >
					</el-table-column>
					<el-table-column label="操作" width="260">
						<template scope="scope">
							<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button size="small" type="primary" @click="handleEditAudios(scope.$index, scope.row)">音频</el-button>
							<el-button size="small" type="success" v-if="scope.row.basic.step!=1" @click="handleStep(1, scope.row)">上架</el-button>
							<el-button size="small" type="warning" v-if="scope.row.basic.step==1" @click="handleStep(0, scope.row)">下架</el-button>
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
							<el-input v-model="filters.title" placeholder="名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="getBookList">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button  @click="handleAddCatalog">新增分类</el-button>
						</el-form-item>
					</el-form>
				</el-col>

			<!--列表-->
				<el-table :data="catalogs" highlight-current-row v-loading="listLoading" style="width: 100%;" >
				    <el-table-column type="index" width="60"></el-table-column>
					<el-table-column prop="basic.order" label="分类排序" width="260" >
					</el-table-column>
					<el-table-column prop="basic.title" label="分类名称" min-width="200">
					</el-table-column>
					<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" >
					</el-table-column>
					
					<el-table-column label="操作" width="250">
						<template scope="scope">
							<el-button size="small" @click="handleEditCatalog(scope.$index, scope.row)">编辑</el-button>
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

		<!--新增书单弹窗-->
		<el-dialog title="新增书单" v-model="addFormVisible" :close-on-click-modal="false" @close='closeAdd'>
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="addForm.title" auto-complete="off" placeholder='请输入标题'></el-input>
				</el-form-item>

				<el-form-item label="分类" prop='catalog'>
					 <el-select v-model="addForm.catalog" placeholder="请选择">
					    <el-option
					      v-for="item in allCatalogs"
					      :key="item"
					      :label="item"
					      :value="item">
					    </el-option>
					  </el-select>
				</el-form-item>

				<el-form-item label="标签" prop='tags'>
					<el-checkbox v-model="tag.checked" v-for="tag in tags">{{ tag.title }}</el-checkbox>
				</el-form-item>

				<el-form-item label="权重" prop='order'>
					<el-input-number v-model="addForm.order" placeholder='请输入权重'></el-input-number>
				</el-form-item>

				<el-form-item label="作者" prop='doc'>
					<el-input v-model="addForm.author" placeholder='请输入作者' class="mini-input"></el-input>
				</el-form-item>

				<el-form-item label="阅读数" prop='doc'>
					<el-input-number v-model="addForm.readCount" placeholder='请输入阅读数'></el-input-number>
				</el-form-item>
				
				<el-form-item label="价格" prop='price'>
					<el-input-number v-model="addForm.price" class='small-el-input' placeholder='请输入书单价格'></el-input-number>
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
				<p>建议尺寸：280px * 370px</p>
				</el-form-item>

				<el-form-item label="简介" prop='text'>
					<el-input type="textarea" :autosize="{minRows: 5}" v-model="addForm.text" placeholder='请输入简介'></el-input>
				</el-form-item>
				
			</el-form>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelAdd">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑书单弹窗-->
		<el-dialog title="编辑书单" v-model="editFormVisible" :close-on-click-modal="false" @close='closeAdd'>
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题">
					<el-input v-model="editForm.title" auto-complete="off" placeholder='请输入标题'></el-input>
				</el-form-item>

				<el-form-item label="分类" prop='catalog'>
					 <el-select v-model="editForm.catalog" placeholder="请选择">
					    <el-option
					      v-for="item in allCatalogs"
					      :key="item"
					      :label="item"
					      :value="item">
					    </el-option>
					  </el-select>
				</el-form-item>

				<el-form-item label="标签" prop='tags'>
					<el-checkbox v-model="tag.checked" v-for="tag in tags">{{ tag.title }}</el-checkbox>
				</el-form-item>

				<el-form-item label="权重" prop='order'>
					<el-input-number v-model="editForm.order" placeholder='请输入权重'></el-input-number>
				</el-form-item>

				<el-form-item label="作者" prop='doc'>
					<el-input v-model="editForm.author" placeholder='请输入作者' class="mini-input"></el-input>
				</el-form-item>

				<el-form-item label="阅读数" prop='doc'>
					<el-input-number v-model="editForm.readCount" placeholder='请输入阅读数'></el-input-number>
				</el-form-item>
				
				<el-form-item label="价格" prop='price'>
					<el-input-number v-model="editForm.price" class='small-el-input' placeholder='请输入书单价格'></el-input-number>
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
				<p>建议尺寸：280px * 370px</p>
				</el-form-item>

				<el-form-item label="简介" prop='text'>
					<el-input type="textarea" :autosize="{minRows: 5}" v-model="editForm.text" placeholder='请输入简介'></el-input>
				</el-form-item>

			</el-form>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelEdit">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!-- 小窗口，新增分类 -->
		<el-dialog title="新增分类" v-model="addCatalogFormVisible" :close-on-click-modal="false" @close='closeAddCatalog' size='tiny'>
			<el-form :model="addCatalogForm" label-width="120px" :rules="addCatalogRules" ref="addCatalogForm">
				<el-form-item label="名称" prop='title'>
					<el-input v-model="addCatalogForm.title" auto-complete="off" placeholder='请输入分类名称' size='small'></el-input>
				</el-form-item>
				<el-form-item label="排序" prop='order'>
					<el-input-number v-model="addCatalogForm.order" placeholder='请输入排序' size='small'></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelAddCatalog">取消</el-button>
				<el-button type="primary" @click.native="addCatalogOk">确定</el-button>
			</div>
		</el-dialog>
		<!-- 小窗口，修改分类 -->
		<el-dialog title="修改分类" v-model="editCatalogFormVisible" :close-on-click-modal="false" @close='closeEditCatalog' size='tiny'>
			<el-form :model="editCatalogForm" label-width="120px" :rules="editCatalogFormRules" ref="editCatalogForm">
				<el-form-item label="名称" prop='title'>
					<el-input v-model="editCatalogForm.title" auto-complete="off" placeholder='请输入分类名称' size='small'></el-input>
				</el-form-item>
				<el-form-item label="排序" prop='order'>
					<el-input-number v-model="editCatalogForm.order" placeholder='请输入排序' size='small'></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelEditCatalog">取消</el-button>
				<el-button type="primary" @click.native="editCatalogOk">确定</el-button>
			</div>
		</el-dialog>
		<!-- 显示文稿 -->
		<el-dialog title="文稿" v-model="showDocVisible" :close-on-click-modal="false" @close='showDocVisible=false' size='tiny'>
			<div v-html="doc"></div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="showDocVisible=false">关闭</el-button>
			</div>
		</el-dialog>			
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { dshCreateCatalog, dshUpdateCatalog, dshRemoveCatalog, dshFindCatalogByState, dshCreateBook, dshUpdateBook, dshRemoveBook, dshFindBookByState,  dshFindBookById, avatarUrl } from '../../api/api';
	import moment from 'moment'

	export default {
		filters: {
			filterAgentName(data) {
				if(data) {
					return data.basic.name
				} else {
					return '未设置'
				}
			},
			filterAgentPhone(data) {
				if(data) {
					return data.basic.phone
				} else {
					return '未设置'
				}
			}
		},
		data() {
			return {
				agentLevel: '',
				multipleSelection: [],
				options: [],
				imageUrl: '',
				tags: [{title:'New', checked: false}, {title:'Hot', checked: false}],
				stepOptions: [{
					label: '已上架',
					value: 1
				}, {
					label: '已下架',
					value: 0
				}],
				allCatalogs: [],
				agent: '',
				activeName: 'p1',
				filters: {
					name: '',
					phone: ''
				},
				multiple: false,
				books: [],
				total: 0,
				page: 1,
				catalogs: [],
				total2: 0,
				page2: 1,
				listLoading: true,	
				editOrAdd: '',		
				mapVisible: false,
				addBatchFormVisible: false,
				addBatchPath: '',
				avatarUrl: avatarUrl,
				device: {},	
				doc: '',
				showDocVisible: false,
				// 增加新书单
				addForm: {
					title: '',
					price: '',
					text: '',
					catalog: '',
					tags: [],
					order: 0,
					readCount: 0,
					author: '',
					audios: []
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入书单名称', trigger: 'blur' }
					]
				},
				addCatalogFormVisible: false,	
				addCatalogForm: {
					title: '',
					order: 0
				},
				addCatalogRules: {
					title: [
						{ required: true, message: '请输入分类名称', trigger: 'blur' }
					]
				},
				// 编辑新书单
				editCatalogForm: {
					title: '',
					order: 0
				},
				editCatalogFormVisible: false,//新增界面是否显示
				editCatalogFormRules: {
					title: [
						{ required: true, message: '请输入分类名称', trigger: 'blur' }
					]
				},	
				editFormVisible: false,
				editForm: {
					title: '',
					price: '',
					text: '',
					catalog: '',
					tags: [],
					order: 0,
					readCount: 0,
					author: '',
					audios: []
				},
				editFormRules: {
					title: [
						{ required: true, message: '请输入书单名称', trigger: 'blur' }
					]
				}		
			}
		},
		computed: {
			level() {
				return this.store.get('user').role.level
			}
		},
		methods: {
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
		      // 图片上传成功钩子
			handleUploadSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				console.log(res.data.url)
				this.addBatchPath = res.data.url
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
			//获取代理商列表
			getAllCatalogList() {
				dshFindCatalogByState({
					page: 1,
					size: 1000
				}).then((res) => {
					if(res.code === 0) {
						this.listLoading = false;
						this.allCatalogs = res.data.list.map(e => {
							return e.basic.title
						})
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
					}
				})
			},
			//获取代理商列表
			getCatalogList() {
				dshFindCatalogByState({
					title: this.filters.title,
					page: this.page2,
					size: 10
				}).then((res) => {
					if(res.code === 0) {
						this.listLoading = false;
						this.total2 = res.data.total;
						this.catalogs = res.data.list;
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
					}
				})
			},
			// 获取书单列表
			getBookList() {
				dshFindBookByState({
					title: this.filters.title,
					tag: this.filters.tag,
					catalog: this.filters.catalog,
					step: this.filters.step,
					page: this.page,
					size: 10
				}).then((res) => {
					if(res.code === 0) {
						this.listLoading = false;
						this.total = res.data.total;
						this.books = res.data.list;
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
					}
				})
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.getBookList();
			},
			// 分页2
			handleCurrentChange2(val) {
				this.page2 = val;
				this.getCatalogList();
			},
			// 增加书单
			handleAdd() {
				this.addFormVisible = true;
				this.addForm = {
					title: '',
					price: '',
					text: '',
					catalog: '',
					tags: [],
					readCount: 0,
					order: 0,
					author: '',
					audios: []
				}
			},
			// 增加分类
			handleAddCatalog() {
				this.addCatalogFormVisible = true;
			},
			// 取消增加
			cancelAdd() {
				this.addFormVisible = false;
			},
			// 确认增加
			addSubmit() {
				this.$refs['addForm'].validate(valid => {
					if (valid) {
				if(this.addForm.price <= 0){
					this.$message.warning('价格不能为0')
					return
				}
				const tags = []
				this.tags.forEach(e => {
					if(e.checked)
						tags.push(e.title)
				})
				let para = Object.assign({}, this.addForm, {
					tags: tags,
					avatar: this.imageUrl
				})

				this.addLoading = true;
				dshCreateBook(para).then(res => {
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '添加成功'
						})
						this.getBookList();
						this.cancelAdd();
						this.addLoading = false;
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
					}
				})
				}
				})
			},
			closeAdd() {
				
			},
			// 编辑书单
			handleEdit(index, row) {
				// console.log(index, row);
				this.editOrAdd = 'edit';
				this.editFormVisible = true;
				this.editForm = {
					productId: row.productId,
					title: row.basic.title,
					catalog: row.basic.catalog,
					tags: row.basic.tags,
					price: row.basic.price,
					text: row.basic.text,
					author: row.basic.author,
					order: row.basic.order,
					readCount: row.basic.readCount,
					audios: row.basic.audios
				}
				this.imageUrl = row.basic.avatar
				this.tags.forEach(e => {
					e.checked = false
					row.basic.tags.forEach( r => {
						if(e.title == r)
							e.checked = true
					})
				})
			},
			// 取消编辑
			cancelEdit() {
				this.editFormVisible = false;
			},
			cancelEditCatalog() {
				this.editCatalogFormVisible = false
			},
			// 确认修改
			editSubmit() {
				const tags = []
				this.tags.forEach(e => {
					if(e.checked)
						tags.push(e.title)
				})
				let para = Object.assign({
					avatar: this.imageUrl
				}, this.editForm, {
					tags: tags
				})

				this.addLoading = true;
				dshUpdateBook(para).then(res => {
					// console.log(res);
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '修改成功'
						})
						this.getBookList();
						this.cancelEdit();
						this.addLoading = false;
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
					}
				})
			},
			handleEditAudios(index, row) {
				this.$router.push({path:'/dsh/page1010', query:{productId: row.productId}})
			},
			// 编辑分类
			handleEditCatalog(index, row) {
				this.editCatalogFormVisible = true;
				this.editCatalogForm = {
					feedId: row.feedId,
					title: row.basic.title,
					order: row.basic.order
				}
			},
			closeAddCatalog() {
				
			},
			closeEditCatalog() {
				
			},
			// 分配代理商
			handleControl(index, row) {
				this.controlFormVisible = true;
				this.controlForm.productId = row.productId;
				// console.log(index, row);
			},
			cancelContor() {
				this.controlFormVisible = false;
			},
			addCatalogOk() {
				this.$refs['addCatalogForm'].validate(valid => {
					if (valid) {						
						console.log(this.addCatalogForm)
						dshCreateCatalog({
							title: this.addCatalogForm.title
						}).then(res => {
							if(res.code)
								this.$message.error(res.message)
							else{
								this.$message.success('新增分类成功')
								this.getCatalogList()
							}
						})
						this.addCatalogFormVisible = false
					} else {
						this.$message.error('信息不能为空');
						return false;
					}
				})
			},
			editCatalogOk() {
				this.$refs['editCatalogForm'].validate(valid => {
					if (valid) {
						dshUpdateCatalog({
							feedId: this.editCatalogForm.feedId,
							title: this.editCatalogForm.title,
							order: this.editCatalogForm.order
						}).then(res => {
							if(res.code)
								this.$message.error(res.message)
							else{
								this.$message.success('修改分类成功')
								this.getCatalogList()
							}
						})
						this.editCatalogFormVisible = false
					} else {
						this.$message.error('信息不能为空');
						return false;
					}
				})
			},
			// 删除价格
			delPrice(index, row) {
				if(this.editOrAdd == 'add') {
					let key = this.addForm.price.indexOf(row);
					// console.log(this.addForm.price.indexOf(row));
					this.addForm.price.splice(key, 1);
				} else if(this.editOrAdd == 'edit') {
					let key = this.editForm.price.indexOf(row);
					this.editForm.price.splice(key, 1);
				}				
			},
			// 新增价格
			addAudio() {
				this.addPriceVisible = true;
			},
			cancelAddPrice() {
				this.addPriceVisible = false;
			},
			addPriceOk() {
				this.$refs['addPriceFrom'].validate(valid => {
					if (valid) {
						if(this.editOrAdd == 'add') {
							this.addForm.price.push(this.addPriceFrom);
						} else if(this.editOrAdd == 'edit') {
							this.editForm.price.push(this.addPriceFrom);
						}
						this.cancelAddPrice();
					} else {
						this.$message.error('信息不能为空');
						return false;
					}
				})
			},
			closeAddPrice() {
				this.addPriceFrom = {
					chargeTime: '',
					cost: '',
					payFee: ''
				}
			},
			// 上下架书单
			handleStep(step, row) {
				const tips = (step==1)?'上架':'下架'
				this.$confirm(`确定要${tips}书单：${row.basic.title} 吗?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          dshUpdateBook({
					productId: row.productId,
					step: step
				}).then(res => {
					// console.log(res);
					if(res.code === 0) {
						this.$message({
						  type: 'success',
						  message: `${tips}成功`
						});
						this.getBookList();
					} else {
						this.$message({
						  type: 'error',
						  message: res.message
						});
					}
					// console.log(res);
				})
		        })
			},
			// 删除书单
			handleDel(index, row) {
				this.$confirm(`确定要删除书单：${row.basic.title} 吗?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.delBook(row);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			// 删除分类
			handleDelCatalog(index, row) {
				this.$confirm(`确定要删除分类：${row.basic.title} 吗?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          dshRemoveCatalog({
		          	feedId: row.feedId
		          }).then(res => {
		          	if(res.code)
		          		this.$message.error(res.message)
		          	else{
		          		this.$message.success('删除分类成功')
		          		this.getCatalogList()
		          	}
		          })
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			delBook(row) {
				// console.log(row);
				dshRemoveBook({
					productId: row.productId
				}).then(res => {
					// console.log(res);
					if(res.code === 0) {
						this.$message({
						  type: 'success',
						  message: '删除成功!'
						});
						this.getBookList();
					} else {
						this.$message({
						  type: 'error',
						  message: res.message
						});
					}
					// console.log(res);
				})
				// console.log(index, row);
			},
			uploadSubmit() {
				this.addBatchFormVisible = false
				createNewDevBatch({
					path: this.addBatchPath
				}).then( res => {
					if(res.code){
						this.$message({
						  type: 'error',
						  message: res.message
						});
						return
					}
					this.$message({
						  type: 'success',
						  message: '新增书单数量：'+res.data.length
						});
					this.getBookList()
				})
			},
			// 批量移库
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
		    delSelect() {
		    	this.controlFormVisible = true;
		    	// console.log(this.multipleSelection);
		    },
		    handleShowDoc(row) {
		    	this.doc = row.doc.replace(/\n/g, '<br>')
		    	this.showDocVisible = true
		    },
		    queryBooks() {
		    	this.page = 1
		    	this.getBookList()
		    }
		},
		mounted() {
			this.getBookList();
			this.getCatalogList();
			this.getAllCatalogList()
		}
	}

</script>

<style scoped lang='scss'>
.book-avatar{
	vertical-align: middle;
	margin: 5px 0;
	max-height: 100px;
}
.mini-input{
	width: 200px;
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
  .el-vue-amap-container{
  	height: 500px;
  }
  .server-wrap, .port-wrap {
  	float: left;
  }
  .port-wrap {
  	margin-left: 40px;
  }
  .price-list__wrap {
  	width: 100%;
  	.price-table {
  		width: auto;
  		overflow:hidden;
  		&:first-child {
  			span {
  				border-top: 1px solid #999;	
  			}
  		}
  		.success {
  			color: #13CE66
  		}
  		.error {
  			color: #FF4949
  		}
  		span {
  			float: left;
  			box-sizing: border-box;
  			min-width: 150px;
  			padding: 5px 10px;
  			height: 30px;	
  			line-height: 19px;	
  			border: 1px solid #999;
  			border-top: 0;
  			&:first-child {
  				border-right: 0
  			}
  		}
  	}
  }
</style>