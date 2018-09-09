<template>
	<section>
		<div v-if='level == 1'>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="收款项目名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button v-show='level == 1' type="primary" v-on:click="addProduct">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="dataForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop='basic.title' label='收款项目名称' width="auto">
			</el-table-column>
			<el-table-column :formatter='formatDate' label='创建时间' width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width='250'>
		      <template scope="scope">
		        <el-button
		          size="small"
		          v-show='level == 1'
		          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
		        <el-button
		          size="small"
		          type="danger"
		          v-show='level == 1'
		          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;" :current-page="page">
			</el-pagination>
		</el-col>

		<!-- 增加弹窗 -->
		<el-dialog title="新增收款项目" v-model="addProductVisible" @close='initAddForm'>
		  <el-form :model="addForm" label-width="140px">
		    <el-form-item label="收款项目名称">
		      <el-input v-model="addForm.title" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="显示顺序">
		      <el-input-number v-model="addForm.order" auto-complete="off"></el-input-number>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="addProductVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addCheck">确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑收款项目" v-model="editProductVisible">
		  <el-form :model="editForm" label-width="140px">
		    <el-form-item label="收款项目名称">
		      <el-input v-model="editForm.title" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="显示顺序">
		      <el-input-number v-model="editForm.order" auto-complete="off"></el-input-number>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="editProductVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editCheck">确 定</el-button>
		  </div>
		</el-dialog>
		</div>
		<div v-else>
			<h1 class='no-power'>没有管理权限</h1>
		</div>
	</section>
</template>
<script>
	import { getProductListPage, addProduct, updateProduct, removeProduct } from '@/api/api'
	import moment from 'moment'
	export default {
		name: 'Product',
		created() {
			this.level = this.store.get('user').role.level
			this.getProductList()
		},
		filters: {
		},
		data () {
			return {
				level: '',
				filters: {
					name: ''
				},
				total: 0,
				page: 1,
				listLoading: false,
				dataForm: [],
				addProductVisible: false,
				addForm: {
					title: '',
					order: 0
				},
				editProductVisible: false,
				editForm: {
					productId: '',
					title: '',
					order: 0
				}
			}
		},
		methods: {
			getProductList() {
				this.listLoading = true;
				getProductListPage({
					sortByOrder: 1,
					page: this.page,
					size: 10
				}).then(res => {
					if(res.code === 0) {
						this.listLoading = false;
						// console.log(res.data.list);
						this.total = res.data.total;
						this.dataForm = res.data.list;
						// console.log(res.data)
					} else {
						this.$message.error({
							messsage: res.message
						})
					}
				})
			},
		// 弹窗操作 
			// 增加收银窗口模块
			addProduct() {
				this.addProductVisible = true;
			},
			addCheck() {
				addProduct(this.addForm).then(res => {
					if(res.code === 0) {
						this.addProductVisible = false;
						// console.log(res.data);
						this.$message.success({
							message: '新增成功'
						})
						this.getProductList();
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			initAddForm() {
				this.addForm = {
					title: '',
					order: 0
				}
			},
			// 编辑操作模块
			editProduct() {
				this.editProductVisible = true;
			},
			editCheck() {
				updateProduct(this.editForm).then(res => {
					if(res.code === 0) {
						this.$message.success({
							message: '修改成功'
						});
						this.editProductVisible = false;
						this.getProductList();
					} else {
						this.$message.error({
							message: res.message
						});
					}
				})
				// this.editProductVisible = false;
				// console.log(this.editForm);
			},
			initEditProduct(row) {
				this.editForm = {
					productId: row.productId,
					title: row.basic.title,
					order: row.basic.order
				}
			},
		// 表格操作
			// 格式化表格数据
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.getProductList();
			},
			// 编辑
			handleEdit(index, row) {
				this.editProductVisible = true;
				this.initEditProduct(row);
				// console.log(index, row);
			},
			// 删除
			handleDelete(index, row) {
				this.$confirm('确认删除收款项目：'+row.basic.title+'?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
			        this.deleteProduct({
						productId: row.productId
					});
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
				// console.log(index, row);	
			},
			deleteProduct(para) {
				removeProduct(para).then(res => {
					if(res.code === 0) {
						this.$message.success({
							message: '删除成功'
						});
						this.getProductList();
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			// 搜索
			query() {

			}
		}
	}
</script>
<style scoped>
.step-open {
	color: #13CE66;
}
.step-close {
	color: #FF4949
}
.canvas-wrap {
	text-align: center;
}
.no-power {
	font-size: 20px;
	margin-top: 60px;
	text-align: center;
  }
</style>