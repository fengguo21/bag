<template>
	<section>
	<el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="Product" name="first">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="Product Name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProducts">Search</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">ADD new product</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column label="Figure" width="100">
				<template scope="scope">
					<img :src="scope.row.basic.avatar" style="width:60px;height:60px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.title" label="Title" width="220" sortable>
			</el-table-column>
			<el-table-column prop="basic.price" label="Price" width="100" sortable>
			</el-table-column>
			<el-table-column prop="basic.hot" :formatter='formatHot' label="Hot sell" width="100">
			</el-table-column>
			<el-table-column label="Label">
				<template scope="scope">
					<el-tag type="primary" style="margin-right:5px;" v-for="t in scope.row.basic.tags" :key='t'>{{t}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="on Shelf status" width='140'>
				<template scope="scope">
					<el-tag :type="scope.row.step|filterTagType">{{scope.row.step|filterStep}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="basic.stock" label="Stock" width="100" sortable>
			</el-table-column>
			<el-table-column prop="created" label="Create date" :formatter="formatDate" min-width="150" sortable>
			</el-table-column>
			<el-table-column label="Operation" width="450">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">Modify</el-button>
					<el-button size="small" @click="handleEditStock(scope.$index, scope.row)" type='primary'>change Stock</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
					<el-button size="small" icon="document" @click="handleCopy(scope.$index, scope.row)">Copy</el-button>
					<el-button v-if='scope.row.step==0' size="small" type="warning" @click="handleUpAndDown(scope.$index, scope.row)">On shelf</el-button>
					<el-button v-if='scope.row.step==1' size="small" type="warning" @click="handleUpAndDown(scope.$index, scope.row)">Off shelf</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
    <el-tab-pane label="Label" name="second">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="Label Name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProducts">Search</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAddTag">Add new Label</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tags" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.title" label="Label Name" sortable>
			</el-table-column>
			<el-table-column prop="basic.order" label="Sorting" sortable>
			</el-table-column>
			<el-table-column label="Operation">
				<template scope="scope">
					<el-button size="small" @click="handleEditTag(scope.$index, scope.row)">Modify</el-button>
					<el-button type="danger" size="small" @click="handleDelTag(scope.$index, scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total2" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
  </el-tabs>
		

		
		<!--新增界面-->
		<el-dialog title="ADD new product" v-model="addFormVisible" :close-on-click-modal="false" @close='init("addForm")'>
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="Title" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>

				
				<el-form-item label="Label" prop="tags">
					<el-checkbox-group v-model="checkList">
				    <el-checkbox :label="(t.basic)?t.basic.title:''" v-for="t in tags" :key='t.basic.title'></el-checkbox>
				  </el-checkbox-group>
				</el-form-item>				

				<el-form-item label="Figure">
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

				<el-form-item label="Stock">
					<el-input-number v-model="addForm.stock" :min="0"></el-input-number>
				</el-form-item>
				
				<!-- <el-form-item label="价格">
					<el-input-number v-model="addForm.price" :min="0" :debounce='3000'></el-input-number>
				</el-form-item>

				<el-form-item label="成本">
					<el-input-number v-model="addForm.cost" :min="0" :debounce='3000'></el-input-number>
				</el-form-item> -->

				<el-form-item label="Hotsell">
					<el-switch
					  v-model="hot"
					  on-color="#13ce66"
					  off-color="#ff4949">
					</el-switch>
				</el-form-item>	

				<el-form-item label="Whole Sell Price">
					<!-- <el-switch
					  v-model="percentStep"
					  on-color="#13ce66"
					  off-color="#ff4949">
					</el-switch> -->
					<el-button size='mini' type='primary' @click='addPrices'> Add </el-button>
				</el-form-item>

				<el-table
					v-if='percentStep'
				    :data="prices"
				    border
				    style="width: 100%; margin-bottom: 15px"
				>
				    <el-table-column
				      prop="price"
				      label="Price"
				      sortable
				    >
				    </el-table-column>
				    <el-table-column
				      prop="cost"
				      label="Cost"
				      sortable
				    >
				    </el-table-column>
				    <el-table-column
				      prop="count"
				      label="QTY"
				      sortable
				    >
				    </el-table-column>
				    <el-table-column label="Operation" width='120'>
			          <template scope="scope">
			            <el-button
			              size="small"
			              type="danger"
			              @click="delPrices(scope.$index, scope.row)">Delete</el-button>
			          </template>
			        </el-table-column>
				</el-table>

				<el-form-item label="Carousel figure">
					<el-upload
				  class="upload-demo"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :on-preview="handlePreview"
				  :on-remove="handleRemove"
				  :on-success="handleAlbumSuccess"
				  :file-list="albumList"
				  list-type="picture">
				  <el-button size="small" type="primary">Click upload</el-button>
				  <div slot="tip" class="el-upload__tip">jpg/png file, &lt;500kb </div>
				</el-upload>
				</el-form-item>

				<!-- <el-form-item label="颜色">
					<el-checkbox-group v-model="colorList">
					    <el-checkbox :label="val" v-for='val in colors' :key='val'></el-checkbox>
					    <span style='margin-left: 5px' v-if='isColorAdd'>
							<el-input v-model="newColor" placeholder="请输新颜色" size="mini" style='width: 20%;'></el-input>
							<el-button type="success" size="mini" @click='submitSaveColor'>确认</el-button>
							<el-button style='margin-left: 0;' size="mini" @click='cancelSaveColor'>取消</el-button>
						</span>
						<el-button style='margin-left: 10px;' type="primary" size="mini" @click='addNewColor'>新增</el-button>
					</el-checkbox-group>	
				</el-form-item> -->

				<el-form-item label="Specification">
					<el-input type="textarea" v-model="addForm.specs" placeholder='Different spec in different row'></el-input>
				</el-form-item>
				
				<!-- <el-form-item label="商品参数">
					<el-input type="textarea" v-model="addForm.parameters" placeholder='不同商品参数用回车来区分，同一参数用空格区分参数名和参数值'></el-input>
				</el-form-item> -->

				<el-form-item label="Product detail info">
					<vue-html5-editor :content="content" :height="500" :z-index="1000" :auto-height="false" :show-module-name="false" @change="updateData"></vue-html5-editor>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">Submit</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="Edit product" v-model="editFormVisible" :close-on-click-modal="false" @close='init("editForm")'>
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="Title" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>

				
				<el-form-item label="Label" prop="tags">
					<el-checkbox-group v-model="checkList">
				    <el-checkbox :label="(t.basic)?t.basic.title:''" v-for="t in tags" :key='t.basic.title'></el-checkbox>
				  </el-checkbox-group>
				</el-form-item>
				
				<el-form-item label="Figure">
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


				
				<!-- <el-form-item label="价格">
					<el-input-number v-model="editForm.price" :min="0" :max="200"></el-input-number>
				</el-form-item>

				<el-form-item label="成本">
					<el-input-number v-model="editForm.cost" :min="0" ></el-input-number>
				</el-form-item> -->

				<el-form-item label="Hotsell">
					<el-switch
					  v-model="hot"
					  on-color="#13ce66"
					  off-color="#ff4949">
					</el-switch>
				</el-form-item>

				<el-form-item label="Whole Sell Price">
					<!-- <el-switch
					  v-model="percentStep"
					  on-color="#13ce66"
					  off-color="#ff4949">
					</el-switch> -->
					<el-button size='mini' type='primary' @click='addPrices'> Add </el-button>
				</el-form-item>

				<el-table
					v-if='percentStep'
				    :data="prices"
				    border
				    style="width: 100%; margin-bottom: 15px"
				>
				    <el-table-column
				      prop="price"
				      label="Price"
				      sortable
				    >
				    </el-table-column>
				    <el-table-column
				      prop="cost"
				      label="Cost"
				      sortable
				    >
				    </el-table-column>
				    <el-table-column
				      prop="count"
				      label="QTY"
				      sortable
				    >
				    </el-table-column>
				    <el-table-column label="Operation" width='120'>
			          <template scope="scope">
			            <el-button
			              size="small"
			              type="danger"
			              @click="delPrices(scope.$index, scope.row)">Delete</el-button>
			          </template>
			        </el-table-column>
				</el-table>

				<el-form-item label="Carousel figure">
					<el-upload
				  class="upload-demo"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :on-preview="handlePreview"
				  :on-remove="handleRemove"
				  :on-success="handleAlbumSuccess"
				  :file-list="albumList"
				  list-type="picture">
				  <el-button size="small" type="primary">Click upload</el-button>
				  <div slot="tip" class="el-upload__tip">jpg/png file, &lt;500kb</div>
				</el-upload>
				</el-form-item>

				<el-form-item label="Specification">
					<el-input type="textarea" v-model="editForm.specs" placeholder='Different spec in different row'></el-input>
				</el-form-item>
				
				<!-- <el-form-item label="商品参数">
					<el-input type="textarea" v-model="editForm.parameters" placeholder='不同商品参数用回车来区分，同一参数用空格区分参数名和参数值'></el-input>
				</el-form-item> -->

				<el-form-item label="Product detail info">
					<vue-html5-editor :content="content" :height="500" :z-index="1000" :auto-height="false" :show-module-name="false" @change="updateData"></vue-html5-editor>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">Submit</el-button>
			</div>
		</el-dialog>


		<!--新增标签界面-->
		<el-dialog title="Add new Label" v-model="addTagFormVisible" :close-on-click-modal="false">
			<el-form :model="addTagForm" label-width="80px" :rules="addTagFormRules" ref="addTagForm">
				<el-form-item label="Label Name" prop="title">
					<el-input v-model="addTagForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Sorting">
					<el-input-number v-model="addTagForm.order" :min="0" :max="200"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addTagFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addTagSubmit" :loading="addLoading">Submit</el-button>
			</div>
		</el-dialog>

		<!--编辑标签界面-->
		<el-dialog title="Edit Label" v-model="editTagFormVisible" :close-on-click-modal="false">
			<el-form :model="editTagForm" label-width="80px" :rules="editTagFormRules" ref="editTagForm">
				<el-form-item label="Label Name" prop="title">
					<el-input v-model="editTagForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Sorting">
					<el-input-number v-model="editTagForm.order" :min="0" :max="200"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editTagFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="editTagSubmit" :loading="editLoading">Submit</el-button>
			</div>
		</el-dialog>

		<!-- 新增批发价 -->
		<el-dialog size='tiny' title='ADD Whole Sell Price' v-model='addPriceVisible' @close='initAddPrice'>
			<el-form :model="addPriceForm" ref='addPriceForm' label-width="80px">
		    <el-form-item label="Price" >
		      <el-input v-model="addPriceForm.price" prop='price' auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="Cost" >
		      <el-input v-model="addPriceForm.cost" prop='cost' auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="QTY" >
		      <el-input v-model="addPriceForm.count" prop='count' auto-complete="off"></el-input>
		    </el-form-item>
		  	</el-form>
		    <div slot="footer" class="dialog-footer">
		      <el-button @click="addPriceVisible = false">Cancel</el-button>
		      <el-button type="primary" @click="addPriceCheck">Confirm</el-button>
		    </div>
		</el-dialog>

		<!-- 修改库存 -->
		<el-dialog title='change Stock' size='tiny' v-model='stockVisible'>
			<el-input-number v-model="editStockForm.stock" :min="1"></el-input-number>
			<div slot="footer" class="dialog-footer">
		      <el-button @click="stockVisible = false">Cancel</el-button>
		      <el-button type="primary" @click="stockCheck">Submit</el-button>
		    </div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getProductListPage, addProduct, removeProduct, addTag, getTagListPage, addCatalog, getCatalogListPage, updateTag, removeTag, removeCatalog, updateProduct } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				hot: false,
				isColorAdd: false,
				newColor: '',
				newColorStatu: false,
				colors: ['红色', '黑色'],
				colorList: [],
				content: '',
				activeName: 'first',
				percentStep: true,
				catalogOptions: [],
				catalogChildrenOptions: [],
				imageUrl: '',
				stockVisible: false,
				editStockForm: {
					productId: '',
					stock: ''
				},
				addPriceVisible: false,
				addPriceForm: {
					price: '',
					cost: '',
					count: ''
				},
				prices: [],
				imageList: [],
				albumList: [],
				checkList: [],
				filters: {
					name: ''
				},
				products: [],
				tags: [],
				catalogs: [],
				total: 0,
				page: 1,
				total2: 0,
				page2: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: 'Please enter the product name', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					productId: '',
					title: '',
					tags: [],
					avatar: '',
					price: 0,
					cost: 0,
					specs: '',
					parameters: '',
					album: [],
					images: []
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: 'Please type in your name', trigger: 'blur' }
					],
					price: [
						{ required: true, message: 'Please enter the price', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					tags: [],
					avatar: '',
					stock: 0,
					price: 0,
					cost: 0,
					specs: '',
					parameters: '',
					album: [],
					images: []
				},

				addTagFormVisible: false,//新增界面是否显示
				addTagFormRules: {
					name: [
						{ required: true, message: 'Please type in your name', trigger: 'blur' }
					]
				},
				//新增界面数据
				addTagForm: {
					title: '',
					order: 0
				},

				editLoading: false,
				editTagFormVisible: false,//新增界面是否显示
				editTagFormRules: {
					name: [
						{ required: true, message: 'Please type in your name', trigger: 'blur' }
					]
				},
				//新增界面数据
				editTagForm: {
					title: '',
					order: 0
				},

				addCatalogFormVisible: false,//新增界面是否显示
				addCatalogFormRules: {
					title: [
						{ required: true, message: 'Please type in name', trigger: 'blur' }
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
						{ required: true, message: 'Please type in name', trigger: 'blur' }
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
		filters: {
			filterStep(val) {
				switch(val) {
					case 0: return 'Off shelf';break;
					case 1: return 'On shelf';break;
					default: return 'Unknown state';
				}
			},
			filterTagType(val) {
				switch(val) {
					case 0: return "danger";break;
					case 1: return "success";break;
					default: return "gray";
				}
			}
		},
		methods: {
			addPrices() {
				this.addPriceVisible=true;
			},
			addPriceCheck() {
				this.addPriceVisible=false;
				// console.log(this.addPriceForm);
				this.prices.push(this.addPriceForm);
			},
			delPrices(index, row) {
				let key = this.prices.indexOf(row);
				// console.log(key);
				this.prices.splice(key, 1)
			},
			initAddPrice() {
				this.addPriceForm = {
					price: '',
					cost: '',
					count: ''
				}
			},
			init(form) {
				this.prices= [];
				this.percentStep = true;
				this.hot = false;
				this.imageUrl = '';
				this.imageList = [];
				this.albumList = [];
				this.checkList = [];
				this.content = '';
				this[form] = {
					title: '',
					tags: [],
					avatar: '',
					stock: 0,
					price: 0,
					cost: 0,
					specs: '',
					parameters: '',
					album: [],
					images: []
				};
			},
			handleEditStock(index, row) {
				// console.log(row.basic.stock);
				this.stockVisible = true;
				this.editStockForm.stock = row.basic.stock;
				this.editStockForm.productId = row.productId;
			},
			stockCheck() {
				updateProduct(this.editStockForm).then(res => {
					if(res.code === 0) {
						//NProgress.done();
						this.$message({
							message: 'Successfully modified',
							type: 'success'
						});
						this.stockVisible = false;
						this.getProducts();
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			 handleRemove(file, fileList) {
		        this.albumList = JSON.parse(JSON.stringify(fileList))
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
				// console.log(this.imageUrl)
        		//this.imageUrl = URL.createObjectURL(file.raw);
		      },
		      beforeAvatarUpload(file) {
		        const isJPG = file.type === 'image/jpeg';
		        const isPNG = file.type === 'image/png';
		        const isLt2M = file.size / 1024 / 1024 < 2;

		        if (!isJPG && !isPNG) {
		          this.$message.error('Only JPG or PNG !');
		        }
		        if (!isLt2M) {
		          this.$message.error('< 2MB!');
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
			formatHot(row, column) {
				switch(row.basic.hot) {
					case 1: return 'yes'; break;
					default: return 'no';
				}
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
				getProductListPage(para).then((res) => {
					if(res.code > 0){
						this.$message.error({
							message: res.message
						})
						return
					}
					// console.log(res);
					this.total = res.data.total;
					this.products = res.data.list;
					this.listLoading = false;
					// console.log(this.products)
					//NProgress.done();
				});
			},
			// 获取标签
			getTags() {
				let para = {
					page: this.page2,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getTagListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					
					this.total2 = res.data.total;
					this.tags = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('Confirm the deletion of the goods：'+row.basic.title+' ?', 'prompt', {
					confirmButtonText: 'Confirm',
          			cancelButtonText: 'Cancel',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { productId: row.productId };

					removeProduct(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: 'successfully deleted',
							type: 'success'
						});
						this.getProducts();
					});
				}).catch(() => {

				});
			},
			//删除标签
			handleDelTag: function (index, row) {
				this.$confirm('Confirm the deletion of the label：'+row.basic.title+' ?', 'prompt', {
					confirmButtonText: 'Confirm',
          			cancelButtonText: 'Cancel',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { tagId: row.tagId };

					removeTag(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: 'successfully deleted',
							type: 'success'
						});
						this.getTags();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				// console.log(row);
				this.initEdit(row);
			},
			// 上架
			handleUpAndDown(index, row) {
				console.log(row);
				let step = '';
				if(row.step == 0) {
					step = 1;
				} else if(row.step == 1) {
					step = 0;
				}
				updateProduct({
					productId: row.productId,
					step: step
				}).then(res => {
					this.addLoading = false;
					if(res.code === 0) {
						//NProgress.done();
						this.$message({
							message: 'Successfully modified',
							type: 'success'
						});
						this.getProducts();
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			// 复制本行信息
			handleCopy(index, row) {
				// console.log(row);
				// this.store.set('copyPro', row);
				this.addFormVisible = true;
				this.pastePro(row);
			},
			// 粘贴复制的文本
			pastePro(row) {
				let copy = row.basic;
				// let copy = this.store.get('copyPro').basic;
				this.addForm = {
					title: copy.title,
					tags: copy.tags,
					avatar: copy.avatar,
					stock: copy.stock,
					price: copy.price,
					cost: copy.cost,
					specs: '',
					parameters: '',
					album: copy.album,
					images: copy.images
				};
				if(copy.prices) {
					this.prices = JSON.parse(JSON.stringify(copy.prices));
					this.percentStep = true;
				} else {
					this.percentStep = false;
				}
				this.checkList = JSON.parse(JSON.stringify(copy.tags));;
				this.imageList = JSON.parse(JSON.stringify(copy.images));
				this.albumList = JSON.parse(JSON.stringify(copy.album));
				this.imageUrl = copy.avatar;
				this.content = copy.desc;
				this.hot = copy.hot==1 ? true : false;
				copy.specs.forEach((item, index) => {
					if(index === copy.specs.length-1) {
						this.addForm.specs+=item
					} else {
						this.addForm.specs+=item+'\n'
					}
				})
				copy.parameters.forEach((item, index) => {
					let para = '';
					item.forEach((ditem, key) => {
						if(key === item.length-1) {
							para+=ditem
						} else {
							para+=ditem+' '
						}
					})
					if(index === copy.parameters.length-1) {
						this.addForm.parameters+=para;
					} else {
						this.addForm.parameters+=para+'\n';
					}
				})
			},
			initEdit(row) {
				let rowMsg = Object.assign({}, row.basic);
				// this.prices = rowMsg.prices;
				this.checkList = JSON.parse(JSON.stringify(rowMsg.tags));;
				this.imageList = JSON.parse(JSON.stringify(rowMsg.images));
				this.albumList = JSON.parse(JSON.stringify(rowMsg.album));
				this.imageUrl = rowMsg.avatar;
				this.content = rowMsg.desc;
				this.hot = rowMsg.hot==1 ? true : false;
				if(rowMsg.prices) {
					this.prices = JSON.parse(JSON.stringify(rowMsg.prices));
					this.percentStep = true;
				} else {
					this.percentStep = false;
				}
				this.editForm = {
					productId: row.productId,
					title: rowMsg.title,
					tags: rowMsg.tags,
					avatar: rowMsg.avatar,
					price: rowMsg.price,
					cost: rowMsg.cost,
					desc: rowMsg.desc,
					specs: '',
					parameters: '',
					album: rowMsg.album,
					images: rowMsg.images
				};
				rowMsg.specs.forEach((item, index) => {
					if(index === rowMsg.specs.length-1) {
						this.editForm.specs+=item
					} else {
						this.editForm.specs+=item+'\n'
					}
				})
				rowMsg.parameters.forEach((item, index) => {
					let para = '';
					item.forEach((ditem, key) => {
						if(key === item.length-1) {
							para+=ditem
						} else {
							para+=ditem+' '
						}
					})
					if(index === rowMsg.parameters.length-1) {
						this.editForm.parameters+=para;
					} else {
						this.editForm.parameters+=para+'\n';
					}
				})
			},
			
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//显示新增界面
			handleAddTag: function () {
				this.addTagFormVisible = true;
				this.addTagForm = {
					title: '',
					order: 0
				};
			},
			//显示编辑界面
			handleEditTag: function (index, row) {
				this.editTagFormVisible = true;
				// console.log(row);
				this.editTagForm = {
					tagId: row.tagId,
					title: row.basic.title,
					order: row.basic.order
				}
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						if(this.prices.length<=0) {
							this.$message.error('Wholesale price can not be empty！')
							return;
						}
						this.$confirm('Are you sure to submit？', 'prompt', {
							confirmButtonText: 'Confirm',
          					cancelButtonText: 'Cancel',
						}).then(() => {
							let para = Object.assign({}, this.editForm);
						 	para.tags = this.checkList;
							para.specs = para.specs.split('\n');
							para.parameters = para.parameters.split('\n').map(e => e.split(' '));
							para.prices = this.prices;
							para.desc = this.content;
							para.hot = this.hot ? 1 : 0;
							// console.log(para);
							updateProduct(para).then(res => {
								this.addLoading = false;
								if(res.code === 0) {
									//NProgress.done();
									this.$message({
										message: 'Successfully modified',
										type: 'success'
									});
									this.editFormVisible = false;
									this.getProducts();
									this.$store.dispatch('initLevel');
								} else {
									this.$message.error({
										message: res.message
									})
								}
							})
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						if(this.prices.length<=0) {
							this.$message.error('Wholesale price can not be empty！')
							return;
						}
						this.$confirm('Are you sure to submit？', 'prompt', {
							confirmButtonText: 'Confirm',
          					cancelButtonText: 'Cancel',
						}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);

							para.tags = this.checkList;
							para.avatar = this.imageUrl;
							para.images = this.imageList;
							para.album = this.albumList;
							para.prices = this.prices;
							para.desc = this.content;
							para.specs = para.specs.split('\n');
							para.hot = this.hot? 1 : 0;
							para.parameters = para.parameters.split('\n').map(e => e.split(' '));
							para.step = 0;
							addProduct(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: 'Submitted successfully',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.content = '';
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
						this.$confirm('Are you sure to submit？', 'prompt', {
							confirmButtonText: 'Confirm',
          					cancelButtonText: 'Cancel',
						}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addTagForm);

							addTag(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: 'Submitted successfully',
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
			//编辑Tag
			editTagSubmit: function () {
				this.$refs.editTagForm.validate((valid) => {
					if (valid) {
						this.$confirm('Are you sure to submit？', 'prompt', {
							confirmButtonText: 'Confirm',
          					cancelButtonText: 'Cancel',
						}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editTagForm);

							updateTag(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: 'Submitted successfully',
									type: 'success'
								});
								this.$refs['editTagForm'].resetFields();
								this.editTagFormVisible = false;
								this.getTags();
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
				this.$confirm('Are you sure you want to delete the selected record？', 'prompt', {
					confirmButtonText: 'Confirm',
          			cancelButtonText: 'Cancel',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: 'successfully deleted',
							type: 'success'
						});
						this.getProducts();
					});
				}).catch(() => {

				});
			},
			updateData(val) {
				// console.log(val)
				this.content = val
			},
			// 颜色添加业务
			initColor() {
				this.isColorAdd = false;
				this.newColor = '';
			},
			addNewColor() {
				this.isColorAdd = true;
			},
			submitSaveColor() {
				if(this.newColor == '') {
					this.$message.error('颜色不能为空')
					return;
				}
				this.colors.push(this.newColor);
				this.initColor();
			},
			cancelSaveColor() {
				this.initColor();
			}
		},
		mounted() {
			this.getProducts();
			this.getTags()
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