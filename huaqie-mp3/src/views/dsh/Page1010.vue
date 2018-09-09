<template>
	<section>
	 <el-row>
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				
				<el-form-item>
					<el-button type="primary" v-on:click="back">返回</el-button>
					<el-button v-on:click="handleAdd()">新增音频</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="audios" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column type="expand" style='overflow: hidden'>
		      <template scope="props">
		      	<el-row>
		      	<el-col :span="12">
		      			<p>文稿：</p>
		      			<div v-html="replace(props.row.doc)"></div>
		      		
		      		</el-col>
		      		</el-row>
		     </template>
		     </el-table-column>
			<el-table-column prop="title" label="标题" width="200" >
			</el-table-column>
			<el-table-column prop="period" label="长度（秒）" width="150"  >
			</el-table-column>
			<el-table-column prop="path" label="地址" width="300"  >
			</el-table-column>
			<el-table-column prop="doc.length" label="文稿字数" width="150"  >
			</el-table-column>
			<!--
			<el-table-column prop="score" label="状态" width="120" >
				<template scope="scope">
					<p v-if="scope.row.basic.step==1">待处理</p>
					<p v-if="scope.row.basic.step==2" style="color: green">已通过</p>
					<p v-if="scope.row.basic.step==3" style="color: red">已拒绝</p>
				</template>
			</el-table-column>
			-->
			<el-table-column prop="created" :formatter="formatDate" label="创建时间" min-width="180" >
			</el-table-column>
			<el-table-column label="操作" width="150">
		
				<template scope="scope">
				<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				<el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				
				</template>
			
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="total" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
   
		</el-row>

		<!--新增音频弹窗-->
		<el-dialog title="新增音频" v-model="addFormVisible" :close-on-click-modal="false" @close='addFormVisible=false'>
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题">
					<el-input v-model="addForm.title" class='small-el-input' auto-complete="off" placeholder='请输入音频标题'></el-input>
				</el-form-item>
				
				<el-form-item label="时长（秒）" prop='period'>
					<el-input-number v-model="addForm.period" placeholder='请输入音频时长'></el-input-number>
				</el-form-item>

				<el-form-item label="地址">
					<el-upload
				  class="avatar-uploader"
				  action="https://g5.huaqie.com/upload"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload"
				  >
				   <el-button size="small" type="primary">点击上传</el-button>
					
				</el-upload>
				<p>{{imageUrl}}</p>
				</el-form-item>

				<el-form-item label="文稿" prop='doc'>
					<el-input type="textarea" v-model="addForm.doc" :autosize="{minRows: 10}" placeholder='请输入音频地址'></el-input>
				</el-form-item>
				
			</el-form>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible=false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑音频弹窗-->
		<el-dialog title="编辑音频" v-model="editFormVisible" :close-on-click-modal="false" @close='editFormVisible=false'>
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题">
					<el-input v-model="editForm.title" class='small-el-input' auto-complete="off" placeholder='请输入音频标题'></el-input>
				</el-form-item>
				
				<el-form-item label="时长" prop='period'>
					<el-input type="text" v-model="editForm.period" class='small-el-input' placeholder='请输入音频时长'></el-input>
				</el-form-item>

				<el-form-item label="地址">
					<el-upload
				  class="avatar-uploader"
				  action="https://g5.huaqie.com/upload"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload"
				  >
				   <el-button size="small" type="primary">点击上传</el-button>
					
				</el-upload>
				<p>{{imageUrl}}</p>
				</el-form-item>

				<el-form-item label="文稿" prop='doc'>
					<el-input type="textarea" v-model="editForm.doc" :autosize="{minRows: 10}" class='small-el-input' placeholder='请输入音频地址'></el-input>
				</el-form-item>
			</el-form>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible=false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { dshFindBookById, dshUpdateBook } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					text: '',
					step: ''
				},
				productId: '',
				audios: [],
				total: 0,
				page: 1,
				listLoading: false,
				addLoading: false,

				replace: (str) => {
					return str.replace(/\n/g, '<br>')
				},

				imageUrl: '',

				// 增加新渠道
				addForm: {
					title: '',
					period: '',
					path: '',
					doc: ''
				},
				addFormVisible: false,//新增界面是否显示
				addFormRules: {
					title: [
						{ required: true, message: '请输入音频名称', trigger: 'blur' }
					]
				},

				// 编辑音频
				editForm: {
					index: 0,
					title: '',
					period: '',
					path: '',
					doc: '',
					created: ''
				},
				editFormVisible: false,//新增界面是否显示
				editFormRules: {
					title: [
						{ required: true, message: '请输入音频名称', trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.basic.sex == 1 ? '男' : row.basic.sex == 2 ? '女' : '未知';
			},
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getComments();
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
		      },
		      beforeAvatarUpload(file) {
		      	console.log('file.type', file.type)
		      	const isMP3 = (file.type == 'audio/mp3' || file.type == 'audio/mpeg')
		        const isLt50M = file.size / 1024 / 1024 < 50;

		        if (!isMP3) {
		          this.$message.error('上传音频只能是 mp3 格式!');
		        }

		        if (!isLt50M) {
		          this.$message.error('上传音频大小不能超过 50MB!');
		        }

		        if(isMP3 && isLt50M)
		        	this.imageUrl = '上传中，请稍候。。。'

		        return isMP3 && isLt50M
		      },
			//显示查看界面
			handleShow: function (index, row) {
				this.showFormVisible = true;
				//this.showForm = {}
				this.showForm = Object.assign({}, row);
				/*
				getOrderById({
					peopleId: row.peopleId
				}).then(res => {
					this.showForm = res.data
				})
				*/
			},
			//获取用户列表
			getBook() {
				this.listLoading = true;
				//NProgress.start();
				let para = {
					productId: this.productId
				}
				dshFindBookById(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.audios = res.data.basic.audios
					this.total = res.data.basic.audios.length
					this.listLoading = false;
					//NProgress.done();
				});
			},
			// 新增音频
			handleAdd() {
				this.addFormVisible = true
				this.addForm = {
					title: '',
					period: '',
					path: '',
					doc: ''
				}
			},
			// 编辑音频
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({
					index: index
				}, row)
				this.imageUrl = row.path
			},
			addSubmit() {
				this.audios.push({
					title: this.addForm.title,
					period: this.addForm.period,
					path: this.imageUrl,
					doc: this.addForm.doc,
					created: new Date().getTime()
				})
				dshUpdateBook({
	          	productId: this.productId,
	          	audios: this.audios
	          }).then( res => {
	          	this.$message.success('保存成功')
	          	this.addFormVisible = false
	          	this.getBook()
	          })
			},
			editSubmit() {
				this.audios.forEach((e, k) => {
					if(k == this.editForm.index){
						this.audios[k] = {
							title: this.editForm.title,
							period: this.editForm.period,
							path: this.imageUrl,
							doc: this.editForm.doc,
							created: this.editForm.created
						}
					}
						
				})
				dshUpdateBook({
	          	productId: this.productId,
	          	audios: this.audios
	          }).then( res => {
	          	this.$message.success('保存成功')
	          	this.editFormVisible = false
	          	this.getBook()
	          })
			},
			// 删除渠道
			handleDel(index, row) {
				this.$confirm(`确定要删除音频：${row.title} 吗?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.audios.splice(index, 1)
		          dshUpdateBook({
		          	productId: this.productId,
		          	audios: this.audios
		          }).then( res => {
		          	this.$message.success('提交成功')
		          })
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			back() {
				this.$router.back()
			}
		},
		mounted() {
			this.productId = this.$route.query.productId
			this.getBook()
		}
	}

</script>

<style scoped>
pre{
	width: 600px;
	word-break: break-all;
}
.card-image{
	width: 300px;
}
.verify-button{
	margin-left: 20px;
}
.red{
	color: red;
}
</style>