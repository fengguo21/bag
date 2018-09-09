<template>
	<section>
		<!-- tab切换 -->
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<!-- 商品tab -->
		    <el-tab-pane label="商品" name="first">
		    	<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="filters.name" @change='regetPro' placeholder="商品名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="getProducts">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleAdd">新增商品</el-button>
						</el-form-item>
					</el-form>
				</el-col>

				<!--列表-->
				<el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">

					<el-table-column type="index" width="60">
					</el-table-column>
					<el-table-column type="expand">
					      <template scope="props">
					        <el-form label-position="left" class="demo-table-expand" v-if='(typeof props.row.basic.percent[0]) == "object"'>
					            <el-form-item v-for='(item, index) in props.row.basic.percent[0]' :key='index'>
					              <span>{{ index|filterShowLabel }}</span>&nbsp;&nbsp;&nbsp;<span>{{ (item*100).toFixed(2) }} %</span>
					            </el-form-item>
					        </el-form>
					    </template>
					</el-table-column>
					<el-table-column label="头像" width="100">
						<template scope="scope">
							<img :src="scope.row.basic.avatar" style="width:60px;height:60px;vertical-align:middle;margin:5px 0;" />
						</template>
					</el-table-column>
					<el-table-column prop="basic.title" label="标题" width="220" sortable>
					</el-table-column>
					<el-table-column prop="basic.price" label="价格" width="100" sortable>
						<template scope='scope'>
							{{scope.row.basic.price.toFixed(2)}}
						</template>
					</el-table-column>
					<el-table-column label="标签" width="200">
						<template scope="scope">
							<el-tag type="primary" style="margin-right:5px;" v-for="(t, index) in scope.row.basic.tags" :key='index'>{{t}}</el-tag>

						</template>
					</el-table-column>
					<el-table-column prop="basic.percent" :formatter="formatPercent1" label="一级提成" width="120" sortable>
					</el-table-column>
					<el-table-column prop="basic.percent" :formatter="formatPercent2" label="二级提成" width="120" sortable>
					</el-table-column>
					<el-table-column prop="basic.stock" label="库存" width="120" sortable>
					</el-table-column>
					<el-table-column prop="basic.step" label="上架状态" width="120" sortable>
						<template scope="scope">
						    <el-tag
						        :type="scope.row.step==0 ? 'danger' : 'success'"
						        close-transition>{{scope.row.step|filterProStep}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" sortable>
					</el-table-column>
					<el-table-column label="操作" width="350">
						<template scope="scope">
							<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
							<el-button size="small" @click="handleEditStock(scope.$index, scope.row)">修改库存</el-button>
							<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
							<el-button type="warning" size="small" @click="handleUp(scope.$index, scope.row)" v-if='scope.row.step==0'>商品上架</el-button>
							<el-button type="warning" size="small" @click="handleDown(scope.$index, scope.row)" v-if='scope.row.step==1'>商品下架</el-button>
							<!-- <el-button type="info" size="small" @click="handlequery(scope.$index, scope.row)">查看会员</el-button> -->
						</template>
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">

					<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange1" :page-size="10" :total="total1" style="float:right;">
					</el-pagination>
				</el-col>
		    </el-tab-pane>
		    <!-- 标签tab -->
		    <el-tab-pane label="标签" name="second">
		    	<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters2">
						<el-form-item>
							<el-input v-model="filters2.name" @change='regetTag' placeholder="标签名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="getTags">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleAddTag">新增标签</el-button>
						</el-form-item>
					</el-form>
				</el-col>

				<!--列表-->
				<el-table :data="tags" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">

					<el-table-column type="index" width="60">
					</el-table-column>
					<el-table-column prop="basic.title" label="名称" width="120" sortable>
					</el-table-column>
					<el-table-column prop="basic.order" label="排序" width="auto" sortable>
					</el-table-column>
					<el-table-column label="操作" width="150">
						<template scope="scope">
							<el-button size="small" @click="handleEditTag(scope.$index, scope.row)">修改</el-button>
							<el-button type="danger" size="small" @click="handleDelTag(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">

					<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange2" :page-size="10" :total="total2" style="float:right;">
					</el-pagination>
				</el-col>
		    </el-tab-pane>
		    <!-- 分类tab -->
		    <el-tab-pane label="分类" name="third">
		    	<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters3">
						<el-form-item>
							<el-input v-model="filters3.name" @change='regetCatalogs' placeholder="分类名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="getCatalogs">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleAddCatalog">新增分类</el-button>
						</el-form-item>
					</el-form>
				</el-col>

				<!--列表-->
				<el-table :data="catalogs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">

					<el-table-column type="index" width="60">
					</el-table-column>
					<el-table-column prop="basic.title" label="名称" width="120" sortable>
					</el-table-column>
					<el-table-column prop="basic.order" label="排序" width="120" sortable>
					</el-table-column>
					<el-table-column label="头像" width="120" sortable>
						<template scope="scope">
							<img :src="scope.row.basic.avatar" style="width:120px;height:60px;vertical-align:middle;margin:5px 0;" />
						</template>
					</el-table-column>
					<el-table-column label="二级分类" width="auto">

					<template scope="scope">
							<el-tag type="primary" v-for="(tag, index) in scope.row.basic.children" :key='index' style="margin-right:10px">{{ tag.title }}</el-tag>
						</template>

					</el-table-column>
					<el-table-column label="操作" width="250">
						<template scope="scope">
							<el-button size="small" @click="handleEditCatalog(scope.$index, scope.row)">修改</el-button>
							<el-button size="small" @click="handleAddCatalogChild(scope.$index, scope.row)">新增二级分类</el-button>
							<el-button type="danger" size="small" @click="handleDelCatalog(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">

					<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange3" :page-size="10" :total="total3" style="float:right;">
					</el-pagination>
				</el-col>
		    </el-tab-pane>
	  	</el-tabs>

		<!--修改商品弹窗-->
		<el-dialog title="修改商品" v-model="editFormVisible" :close-on-click-modal="false" @close='initEditForm'>
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="标签" prop="tags">
					<el-checkbox-group v-model="checkList">
				    <el-checkbox :label="(t.basic)?t.basic.title:''" v-for="t in tags" :key='t'></el-checkbox>
				  </el-checkbox-group>
				</el-form-item>

				<el-form-item label="分类" prop="tags">
					<el-select v-model="editForm.catalog" placeholder="请选择" @change="catalogChange">
				    <el-option
				      v-for="item in catalogOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				  <el-select v-model="editForm.childCatalog" placeholder="请选择">
				    <el-option
				      v-for="item in catalogChildrenOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
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

				<el-form-item label="价格" prop='price'>
					<el-input-number v-model.number="editForm.price" :min="0"></el-input-number>
				</el-form-item>
<!-- 
				<el-form-item label="使用商品会员">
					<el-switch
					  v-model="vipStep"
					  on-color="#13ce66"
					  off-color="#ff4949">
					</el-switch>
					<el-button v-if='vipStep' size="small" type='info' @click.native="handleAddLevel">新增会员等级</el-button>
				</el-form-item> -->
				
				<el-table border style="width: 100%; margin-bottom: 10px" :data='editForm.ranks' v-if="editForm.ranks.length > 0" >
				    <el-table-column label="会员等级" sortable>
				    	<template scope='scope'>
				    		{{scope.row.rank|filterRank}}
				    	</template>
				    </el-table-column>
				    <el-table-column label="数量下限">
				    	<template scope='scope'>
				    		<el-input v-model='scope.row.min' placeholder='填写最少购买的数量'></el-input>
				    	</template>
				    </el-table-column>
				    <el-table-column label="数量上限">
				    	<template scope='scope'>
				    		<el-input v-model='scope.row.max' placeholder='若没有上限请填-1'></el-input>
				    	</template>
				    </el-table-column>
				    <el-table-column label="商品价格">
				    	<template scope='scope'>
				    		<el-input v-model='scope.row.price' placeholder='请填写该等级商品价格'></el-input>
				    	</template>
				    </el-table-column>
			  	</el-table>
			  	<el-table border style="width: 100%" :data='ranks' v-if="editForm.ranks.length == 0" >
				    <el-table-column label="会员等级" prop='label' sortable>
				    </el-table-column>
				    <el-table-column label="数量下限">
				    	<template scope='scope'>
				    		<el-input v-model='scope.row.min' placeholder='填写最少购买的数量'></el-input>
				    	</template>
				    </el-table-column>
				    <el-table-column label="数量上限">
				    	<template scope='scope'>
				    		<el-input v-model='scope.row.max' placeholder='若没有上限请填-1'></el-input>
				    	</template>
				    </el-table-column>
				    <el-table-column label="商品价格">
				    	<template scope='scope'>
				    		<el-input v-model='scope.row.price' placeholder='请填写该等级商品价格'></el-input>
				    	</template>
				    </el-table-column>
			  	</el-table>

				<!-- <el-form-item label="提成状态">
					<el-switch
					  v-model="percentStep"
					  on-color="#13ce66"
					  off-color="#ff4949">
					</el-switch>
				</el-form-item> -->
				
				<el-form-item v-if="(typeof editForm.percent1) == 'object'" label-width="200px" :label="index|filterLabel" v-for='(item, index) in editForm.percent1' :key='index'>
					<el-input-number v-model="editForm.percent1[index]" :min="0" :max="1" :step="0.01"></el-input-number>
				</el-form-item>
				<el-form-item label="一级提成" v-if='(typeof editForm.percent1) != "object"'>
					<el-input-number v-model="editForm.percent1" :min="0" :max="1" :step="0.01"></el-input-number>
				</el-form-item>

				<el-form-item label="二级提成">
					<el-input-number v-model="editForm.percent2" :min="0" :max="1" :step="0.01"></el-input-number>
				</el-form-item>

				<el-form-item label="轮播图">
					<el-upload
				  class="upload-demo"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :on-preview="handlePreview"
				  :on-remove="handleAlbumRemove"
				  :on-success="handleAlbumSuccess"
				  :file-list="albumList"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
				</el-form-item>

				<el-form-item label="规格">
					<el-input type="textarea" v-model="editForm.specs"></el-input>
				</el-form-item>

				<el-form-item label="商品参数">
					<el-input type="textarea" v-model="editForm.parameters"></el-input>
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
				<el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增商品弹窗-->
		<el-dialog title="新增商品" v-model="addFormVisible" :close-on-click-modal="false" @close='closeAddPro'>
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="标签" prop="tags">
					<el-checkbox-group v-model="checkList">
				    <el-checkbox :label="(t.basic)?t.basic.title:''" v-for="t in tags" :key='t'></el-checkbox>
				  </el-checkbox-group>
				</el-form-item>

				<el-form-item label="分类" prop="tags">
					<el-select v-model="addForm.catalog" placeholder="请选择" @change="catalogChange">
				    <el-option
				      v-for="item in catalogOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				  <el-select v-model="addForm.childCatalog" placeholder="请选择">
				    <el-option
				      v-for="item in catalogChildrenOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
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

				<el-form-item label="库存">
					<el-input-number v-model="addForm.stock" :min="0" :max="100000"></el-input-number>
				</el-form-item>

				<el-form-item label="价格" prop='price'>
					<el-input-number v-model.number="addForm.price" :min="0"></el-input-number>
				</el-form-item>

				<!-- <el-form-item label="使用商品会员">
					<el-switch
					  v-model="vipStep"
					  on-color="#13ce66"
					  off-color="#ff4949">
					</el-switch>
					<el-button v-if='vipStep' size="small" type='info' @click.native="handleAddLevel">新增会员等级</el-button>
				</el-form-item> -->

				<el-table border style="width: 100%; margin-bottom: 10px" :data='ranks' >
				    <el-table-column label="会员等级"  prop='label' sortable>
				    </el-table-column>
				    <el-table-column label="数量下限">
				    	<template scope='scope'>
				    		<el-input v-model='scope.row.min' placeholder='填写最少购买的数量'></el-input>
				    	</template>
				    </el-table-column>
				    <el-table-column label="数量上限">
				    	<template scope='scope'>
				    		<el-input v-model='scope.row.max' placeholder='若没有上限请填-1'></el-input>
				    	</template>
				    </el-table-column>
				    <el-table-column label="商品价格">
				    	<template scope='scope'>
				    		<el-input v-model='scope.row.price' placeholder='请填写该等级商品价格'></el-input>
				    	</template>
				    </el-table-column>
			  	</el-table>

				<!-- <el-form-item label="使用默认提成">
					<el-switch
					  v-model="percentStep"
					  on-color="#13ce66"
					  off-color="#ff4949">
					</el-switch>
				</el-form-item> -->

				<el-form-item label-width="200px" :label="item.label" v-for='(item, index) in Vips' :key='index'>
					<el-input-number v-model="item.val" :min="0" :max="1" :step="0.01"></el-input-number>
				</el-form-item>

				<el-form-item label-width="200px" label="二级提成">
					<el-input-number v-model="addForm.percent2" :min="0" :max="1" :step="0.01"></el-input-number>
				</el-form-item>

				<el-form-item label="轮播图">
					<el-upload
				  class="upload-demo"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :on-preview="handlePreview"
				  :on-remove="handleAlbumRemove"
				  :on-success="handleAlbumSuccess"
				  :file-list="albumList"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
				</el-form-item>

				<el-form-item label="规格">
					<el-input type="textarea" v-model="addForm.specs"></el-input>
				</el-form-item>

				<el-form-item label="商品参数">
					<el-input type="textarea" v-model="addForm.parameters"></el-input>
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
				<el-button @click.native="cancelSubmit">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>


		<!--新增标签界面-->
		<el-dialog title="新增标签" v-model="addTagFormVisible" :close-on-click-modal="false">
			<el-form :model="addTagForm" label-width="80px" :rules="addTagFormRules" ref="addTagForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="addTagForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="addTagForm.order" :min="0" :max="200"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addTagFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addTagSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!-- 修改标签 -->
		<el-dialog title='修改标签' v-model='editTagFormVisible' :close-on-click-modal='false'>
			<el-form :model='editTagForm' label-width='80px' :rules='editTagFormRules' ref='editTagForm'>
				<el-form-item label='名称' prop='title'>
					<el-input v-model='editTagForm.title' auto-complete='off'></el-input>
				</el-form-item>
				<el-form-item label='排序'>
					<el-input-number v-model='editTagForm.order' :min='0' :max='200'></el-input-number>
				</el-form-item>	
			</el-form>
			<div slot='footer' class='dialog-footer'>
				<el-button @click='editTagFormVisible = false'>取消</el-button>
				<el-button type='primary' @click='editTagSubmit'>提交</el-button>
			</div>
		</el-dialog>
		<!--新增分类界面-->
		<el-dialog title="新增分类" v-model="addCatalogFormVisible" :close-on-click-modal="false" @close='initImgUrl'>
			<el-form :model="addCatalogForm" label-width="80px" :rules="addCatalogFormRules" ref="addCatalogForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="addCatalogForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="addCatalogForm.order" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="头像">
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
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addCatalogFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addCatalogSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增子分类界面-->
		<el-dialog title="新增二级分类" v-model="addCatalogChildFormVisible" :close-on-click-modal="false">
			<el-form :model="addCatalogChildForm" label-width="80px" :rules="addCatalogChildFormRules" ref="addCatalogChildForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="addCatalogChildForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="addCatalogChildForm.order" :min="0" :max="200"></el-input-number>
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
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addCatalogChildFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addCatalogChildSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!-- 修改库存 -->
		<el-dialog title="修改库存" type='tiny' v-model="editStockVisible" :close-on-click-modal="false">
			<el-form :model="editStockForm" label-width="80px">
				<el-form-item label='库存'>
					<el-input-number v-model="editStockForm.stock" :min="0" ></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editStockVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editStockSub" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getProductListPage, addProduct, updateProduct, removeProduct, addTag, getTagListPage, updateTag, addCatalog, getCatalogListPage, removeTag, removeCatalog, updateCatalog } from '../../api/api';
	import moment from 'moment'
	let setVip = [];
	let setRank = [];
	export default {
		filters: {
			filterProStep(val) {
				return val?'上架中':'已下架'
			},
			filterLabel(val) {
				// console.log(setVip);
				let label = ''
				setVip.forEach(item => {
					if(val == item.title) {
						label = item.label
					}
				})
				return label
			},
			filterShowLabel(val) {
				// console.log(setVip);
				let label = ''
				setVip.forEach(item => {
					if(val == item.title) {
						label = item.label+'比例'
					}
				})
				return label
			},
			filterRank(val) {
				let label = '';
				// console.log(val);
				setRank.forEach(item => {
					if(val == item.rank) {
						label = item.label
					}
				})
				return label;
			}
		},
		data() {
			return {
				activeName: 'first',
				percentStep: false,
				vipStep: false,
				catalogOptions: [],
				catalogChildrenOptions: [],
				imageUrl: '',
				imageList: [],
				albumList: [],
				checkList: [],
				filters: {
					name: ''
				},
				filters2: {
					name: ''
				},
				filters3: {
					name: ''
				},
				products: [],
				tags: [],
				catalogs: [],
				total1: 0,
				total2: 0,
				total3: 0,
				page1: 1,
				page2: 1,
				page3: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editFormRules: {
					title: [
						{ required: true, message: '请输入商品名称', trigger: 'blur' }
					],
					price: [
						{ required: true, type: 'number', message: '请输入商品价格', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					productId: '',
					title: '',
					tags: [],
					level: [],
					catalog: '',
					childCatalog: '',
					avatar: '',
					price: 0,
					percent1: 0,
					percent2: 0,
					specs: '',
					parameters: '',
					album: [],
					images: [],
					ranks: []
				},
				// 修改库存
				editStockVisible: false,
				editStockForm: {
					productId: '',
					stock: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					price: [
						{ required: true, type: 'number', message: '请输入价格', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					tags: [],
					level: [],
					catalog: '',
					childCatalog: '',
					avatar: '',
					stock: 0,
					price: 0,
					percent1: 0,
					percent2: 0,
					specs: '',
					parameters: '',
					album: [],
					images: [],
					ranks: []
				},

				addTagFormVisible: false,//新增界面是否显示
				addTagFormRules: {
					title: [
						{ required: true, message: '请输入标签名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addTagForm: {
					title: '',
					order: 0
				},
				editTagFormVisible: false,
				editTagFormRules: {
					title: [
						{ required: true, message: '请输入标签名', trigger: 'blur' }
					]
				},
				// 修改标签
				editTagForm: {
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
				},
				Vips: [],
				ranks: []
			}
		},
		methods: {
			handleUp(index, row) {
				updateProduct({
					productId: row.productId,
					step: 1
				}).then(res => {
					if(res.code > 0) {
						this.$message.error({
							message: res.message
						})
					} else {
						this.$message.success({
							message: '上架成功'
						})
						this.getProducts();
					}
					
				})
			},
			handleDown(index, row) {
				updateProduct({
					productId: row.productId,
					step: 0
				}).then(res => {
					if(res.code > 0) {
						this.$message.error({
							message: res.message
						})
					} else {
						this.$message.success({
							message: '下架成功'
						})
						this.getProducts();
					}
				})
			},
			regetCatalogs(val) {
				// console.log(val);
				if(val==='') {
					this.getCatalogs();
				}
			},
			regetTag(val) {
				// console.log(val);
				if(val==='') {
					this.getTags();
				}
			},
			regetPro(val) {
				// console.log(val);
				if(val==='') {
					this.getProducts();
				}
			},
			initImgUrl() {
				this.imageUrl = ''
			},
			closeAddPro() {
				this.initAddForm();
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
			 handleAlbumRemove(file, fileList) {
		        // console.log('handleRemove:', file, fileList);
		        // console.log(this.albumList);
		        this.albumList = fileList;
		      },
		      handleImageRemove(file, fileList) {
		        // console.log('handleRemove:', file, fileList);
		        // console.log(this.imageList);
		        this.imageList = fileList;
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
				console.log(this.albumList);
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
					if(typeof(row.basic.percent[0]) == 'object') 
						return '下拉查看更多'
					return (row.basic.percent[0]*100).toFixed(2)+'%'
				return row.basic.percent
			},
			formatPercent2: function(row, column) {
				if(typeof(row.basic.percent) == 'object')
					return (row.basic.percent[1]*100).toFixed(2)+'%'
				return row.basic.percent
			},
			handleCurrentChange1(val) {
				this.page1 = val;
				this.getProducts();
			},
			handleCurrentChange2(val) {
				this.page2 = val;
				this.getTags();
			},
			handleCurrentChange3(val) {
				this.page3 = val;
				this.getCatalogs();
			},
			handleClick(){

			},
			//获取用户列表
			getProducts() {
				let para = {
					title: this.filters.name,
					page: this.page1,
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
					console.log(res.data.list);
					this.total1 = res.data.total;
					this.products = res.data.list;
					this.listLoading = false;
					// console.log(this.products)
					//NProgress.done();
				});
			},
			// 获取标签
			getTags() {
				let para = {
					title: this.filters2.name,
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
			// 获取分类
			getCatalogs() {
				let para = {
					title: this.filters3.name,
					page: this.page3,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getCatalogListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}

					this.total3 = res.data.total;
					this.catalogs = res.data.list;
					this.listLoading = false;
					this.catalogOptions = this.catalogs.map(e => {
						return {
							label: e.basic.title,
							value: e.basic.title
						}
					})
					// console.log('this.catalog', res.data)
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除商品：'+row.basic.title+' 吗?', '提示', {
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
			handleEdit(index, row) {
				// console.log(row);
				this.editFormVisible = true;
				let basic = row.basic;
				console.log(basic.images);
				this.albumList = basic.album?basic.album:[];
				this.imageList = basic.images?basic.images:[];
				this.imageUrl = basic.avatar?basic.avatar:'';
				this.checkList = basic.tags?basic.tags:[];
				let edit = {
					productId: row.productId,
					title: basic.title,
					tags: basic.tags?basic.tags:[],
					ranks: basic.ranks?basic.ranks:[],
					catalog: basic.catalog?basic.catalog:'',
					childCatalog: basic.childCatalog?basic.childCatalog:'',
					avatar: this.imageUrl,
					price: basic.price,
					percent1: basic.percent?basic.percent[0]?basic.percent[0]:0:0,
					percent2: basic.percent?basic.percent[1]?basic.percent[1]:0:0,
					specs: '',
					parameters: '',
					album: this.albumList,
					images: this.imageList
				};
				if(basic.ranks) {
					this.vipStep = true;
				} else {
					this.vipStep = false;
				}
				if(basic.specs) {
					basic.specs.forEach((item, index) => {
						if((index == basic.specs.length-1)||basic.specs.length==0) {
							edit.specs += item
						} else{
							edit.specs += item+' \n'
						}					
					})
				} else {
					edit.specs = '';
				}
				if(basic.parameters) {
					basic.parameters.forEach( (item, index) => {
						let detail = '';
						item.forEach((dbitem) => {
							detail += dbitem+' '	
						})
						if((index == basic.parameters.length-1)||basic.parameters.length==0) {
							edit.parameters += detail
						} else{
							edit.parameters += detail+'\n'
						}							
					} )
				} else {
					edit.parameters = ''
				}
				this.editForm = JSON.parse(JSON.stringify(edit))
				// console.log(row);
			},
			// 修改库存
			handleEditStock(index, row) {
				this.editStockVisible = true;
				this.editStockForm.stock = row.basic.stock?row.basic.stock:0;
				this.editStockForm.productId = row.productId;
				// console.log(row.basic.stock?row.basic.stock:0);
			},
			editStockSub() {
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.addLoading = true;
					//NProgress.start();
					let para = Object.assign({}, this.editStockForm);
					updateProduct(para).then(res => {
						this.addLoading = false;
						if(res.code === 0) {
							//NProgress.done();
							this.$message({
								message: '修改成功',
								type: 'success'
							});
							this.editStockVisible = false;
							this.getProducts();
						} else {
							this.$message.error({
								message: res.message
							})
						}
					})
				});
			},
			// 修改分类
			handleEditCatalog(index, row) {
				console.log(row);
				this.store.set('editCatalog', row);
				this.$router.push('/mmd/editCatalog')
			},
			// 跳转查看会员页面
			handlequery(index, row) {
				this.$router.push('/mmd/page1010');
				this.$store.dispatch('queryVips', row.productId);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.initAddForm();
			},
			initAllCase() {
				this.vipStep = false;
				this.percentStep = false;
				this.albumList = [];
				this.imageList = [];
				this.imageUrl = '';
				this.checkList = [];
			},
			initEditForm() {
				this.initAllCase();
				this.initRanks();
				this.imageList = [];
				this.albumList = [];
				this.$store.dispatch('initLevel');
			},
			initAddForm() {
				this.addLoading = false;
				this.initVips();
				this.initRanks();
				this.initAllCase();
				this.addForm = {
					title: '',
					tags: [],
					catalog: '',
					childCatalog: '',
					avatar: '',
					stock: 0,
					price: 0,
					percent1: 0,
					percent2: 0,
					specs: '',
					parameters: '',
					album: [],
					images: []
				};
			},
			//显示新增界面
			handleAddCatalog: function () {
				this.addCatalogFormVisible = true;
				this.addCatalogForm = {
					title: '',
					avatar: '',
					order: 0
				};
			},
			// 显示新增商品会员弹窗
			handleAddLevel() {
				this.$store.dispatch('changeLevel', true)
			},
			// 显示新增界面
			handleAddCatalogChild: function (index, row) {
				this.addCatalogChildFormVisible = true;
				// console.log(row.children);
				this.addCatalogChildForm = {
					catalogId: row.catalogId,
					title: '',
					avatar: '',
					order: 0,
					children: row.basic.children
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
			// 显示编辑界面
			handleEditTag(index, row) {
				this.editTagFormVisible = true;
				console.log(row);
				this.editTagForm = {
					title: row.basic.title,
					tagId: row.tagId,
					order: row.basic.order
				}
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					// console.log(this.editForm);
					if (valid) {
						// console.log(this.editForm);
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.album = this.albumList;
							para.avatar = this.imageUrl;
							para.images = this.imageList;
						 	para.tags = this.checkList;
							para.specs = para.specs.split('\n');
							para.parameters = para.parameters.split('\n').map(e => e.split(' '));
							para.percent = [para.percent1, para.percent2];
							if(para.ranks.length == 0) {
								this.ranks.forEach(item => {
									para.ranks.push({
										rank: item.rank,
										min: item.min,
										max: item.max,
										price: item.price
									})
								})
							}
							// console.log(para);
							updateProduct(para).then(res => {
								this.addLoading = false;
								if(res.code === 0) {
									//NProgress.done();
									this.$message({
										message: '修改成功',
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
					} else {
						this.$message.error({
							message: '数据不能为空'
						});
					}
				});
			},
			// 取消添加
			cancelSubmit() {
				this.addFormVisible = false;
				this.$store.dispatch('initLevel');
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);

							para.tags = this.checkList;
							para.avatar = this.imageUrl;
							para.images = this.imageList;
							para.album = this.albumList;
							para.specs = para.specs.split('\n');
							para.parameters = para.parameters.split('\n').map(e => e.split(' '));
							para.percent1 = {};
							this.Vips.forEach(item => {
								para.percent1[item.title] = item.val;
							})
							para.percent = [para.percent1, para.percent2];
							para.ranks = [];
							this.ranks.forEach(item => {
								para.ranks.push({
									rank: item.rank,
									min: item.min,
									max: item.max,
									price: item.price
								})
							})
							// console.log(para);

							addProduct(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								if(res.code === 0) {
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getProducts();
									this.$store.dispatch('initLevel');
								} else {
									this.$message({
										message: res.message,
										type: 'error'
									});
								}
							});
						});
					} else {
						this.$message.error({
							message: '信息不能为空'
						})
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
			editTagSubmit() {
				this.$refs.editTagForm.validate((valid) => {
					if(valid) {
						updateTag(this.editTagForm).then(res => {
							if(res.code > 0) {
								this.$message.error({
									message: res.message
								})
							}
							this.$message.success({
								message: '修改成功'
							})
							this.editTagFormVisible = false;
							this.getTags();
							this.getProducts()
						})
					} else {
						this.$message.error({
							message: '信息不能为空'
						})
					}
				})
			},
			//新增分类
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
							this.addCatalogChildForm.children.push({
								title: this.addCatalogChildForm.title,
								avatar: this.imageUrl,
								order: this.addCatalogChildForm.order
							})
							let para = {
								catalogId: this.addCatalogChildForm.catalogId,
								children: this.addCatalogChildForm.children
							};
							// console.log(this.addCatalogChildForm);
							updateCatalog(para).then((res) => {
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
					} else {
						this.$message.error({
							message: '信息不能为空'
						})
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
			},
			getRankList() {
				getRank({
					page: this.page,
					size: 10
				}).then(res => {
					if(res.code === 0) {
						// console.log(res);
						res.data.list.forEach(item => {
							this.ranks.push({
								rank: item.rank,
								label: item.title,
								min: '',
								max: '',
								price: ''
							})
							res.data.list.forEach(key => {
								this.Vips.push({
									title: item.rank+'-'+key.rank,
									label: item.title+'引荐'+key.title+'提成',
									val: ''
								})
							})
						})
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			initVips() {
				let arr = JSON.parse(JSON.stringify(this.Vips));
				arr.forEach(item => {
					item.val = ''
				})
				// console.log(arr);
				this.Vips = JSON.parse(JSON.stringify(arr))
			},
			initRanks() {
				let arr = JSON.parse(JSON.stringify(this.ranks));
				arr.forEach(item => {
					item.min = '';
					item.max = '';
					item.price = '';
				})
				this.ranks = JSON.parse(JSON.stringify(arr))
			}
		},
		mounted() {
			if(this.store.get('rank')) {
				// let vipList = [];
				this.store.get('rank').forEach(item => {
					this.ranks.push({
						rank: item.rank,
						label: item.title,
						min: '',
						max: '',
						price: ''
					})
					this.store.get('rank').forEach(val => {
						this.Vips.push({
							title: item.rank+'-'+val.rank,
							label: item.title+'引荐'+val.title+'提成',
							val: ''
						})
					})
				})
				// console.log('ranks', this.ranks);
				// this.Vips = this.store.get('rank');
			} else {
				this.getRankList();
			}
			setVip = JSON.parse(JSON.stringify(this.Vips));
			setRank = JSON.parse(JSON.stringify(this.ranks));
			// console.log(this.Vips);
			this.getProducts();
			this.getTags();
			this.getCatalogs();
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
