<template>
	<section>
	
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="轮播标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAdvertises">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button  @click="handleAdd">新增轮播</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="advertises" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column type="expand" style='overflow: hidden'>
		      <template scope="props">
		        <div class="server-wrap">
		        	<h3 style='margin-top: 0;'>ID: {{ props.row.advertiseId }}</h3>
		        	<p>内容：</p>
		        	<el-col :span="12"><div v-html="replace(props.row.basic.text)"></div></el-col>
		        
		        </div>
		      </template>
		    </el-table-column>
			<el-table-column label="封面" width="100">
				<template scope="scope">
					<img :src="scope.row.basic.image" style="width:120px;vertical-align:middle;margin:5px 0;" />
				</template>

			</el-table-column>
			<el-table-column prop="basic.title" label="标题" width="250" >
			</el-table-column>
			<el-table-column prop="basic.order" label="排序" width="100" >
			</el-table-column>
			<el-table-column prop="basic.order" label="类型" :formatter="formatMode" width="100" >
			</el-table-column>
			<el-table-column prop="basic.text.length" label="内容长度" width="300">
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" >
			</el-table-column>
			<el-table-column label="操作" width="150">
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
		<el-dialog title="新增轮播" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="封面">
					<el-upload
				  class="avatar-uploader"
				  action="https://g5.huaqie.com/upload"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload">
				  <img v-if="imageUrl" :src="imageUrl" class="avatar">
				  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				<p>建议尺寸：750px * 320px</p>
				</el-form-item>

				<el-form-item label="排序">
					<el-input-number v-model="addForm.order" :min="0" :max="200"></el-input-number>
				</el-form-item>

				<el-form-item label="类型">
					 <el-radio class="radio" v-model="addForm.mode" label="1">活动</el-radio>
  					<el-radio class="radio" v-model="addForm.mode" label="2">优惠券</el-radio>
				</el-form-item>

				<el-form-item label="内容" v-if="addForm.mode==1">
					<vue-html5-editor :content="content" :height="300" :z-index="1000" :auto-height="false" :show-module-name="false" @change="updateData"></vue-html5-editor>
				</el-form-item>
				<el-form-item label="内容" v-if="addForm.mode==2">
					<el-input v-model="addForm.text" placeholder="请输入优惠券ID"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="修改轮播" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="封面">
					<el-upload
				  class="avatar-uploader"
				  action="https://g5.huaqie.com/upload"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload">
				  <img v-if="imageUrl" :src="imageUrl" class="avatar">
				  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				<p>建议尺寸：750px * 320px</p>
				</el-form-item>

				<el-form-item label="排序">
					<el-input-number v-model="editForm.order" :min="0" :max="200"></el-input-number>
				</el-form-item>

				<el-form-item label="类型">
					 <el-radio class="radio" v-model="editForm.mode" label="1">活动</el-radio>
  					<el-radio class="radio" v-model="editForm.mode" label="2">优惠券</el-radio>
				</el-form-item>

				<el-form-item label="内容" v-if="editForm.mode==1">
					<vue-html5-editor :content="content" :height="300" :z-index="1000" :auto-height="false" :show-module-name="false" @change="updateData"></vue-html5-editor>
				</el-form-item>
				<el-form-item label="内容" v-if="editForm.mode==2">
					<el-input v-model="editForm.text" placeholder="请输入优惠券ID"></el-input>
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
	import { getAdvertiseListPage, addAdvertise, updateAdvertise, removeAdvertise } from '../../api/api';
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
				advertises: [],
				tags: [],
				catalogs: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				content: '',

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					
				},
				//编辑界面数据
				editForm: {
					advertiseId: '',
					title: '',
					image: '',
					text: '',
					mode: '1',
					order: 0
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					
				},
				//新增界面数据
				addForm: {
					title: '',
					image: '',
					mode: 1,
					text: '',
					order: 0
				},

				replace: (str) => {
					return str.replace(/\n/g, '<br>')
				}

			}
		},
		methods: {
			updateData(val) {
				this.content = val;
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
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm')
			},
			formatMode: function (row, column) {
				return (row.basic.mode == 1)?'活动':'优惠券'
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
				this.getAdvertises();
			},
			handleClick(){

			},
			//获取用户列表
			getAdvertises() {
				let para = {
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getAdvertiseListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					
					this.total = res.data.total;
					this.advertises = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除轮播：'+row.basic.title+' 吗?', '提示', {
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
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row.basic, {
					advertiseId: row.advertiseId
				});
				this.imageUrl = row.basic.image
				this.content = row.basic.text
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					title: '',
					image: '',
					text: '',
					mode: '1',
					order: 0
				};
				this.imageUrl = ''
				this.content = ''
			},
			
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.image = this.imageUrl
							if(this.editForm.mode == 1)
								para.text = this.content
							
							updateAdvertise(para).then((res) => {
								this.editLoading = false;
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
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.image = this.imageUrl
							if(this.addForm.mode == 1)
								para.text = this.content

							addAdvertise(para).then((res) => {
								this.addLoading = false;
								if(res.code){
									this.$message({
										message: res.message,
										type: 'error'
									})
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
			}
		},
		mounted() {
			this.getAdvertises();
		}
	}

</script>

<style scoped>
.pre{
	width: 100px;
	word-break: break-all;
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
 	height: 80px;
    display: block;
  }
  .avatar-2 {
  	width: 200px;
    height: 100px;
    display: block;
  }
</style>