<template>
	<section>
	<el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="系统" name="p1">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="名字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.country" clearable placeholder="国籍">
					    <el-option
					      v-for="item in countryOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.sex" clearable placeholder="性别">
					    <el-option
					      v-for="item in sexOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.city" placeholder="城市"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.age" clearable placeholder="年龄">
					    <el-option
					      v-for="item in ageOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.level" clearable placeholder="关卡等级">
					    <el-option
					      v-for="item in levelOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.jobs" clearable placeholder="职业">
					    <el-option
					      v-for="item in jobOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button @click="handleAdd">新增脸谱</el-button>
					<el-button @click="handleAddBatch">批量新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products" highlight-current-row v-loading="listLoading" style="width: 100%;" @selection-change="handleSelectionChange">
			<el-table-column
      type="selection"
      width="55">
    </el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column type="expand">
		      <template scope="props">
		        <el-form label-position="left" inline label-width='100px' class="demo-table-expand">
		          <el-form-item label="编号">
		            <span>{{ props.row.feedId }}</span>
		          </el-form-item>
		          <el-form-item label="简介">
		            <span>{{ props.row.basic.desc }}</span>
		          </el-form-item>
		        </el-form>
		      </template>
		    </el-table-column>
			<el-table-column label="头像" width="100">
				<template scope="scope">
					<img :src="scope.row.basic.avatar" style="width:60px;height:60px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.title" label="名字" width="220" >
			</el-table-column>
			<el-table-column prop="basic.sex" label="性别" :formatter="formatSex" width="100" >
			</el-table-column>
			<el-table-column prop="basic.country" label="国籍" width="100" >
			</el-table-column>
			<el-table-column prop="basic.city" label="城市" width="100" >
			</el-table-column>
			<el-table-column prop="basic.age" label="年龄" width="100" >
			</el-table-column>
			<el-table-column label="职业" width="200">
				<template scope="scope">
					<el-tag type="primary" style="margin-right:5px;" v-for="t in scope.row.basic.jobs" :key='t'>{{t}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="basic.level" label="关卡等级" width="120" >
			</el-table-column>
			<el-table-column prop="basic.today" label="今日脸星" :formatter="formatToday" width="120" >
			</el-table-column>
			<el-table-column prop="basic.intro" label="新手测试" :formatter="formatIntro" width="120" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" >
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		<el-button type="danger" @click="batchRemove(1)" :disabled="multipleSelection.length===0">批量删除</el-button>
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
    <el-tab-pane label="用户上传" name="p2">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="名字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.country" clearable placeholder="国籍">
					    <el-option
					      v-for="item in countryOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.city" placeholder="城市"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.age" clearable placeholder="年龄">
					    <el-option
					      v-for="item in ageOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.sex" clearable placeholder="性别">
					    <el-option
					      v-for="item in sexOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.level" clearable placeholder="关卡等级">
					    <el-option
					      v-for="item in levelOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.jobs" clearable placeholder="职业">
					    <el-option
					      v-for="item in jobOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query2">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products2" highlight-current-row v-loading="listLoading" style="width: 100%;" @selection-change="handleSelectionChange2">
			<el-table-column
      type="selection"
      width="55">
    </el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column type="expand">
		      <template scope="props">
		        <el-form label-position="left" inline label-width='100px' class="demo-table-expand">
		          <el-form-item label="编号">
		            <span>{{ props.row.feedId }}</span>
		          </el-form-item>
		          
		        </el-form>
		      </template>
		    </el-table-column>
			<el-table-column label="头像" width="100">
				<template scope="scope">
					<img :src="scope.row.basic.avatar" style="width:60px;height:60px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.title" label="名字" width="220" >
			</el-table-column>
			<el-table-column prop="basic.sex" label="性别" :formatter="formatSex" width="100" >
			</el-table-column>
			<el-table-column prop="basic.country" label="国籍" width="100" >
			</el-table-column>
			<el-table-column prop="basic.city" label="城市" width="100" >
			</el-table-column>
			<el-table-column prop="basic.age" label="年龄" width="100" >
			</el-table-column>
			<el-table-column label="职业" width="200">
				<template scope="scope">
					<el-tag type="primary" style="margin-right:5px;" v-for="t in scope.row.basic.jobs" :key='t'>{{t}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="basic.desc" label="简介" width="120" >
			</el-table-column>
			<el-table-column prop="basic.level" label="关卡等级" width="120" >
			</el-table-column>
			<el-table-column prop="basic.today" label="今日脸星" width="120" >
			</el-table-column>
			<el-table-column prop="basic.intro" label="新手测试" width="120" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" >
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		<el-button type="danger" @click="batchRemove(2)" :disabled="multipleSelection2.length===0">批量删除</el-button>
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange2" :page-size="10" :total="total2" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
    <el-tab-pane label="职业" name="p3">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="职业名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getTags">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button @click="handleAddTag">新增职业</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tags" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.title" label="名称" width="120" >
			</el-table-column>
			<el-table-column prop="basic.order" label="排序" width="auto" >
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
				<el-button size="small" @click="handleShowCount(scope.$index, scope.row)">查看人数</el-button>
					<el-button size="small" type="primary" @click="handleEditTag(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="handleDelTag(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleTagCurrentChange" :page-size="10" :total="tagTotal" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
    <el-tab-pane label="标签" name="p4">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="标签名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query5">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button @click="handleAddTag2">新增标签</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tags2" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.title" label="标签名称" width="200" >
			</el-table-column>
			<el-table-column prop="basic.created" label="创建时间" :formatter="formatDate" width="auto" >
			</el-table-column>
			<el-table-column label="操作" width="450">
				<template scope="scope">
				<el-button size="small" v-if="scope.row.basic.parentId" type="warning" @click="handleViewTag2('')">返回</el-button>
				<el-button size="small" type="primary" @click="handleViewTag2(scope.row.feedId)">查看下级标签</el-button>
				<el-button size="small" @click="handleAddTag2(scope.row.feedId)">新增下级标签</el-button>
					<el-button size="small"  @click="handleEditTag2(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="handleDelTag2(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCityCurrentChange" :page-size="10" :total="cityTotal" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
    <el-tab-pane label="城市" name="p5">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="城市名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getTags">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button @click="handleAddCity">新增城市</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="cities" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.title" label="城市名称" width="200" >
			</el-table-column>
			<el-table-column prop="basic.created" label="创建时间" :formatter="formatDate" width="auto" >
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
				
					<el-button size="small" type="primary" @click="handleEditCity(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="handleDelCity(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCityCurrentChange" :page-size="10" :total="cityTotal" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
    <el-tab-pane label="群" name="p6">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="群名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query4">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="groups" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.title" label="名称" width="200" >
			</el-table-column>
			<el-table-column prop="basic.size" label="总人数" width="200" >
			</el-table-column>
			<el-table-column prop="basic.length" label="参与人数" width="200" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" width="auto" >
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
					<el-button size="small" @click="handleShowGroup(scope.$index, scope.row)">查看脸谱</el-button>
					<el-button size="small" type="primary" @click="handleEditGroup(scope.$index, scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="handleDelGroup(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleGroupCurrentChange" :page-size="10" :total="total3" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
  </el-tabs>


  		<!--新增脸谱界面-->
		<el-dialog title="新增脸谱" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名字" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="性别" prop="tags">
					<el-radio class="radio" v-model="addForm.sex" label="1">男</el-radio>
  					<el-radio class="radio" v-model="addForm.sex" label="2">女</el-radio>
				</el-form-item>

				<el-form-item label="国籍" prop="tags">
					<el-radio class="radio" v-model="addForm.country" label="中国">中国</el-radio>
  					<el-radio class="radio" v-model="addForm.country" label="美国">美国</el-radio>
				</el-form-item>


				<el-form-item label="职业" prop="tags">
					<el-checkbox-group v-model="addForm.jobs">
				    <el-checkbox :label="(t.basic)?t.basic.title:''" v-for="t in allTags" :key='t.basic.title'></el-checkbox>
				  </el-checkbox-group>
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

				<el-form-item label="简介">
					<el-input type="textarea" v-model="addForm.desc"></el-input>
				</el-form-item>

				<el-form-item label="关卡等级">
					<el-input-number v-model="addForm.level" :min="0" :max="1000"></el-input-number>
				</el-form-item>

				<el-form-item label="今日脸星">
					<el-switch
					  v-model="addForm.today"
					  on-text=""
					  off-text="">
					</el-switch>
				</el-form-item>

				<el-form-item label="新手测试">
					<el-switch
					  v-model="addForm.intro"
					  on-text=""
					  off-text="">
					</el-switch>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		

		<!--编辑脸谱界面-->
		<el-dialog title="修改脸谱" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名字" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="性别" prop="tags">
					<el-radio class="radio" v-model="editForm.sex" label="1">男</el-radio>
  					<el-radio class="radio" v-model="editForm.sex" label="2">女</el-radio>
				</el-form-item>

				<el-form-item label="国籍" prop="tags">
					<el-radio class="radio" v-model="editForm.country" label="中国">中国</el-radio>
  					<el-radio class="radio" v-model="editForm.country" label="美国">美国</el-radio>
				</el-form-item>

				<el-form-item label="城市">
					<el-input v-model="editForm.city"></el-input>
				</el-form-item>

				<el-form-item label="年龄">
					<el-input v-model="editForm.age"></el-input>
				</el-form-item>

			
				<el-form-item label="职业" prop="tags">
					<el-checkbox-group v-model="editForm.jobs">
				    <el-checkbox :label="(t.basic)?t.basic.title:''" v-for="t in tags" :key='t.basic.title'></el-checkbox>
				  </el-checkbox-group>
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

				<el-form-item label="简介">
					<el-input type="textarea" v-model="editForm.desc"></el-input>
				</el-form-item>

				<el-form-item label="关卡等级">
					<el-input-number v-model="editForm.level" :min="0" :max="1000"></el-input-number>
				</el-form-item>

				<el-form-item label="今日脸星">
					<el-switch
					  v-model="editForm.today"
					  on-text=""
					  off-text="">
					</el-switch>
				</el-form-item>

				<el-form-item label="新手测试">
					<el-switch
					  v-model="editForm.intro"
					  on-text=""
					  off-text="">
					</el-switch>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		

		<!--新增职业界面-->
		<el-dialog title="新增职业" v-model="addTagFormVisible" :close-on-click-modal="false">
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

		<!--修改职业界面-->
		<el-dialog title="修改职业" v-model="editTagFormVisible" :close-on-click-modal="false">
			<el-form :model="editTagForm" label-width="80px" :rules="editTagFormRules" ref="editTagForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="editTagForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="editTagForm.order" :min="0" :max="200"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editTagFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editTagSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!-- 小窗口，上传脸谱文件 -->
		<el-dialog
		  title="上传批量脸谱文件"
		  :visible.sync="addBatchFormVisible"
		  size="tiny">
		  <el-upload
			  class="upload-demo"
			  :action="avatarUrl"
			  :multiple="multiple"
			  accept=".xls,.xlsx"
			  :on-success="handleUploadSuccess">
			  <el-button size="small" type="primary">点击上传</el-button>
			  <div slot="tip" class="el-upload__tip">只能上传Excel表格文件，且不超过500kb</div>
			</el-upload>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addBatchFormVisible = false">关闭</el-button>
		    <el-button type="primary" @click.native="uploadSubmit">确定</el-button>
		  </span>
		</el-dialog>	

		<!--修改群界面-->
		<el-dialog title="修改群" v-model="editGroupFormVisible" :close-on-click-modal="false">
			<el-form :model="editGroupForm" label-width="80px" :rules="editGroupFormRules" ref="editGroupForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="editGroupForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="人数">
					<el-input-number v-model="editGroupForm.size" :min="0" :max="1000"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editGroupFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editGroupSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--查看群界面-->
		<el-dialog title="群脸谱" v-model="viewGroupVisible">
			<el-table
			    :data="viewGroup"
			    stripe
			    style="width: 100%">
			    <el-table-column label="头像" width="100">
					<template scope="scope">
						<img :src="scope.row.basic.avatar" style="width:60px;height:60px;vertical-align:middle;margin:5px 0;" />
					</template>
				</el-table-column>
			    <el-table-column
			      prop="basic.title"
			      label="姓名"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="created"
			      label="上传时间"
			      :formatter="formatDate">
			    </el-table-column>
			    <el-table-column label="操作" width="100">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
			  </el-table>
			  <!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange5" :page-size="10" :total="viewGroupTotal" style="float:right;">
			</el-pagination>
		</el-col>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="viewGroupVisible = false">关闭</el-button>
			</div>
		</el-dialog>

		<!--新增城市界面-->
		<el-dialog title="新增城市" v-model="addCityFormVisible" :close-on-click-modal="false">
			<el-form :model="addCityForm" label-width="80px" :rules="addCityFormRules" ref="addCityForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="addCityForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<!--
				<el-form-item label="排序">
					<el-input-number v-model="addTagForm.order" :min="0" :max="200"></el-input-number>
				</el-form-item>
				-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addCityFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addCitySubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--修改城市界面-->
		<el-dialog title="修改城市" v-model="editCityFormVisible" :close-on-click-modal="false">
			<el-form :model="editCityForm" label-width="80px" :rules="editCityFormRules" ref="editCityForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="editCityForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<!--
				<el-form-item label="排序">
					<el-input-number v-model="editCityForm.order" :min="0" :max="200"></el-input-number>
				</el-form-item>
				-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editCityFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editCitySubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增职业界面-->
		<el-dialog title="新增标签" v-model="addTag2FormVisible" :close-on-click-modal="false">
			<el-form :model="addTag2Form" label-width="80px" :rules="addTag2FormRules" ref="addTag2Form">
				<el-form-item label="名称" prop="title">
					<el-input v-model="addTag2Form.title" auto-complete="off"></el-input>
				</el-form-item>
				<!--
				<el-form-item label="排序">
					<el-input-number v-model="addTag2Form.order" :min="0" :max="200"></el-input-number>
				</el-form-item>
				-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addTag2FormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addTag2Submit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--修改职业界面-->
		<el-dialog title="修改标签" v-model="editTag2FormVisible" :close-on-click-modal="false">
			<el-form :model="editTag2Form" label-width="80px" :rules="editTag2FormRules" ref="editTag2Form">
				<el-form-item label="名称" prop="title">
					<el-input v-model="editTag2Form.title" auto-complete="off"></el-input>
				</el-form-item>
				<!--
				<el-form-item label="排序">
					<el-input-number v-model="editTag2Form.order" :min="0" :max="200"></el-input-number>
				</el-form-item>
				-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editTag2FormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editTag2Submit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getFaceListPage, addFace, addFaceBatch, editFace, removeFace, avatarUrl, addTag, getTagListPage, updateTag, removeTag, countFace, getFaceGroupListPage, updateFaceGroup, removeFaceGroup, getJobList, addFaceCity, editFaceCity, removeFaceCity, getFaceCityListPage, addFaceTag, updateFaceTag, removeFaceTag, getFaceTagListPage } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				activeName: 'p1',
				percentStep: false,
				catalogOptions: [],
				catalogChildrenOptions: [],
				countryOptions: [{
					label: '中国',
					value: '中国'
				}, {
					label: '美国',
					value: '美国'
				}],
				sexOptions: [{
					label: '男',
					value: '1'
				}, {
					label: '女',
					value: '2'
				}],
				levelOptions: [{
					label: '0级',
					value: '0'
				}, {
					label: '1级',
					value: '1'
				}, {
					label: '2级',
					value: '2'
				}, {
					label: '3级',
					value: '3'
				}, {
					label: '4级',
					value: '4'
				}, {
					label: '5级',
					value: '5'
				}],
				ageOptions: [{
					label: '70后',
					value: '70后'
				},{
					label: '80后',
					value: '80后'
				},{
					label: '85后',
					value: '85后'
				},{
					label: '90后',
					value: '90后'
				},{
					label: '95后',
					value: '95后'
				},{
					label: '00后',
					value: '00后'
				}],
				jobOptions: [],
				multipleSelection: [],
				multipleSelection2: [],
				imageUrl: '',
				imageList: [],
				albumList: [],
				checkList: [],
				filters: {
					title: '',
					country: '',
					sex: '',
					level: '',
					jobs: '',
					city: '',
					age: '',
					parentId: ''
				},
				products: [],
				products2: [],
				groups: [],
				tags: [],
				total: 0,
				total2: 0,
				total3: 0,
				page: 1,
				page2: 1,
				page3: 1,
				listLoading: false,
				tagPage: 1,
				tagTotal: 0,

				tag2Page: 1,
				tag2Total: 0,
				tags2: [],

				cityPage: 1,
				cityTotal: 0,
				cities: [],

				allTags: [],

				multiple: false,
				addBatchFormVisible: false,
				addBatchPath: '',
				avatarUrl: avatarUrl,

				viewGroupVisible: false,
				viewGroup: [],
				viewGroupPage: 1,
				viewGroupTotal: 0,
				viewGroupFeedId: '',


				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					sex: 0,
					country: '',
					jobs: [],
					avatar: '',
					desc: '',
					level: 0,
					today: false,
					intro: false
				},

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入商品名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					producId: '',
					title: '',
					sex: 0,
					country: '',
					jobs: [],
					avatar: '',
					desc: '',
					level: 0,
					today: false,
					intro: false
				},

				addTagFormVisible: false,//新增界面是否显示
				addTagFormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增职业界面数据
				addTagForm: {
					title: '',
					order: 0
				},

				editTagFormVisible: false,//新增界面是否显示
				editTagFormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//编辑职业界面数据
				editTagForm: {
					tagId: '',
					title: '',
					order: 0
				},

				editGroupFormVisible: false,//新增界面是否显示
				editGroupFormRules: {
					title: [
						{ required: true, message: '请输入群名称', trigger: 'blur' }
					]
				},
				//编辑群界面数据
				editGroupForm: {
					feedId: '',
					title: '',
					size: 0
				},

				//新增职业界面数据
				addCityFormVisible: false,//新增界面是否显示
				addCityFormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				addCityForm: {
					title: ''
				},
				editCityFormVisible: false,//新增界面是否显示
				editCityFormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//编辑职业界面数据
				editCityForm: {
					feedId: '',
					title: ''
				},

				addTag2FormVisible: false,//新增界面是否显示
				addTag2FormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增职业界面数据
				addTag2Form: {
					title: '',
					order: 0
				},

				editTag2FormVisible: false,//新增界面是否显示
				editTag2FormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//编辑职业界面数据
				editTag2Form: {
					tagId: '',
					title: '',
					order: 0
				},

			}
		},
		methods: {
			getJobs() {
				getJobList({
					page: 1,
					size: 100
				}).then(res => {
					if(res.code > 0) {
						this.$message.error({
							message: res.message
						})
						return;
					}
					let arr = [];
					res.data.list.forEach(item => {
						arr.push({
							label: item.basic.title,
							value: item.basic.title
						})
					})
					this.jobOptions = arr;
				})
			},
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
			 handleRemove(file, fileList) {
		        console.log('handleRemove:', file, fileList);
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
			formatSex: function (row, column) {
				return (row.basic.sex==1)?'男':'女'
			},
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm')
			},
			formatToday: function (row, column) {
				return (row.basic.today)?'是':''
			},
			formatIntro: function (row, column) {
				return (row.basic.intro)?'是':''
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getProducts();
			},
			handleCurrentChange2(val) {
				this.page2 = val;
				this.getProducts2();
			},
			handleCurrentChange5(val) {
				this.viewGroupPage = val;
				getFaceListPage({
					page: this.viewGroupPage,
					size: 10,
					groupId: viewGroupFeedId
				}).then(res => {
					this.viewGroup = res.data.list
					this.viewGroupTotal = res.data.total
				})
			},
			handleTagCurrentChange(val) {
				this.tagPage = val;
				this.getTags();
			},
			handleGroupCurrentChange(val) {
				this.page3 = val;
				this.getGroups();
			},
			handleCityCurrentChange(val) {
				this.cityPage = val;
				this.getCities();
			},
			handleClick(){

			},
			handleViewTag2(parentId){
				this.filters.parentId = parentId
				this.getTags2()
			},
			handleShowGroup(index, row) {
				this.viewGroupVisible = true
				this.viewGroupFeedId = row.feedId
				getFaceListPage({
					groupId: row.feedId,
					page: this.viewGroupPage,
					size: 10
				}).then(res => {
					this.viewGroup = res.data.list
					this.viewGroupTotal = res.data.total
				})
			},
			//获取用户列表
			getProducts() {
				let para = {
					title: this.filters.title,
					country: this.filters.country,
					sex: this.filters.sex,
					level: this.filters.level,
					jobs: this.filters.jobs,
					city: this.filters.city,
					age: this.filters.age,
					page: this.page,
					system: 1,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getFaceListPage(para).then((res) => {
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
			getProducts2() {
				let para = {
					title: this.filters.title,
					country: this.filters.country,
					sex: this.filters.sex,
					level: this.filters.level,
					jobs: this.filters.jobs,
					age: this.filters.age,
					city: this.filters.city,
					system: 2,
					page: this.page2,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getFaceListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					
					this.total2 = res.data.total;
					this.products2 = res.data.list;
					this.listLoading = false;
					console.log(res.data.list)
					//NProgress.done();
				});
			},
			// 获取标签
			getTags() {
				let para = {
					title: this.filters.title,
					page: this.tagPage,
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
					this.tagTotal = res.data.total;
					this.tags = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			// 获取标签
			getTags2() {
				let para = {
					title: this.filters.title,
					parentId: this.filters.parentId,
					page: this.tag2Page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getFaceTagListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.tag2Total = res.data.total;
					this.tags2 = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			// 获取群
			getGroups() {
				let para = {
					title: this.filters.title,
					page: this.page3,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getFaceGroupListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total3 = res.data.total;
					this.groups = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			// 获取标签
			getCities() {
				let para = {
					title: this.filters.title,
					page: this.cityPage,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getFaceCityListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.cityTotal = res.data.total;
					this.cities = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除脸谱：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feedId: row.feedId };

					removeFace(para).then((res) => {
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

			//删除标签
			handleDelTag2: function (index, row) {
				this.$confirm('确认删除标签：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feedId: row.feedId };

					removeFaceTag(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getTags2();
					});
				}).catch(() => {

				});
			},

			//删除群
			handleDelGroup: function (index, row) {
				this.$confirm('确认删除群：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feedId: row.feedId };

					removeFaceGroup(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getGroups();
					});
				}).catch(() => {

				});
			},

			//删除标签
			handleDelCity: function (index, row) {
				this.$confirm('确认删除城市：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feedId: row.feedId };

					removeFaceCity(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCities();
					});
				}).catch(() => {

				});
			},

			//显示编辑界面
			handleShowCount: function (index, row) {
				countFace({
					tag: row.basic.title
				}).then( res => {
					this.$alert(`职业: ${row.basic.title} 的人数是：${res.data} 人`, '职业人数', {
		          confirmButtonText: '确定',
		          callback: action => {
		            
		          }
		        });
				})
				
			},
			
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row.basic, {
					feedId: row.feedId
				});
				this.imageUrl = row.basic.avatar
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					title: '',
					sex: 0,
					country: '',
					jobs: [],
					avatar: '',
					desc: '',
					level: 0,
					today: false,
					intro: false
				};
				getTagListPage({
					page: 1,
					size: 1000
				}).then(res => {
					this.allTags = res.data.list
				})
			},
			// 批量增加脸谱
			handleAddBatch() {
				this.addBatchFormVisible = true;
			},
			//显示编辑群界面
			handleEditGroup: function (index, row) {
				this.editGroupFormVisible = true;
				this.editGroupForm = Object.assign({}, row.basic, {
					feedId: row.feedId
				});
			},
			//显示编辑职业界面
			handleEditTag: function (index, row) {
				this.editTagFormVisible = true;
				this.editTagForm = Object.assign({}, row.basic, {
					tagId: row.tagId
				});
			},
			handleEditTag2: function (index, row) {
				this.editTag2FormVisible = true;
				this.editTag2Form = Object.assign({}, row.basic, {
					feedId: row.feedId
				});
			},
			//显示新增界面
			handleAddTag: function () {
				this.addTagFormVisible = true;
				this.addTagForm = {
					title: '',
					order: 0
				};
			},
			//显示新增界面
			handleAddTag2: function (parentId) {
				this.addTag2FormVisible = true;
				this.addTag2Form = {
					title: '',
					parentId: (parentId)?parentId:'',
					order: 0
				};
			},
			//显示编辑职业界面
			handleEditCity: function (index, row) {
				this.editCityFormVisible = true;
				this.editCityForm = Object.assign({}, row.basic, {
					feedId: row.feedId
				});
			},
			//显示新增界面
			handleAddCity: function () {
				this.addCityFormVisible = true;
				this.addCityForm = {
					title: ''
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
							
							editFace(para).then((res) => {
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
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						//this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.avatar = this.imageUrl
							para.system = true

							addFace(para).then((res) => {
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
						//});
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
			//修改Tag
			editTagSubmit: function () {
				this.$refs.editTagForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editTagForm);


							updateTag(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
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
			//修改Group
			editGroupSubmit: function () {
				this.$refs.editGroupForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editGroupForm);


							updateFaceGroup(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editGroupForm'].resetFields();
								this.editGroupFormVisible = false;
								this.getGroups();
							});
						});
					}
				});
			},
			//新增City
			addCitySubmit: function () {
				this.$refs.addCityForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addCityForm);


							addFaceCity(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addCityForm'].resetFields();
								this.addCityFormVisible = false;
								this.getCities();
							});
						});
					}
				});
			},
			//修改City
			editCitySubmit: function () {
				this.$refs.editCityForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editCityForm);


							editFaceCity(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editCityForm'].resetFields();
								this.editCityFormVisible = false;
								this.getCities();
							});
						});
					}
				});
			},
			//新增Tag
			addTag2Submit: function () {
				this.$refs.addTag2Form.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addTag2Form);
							if(typeof(para.parentId) == 'object')
								para.parentId = ''


							addFaceTag(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addTag2Form'].resetFields();
								this.addTag2FormVisible = false;
								this.getTags2();
							});
						});
					}
				});
			},
			//修改Tag
			editTag2Submit: function () {
				this.$refs.editTag2Form.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editTag2Form);


							updateFaceTag(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editTag2Form'].resetFields();
								this.editTag2FormVisible = false;
								this.getTags2();
							});
						});
					}
				});
			},
			uploadSubmit() {
				this.addBatchFormVisible = false
				addFaceBatch({
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
						  message: '新增脸谱数量：'+res.data.length
						});
					this.getProducts();
				})
			},
			 handleSelectionChange(val) {
		        this.multipleSelection = val;
		      },
		      handleSelectionChange2(val) {
		        this.multipleSelection2 = val;
		      },
		      //批量删除
			batchRemove: function (v) {
				var ids = (v==1)?this.multipleSelection.map(item => item.feedId):this.multipleSelection2.map(item => item.feedId)
				this.$confirm('确认删除选中脸谱吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { idList: ids };

					removeFace(para).then((res) => {
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
			query() {
				this.page = 1
				this.getProducts()
			},
			query2() {
				this.page = 1
				this.getProducts2()
			},
			query3() {
				this.page = 1
				this.getTags()
			},
			query4() {
				this.page = 1
				this.getGroups()
			},
			query5() {
				this.tag2Page = 1
				//this.filters.parentId = 'all'
				this.getTags2()
			}
		},
		mounted() {
			this.getProducts();
			this.getProducts2()
			this.getTags()
			this.getGroups()
			this.getJobs()
			this.getCities()
			this.getTags2()
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

  .demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>