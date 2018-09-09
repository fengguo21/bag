<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="News Title"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getNews">Search</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">Add News</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<!-- v-loading="listLoading"  -->
		<el-table :data="products" highlight-current-row style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.title" label="Title" min-width="500" >
			</el-table-column>
			<el-table-column prop="created" label="Create Time" :formatter="formatDate" width="200" >
			</el-table-column>
			<el-table-column prop="updated" label="Last Time Modified" :formatter="formatEditDate" width="200" >
			</el-table-column>
			<el-table-column label="Operation" width="360">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleQuery(scope.$index, scope.row)">See Details</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!-- add news -->
		<el-dialog title="Add News" v-model="addFormVisible">
			<el-form>
			    <el-form-item label="News Title" :label-width="formLabelWidth">
			      <el-input v-model="title" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="News detail" :label-width="formLabelWidth">
			      <vue-html5-editor :content="content" :height="300" :z-index="1000" :auto-height="false" :show-module-name="false" @change="updateData"></vue-html5-editor>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="cancelAdd">Cancel</el-button>
			    <el-button type="primary" @click="saveAdd">Confirm</el-button>
			</div>
		</el-dialog>

		<!-- edit news -->
		<el-dialog title="News detail" v-model="editFormVisible">
			<el-form>
			    <el-form-item label="News Title" :label-width="formLabelWidth">
			      <el-input v-model="title" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="News Content" :label-width="formLabelWidth">
			      <vue-html5-editor :content="content" :height="300" :z-index="1000" :auto-height="false" :show-module-name="false" @change="updateData"></vue-html5-editor>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="cancelEdit">Cancel</el-button>
			    <el-button type="primary" @click="saveEdit">Confirm</el-button>
			</div>
		</el-dialog>

		<!-- show news -->
		<el-dialog title="News detail" v-model="queryVisible" :close-on-click-modal='false' :show-close='false'>
			<el-form>
			    <el-form-item label="News Title：" :label-width="formLabelWidth">
			      {{title}}
			    </el-form-item>
			    <el-form-item label="News Content：" :label-width="formLabelWidth">
			      <div v-html='content'></div>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="init('query')">Confirm</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
import { getNewsList, createNews, updateNews, removeNews, getNewsById } from '@/api/api'
import moment from 'moment'
export default {
	name: 'news',
	data() {
		return {
			page: 1,
			total: 0,
			filters: {
				title: ''
			},
			feedId: '',
			formLabelWidth: '120px',
			listLoading: true,
			products: [],
			queryVisible: false,
			addFormVisible: false,
			editFormVisible: false,
			title: '',
			content: ''
		}
	},
	created() {
		this.getNews()
	},
	methods: {
		//formatter
		formatDate: function (row, column) {
			return moment(row.created).format('YYYY-MM-DD HH:mm')
		},
		formatEditDate: function (row, column) {
			return moment(row.updated).format('YYYY-MM-DD HH:mm')
		},
		// 获取新闻列表
		getNews() {
			getNewsList({
				title: this.filters.title,
				page: this.page,
				size: 10
			}).then(res => {
				if(res.code > 0) {
					this.$message.error(res.message)
					return;
				}
				this.products = res.data.list;
				this.total = res.data.total;
				// console.log(res)
			})
		},
		init(formName) {
			this.title = '',
			this.content = '',
			this[`${formName}Visible`] = false;
		},
		updateData(val) {
			this.content = val;
			// console.log(val);
		},
		// 新增新闻流程
		handleAdd() {
			this.addFormVisible = true;
		},
		saveAdd() {
			if(this.title == '') {
				this.$message.error('The news headline can not be empty')
				return;
			}
			if(this.content == '') {
				this.$message.error('News content can not be empty')
				return;
			}
			createNews({
				title: this.title,
				text: this.content
			}).then(res => {
				if(res.code > 0) {
					this.$message.error(res.message)
					return;
				}
				this.$message.success('New success');
				this.init('addForm');
				this.getNews()
				// console.log(res)
			})
			// this.init()
		},
		cancelAdd() {
			this.init('addForm');
		},
		// 编辑流程 
		handleEdit(index, row) {
			this.editFormVisible = true;
			this.title = row.basic.title;
			this.content = row.basic.text;
			this.feedId = row.feedId
		},
		saveEdit() {
			if(this.title == '') {
				this.$message.error('The news headline can not be empty')
				return;
			}
			if(this.content == '') {
				this.$message.error('News content can not be empty')
				return;
			}
			updateNews({
				feedId: this.feedId,
				title: this.title,
				text: this.content
			}).then(res => {
				if(res.code > 0) {
					this.$message.error(res.message)
					return;
				}
				this.$message.success('Edit success');
				this.init('editForm');
				this.getNews()
				// console.log(res)
			})
			// this.init()
		},
		cancelEdit() {
			this.init('editForm');
		},
		// 删除流程
		handleDel(index, row) {
			this.$confirm('This action will permanently delete the news and continue?', 'prompt', {
	          confirmButtonText: 'Confirm',
	          cancelButtonText: 'Cancel',
	          type: 'warning'
	        }).then(() => {
	        	removeNews({
	        		feedId: row.feedId
	        	}).then(res => {
	        		if(res.code > 0) {
	        			this.$message.error(res.message)
	        			return;
	        		}
	        		this.$message({
	        		  type: 'success',
	        		  message: 'Successfully deleted!'
	        		});
	        		this.getNews()
	        	})
	        }).catch(() => {
	            this.$message({
	               type: 'info',
	               message: 'Canceled deleted'
	            });          
	        });
		},
		// 查看详情流程
		handleQuery(index, row) {
			this.queryVisible = true;
			this.title = row.basic.title;
			this.content = row.basic.text
		},
		// 分页
		handleCurrentChange(val) {
			this.page = val;
			this.getNews();
		},
	}
}
</script>
<style scoped>
.news {
	margin-top: 40px;
}
.news-btn {
	margin-top: 20px;
	overflow: hidden;
}
</style>