<template>
	<section>
		<div v-if='level == 1'>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="打印机名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button v-show='level == 1' type="primary" v-on:click="addPrinter">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="dataForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column type="expand">
		      <template scope="props">
		        <el-form label-position="left" inline label-width='100px' class="demo-table-expand">
		          <el-form-item label="小票抬头">
		            <span>{{ props.row.basic.title }}</span>
		          </el-form-item>
					<el-form-item label="收款窗口">
		            <span>{{ (props.row.branch)?props.row.branch.title:'' }}</span>
		          </el-form-item>
		        </el-form>
		      </template>
		    </el-table-column>
			<el-table-column prop='basic.name' label='打印机名称' width="200">
			</el-table-column>
			<el-table-column prop='basic.deviceNo' label='设备ID'>
			</el-table-column>
			<el-table-column prop='basic.key' label='设备密钥'>
			</el-table-column>
			<el-table-column prop='basic.apiUrl' label='服务器地址'>
			</el-table-column>
			<el-table-column :formatter='formatDate' label='创建时间' width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width='250'>
		      <template scope="scope">
		      <el-button
		          size="small"
		          type='primary'
		          @click="handleBindBranch(scope.$index, scope.row)">绑定收款窗口</el-button>
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
		<el-dialog title="新增打印机" v-model="addPrinterVisible" @close='initAddForm'>
		  <el-form :model="addForm" label-width="140px">
		    <el-form-item label="打印机名称">
		      <el-input v-model="addForm.name" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="小票抬头">
		      <el-input v-model="addForm.title" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="设备ID">
		      <el-input v-model="addForm.deviceNo" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="设备密钥">
		      <el-input v-model="addForm.key" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="服务器地址">
		      <el-input v-model="addForm.apiUrl" auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="addPrinterVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addCheck">确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑打印机" v-model="editPrinterVisible">
		  <el-form :model="editForm" label-width="140px">
		  <el-form-item label="打印机名称">
		      <el-input v-model="editForm.name" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="小票抬头">
		      <el-input v-model="editForm.title" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="设备ID">
		      <el-input v-model="editForm.deviceNo" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="设备密钥">
		      <el-input v-model="editForm.key" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="服务器地址">
		      <el-input v-model="editForm.apiUrl" auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="editPrinterVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editCheck">确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 绑定收款窗口弹窗 -->
		<el-dialog title="绑定收款窗口" v-model="editBindBranchVisible">
				
		  <el-form :model="editForm" label-width="140px">
		  <el-form-item label="打印机名称">
		      {{ editBindBranchForm.name }}
		    </el-form-item>
		    <el-form-item label="收款窗口">
		      <el-select v-model="branchId" placeholder="请选择">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
		    </el-form-item>
		   
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="editBindBranchVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editBind">确 定</el-button>
		  </div>
		</el-dialog>
		</div>
		<div v-else>
			<h1 class='no-power'>没有管理权限</h1>
		</div>
	</section>
</template>
<script>
	import { getAllBranch, getAllPrinter, createPrinter, updatePrinter, removePrinter } from '@/api/api'
	import moment from 'moment'
	export default {
		name: 'Printer',
		created() {
			this.getPrinterList();
			this.level = this.store.get('user').role.level
		},
		filters: {
			filterStep(val) {
				switch(val) {
					case 1: return '营业中'; break;
					case 2: return '打烊'; break;
					default: return '未知状态';
				}
			}
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
				options: [{label:'x',value:'x'}],
        		branchId: '',
				addPrinterVisible: false,
				addForm: {
					name: '',
					title: '',
					deviceNo: '',
					key: '',
					apiUrl: ''
				},
				editPrinterVisible: false,
				editForm: {
					feedId: '',
					name: '',
					title: '',
					deviceNo: '',
					key: '',
					apiUrl: ''
				},
				editBindBranchVisible: false,
				editBindBranchForm: {
					feedId: '',
					name: '',
					branchId: ''
				}
			}
		},
		methods: {
			getPrinterList() {
				this.listLoading = true;
				getAllPrinter({
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
			addPrinter() {
				this.addPrinterVisible = true;
			},
			addCheck() {

				createPrinter(this.addForm).then(res => {
					if(res.code === 0) {
						this.addPrinterVisible = false;
						// console.log(res.data);
						this.$message.success({
							message: '新增成功'
						})
						this.getPrinterList();
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			initAddForm() {
				this.addForm = {
					name: '',
					title: '',
					deviceNo: '',
					key: '',
					apiUrl: ''
				}
			},
			// 编辑操作模块
			editPrinter() {
				this.editPrinterVisible = true;
			},
			editCheck() {
				updatePrinter(this.editForm).then(res => {
					if(res.code === 0) {
						this.$message.success({
							message: '修改成功'
						});
						this.editPrinterVisible = false;
						this.getPrinterList();
					} else {
						this.$message.error({
							message: res.message
						});
					}
				})
				// this.editPrinterVisible = false;
				// console.log(this.editForm);
			},
			initEditPrinter(row) {
				let edit = {
					feedId: row.feedId,
					name: row.basic.name,
					title: row.basic.title,
					deviceNo: row.basic.deviceNo,
					key: row.basic.key,
					apiUrl: row.basic.apiUrl
				}
				this.editForm = JSON.parse(JSON.stringify(edit));
			},
			// 绑定收款窗口操作模块
			handleBindBranch(index, row) {
				getAllBranch({
					page: 1,
					size: 1000
				}).then (res => {
					console.log( 'res', res.data.list )
					this.options = res.data.list.map(e => ({
						label: e.basic.title,
						value: e.branchId
					}))
				})
				this.editBindBranchVisible = true;
				this.editBindBranchForm = {
					feedId: row.feedId,
					name: row.basic.name,
					branchId: row.basic.branchId
				}
			},
			editBind() {
				updatePrinter({
					feedId: this.editBindBranchForm.feedId,
					branchId: this.branchId
				}).then(res => {
					if(res.code === 0) {
						this.$message.success({
							message: '修改成功'
						});
						this.editBindBranchVisible = false;
						this.getPrinterList();
					} else {
						this.$message.error({
							message: res.message
						});
					}
				})
				// this.editPrinterVisible = false;
				// console.log(this.editForm);
			},
		// 表格操作
			// 格式化表格数据
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.getPrinterList();
			},
			// 编辑
			handleEdit(index, row) {
				this.editPrinterVisible = true;
				this.initEditPrinter(row);
				// console.log(index, row);
			},
			// 删除
			handleDelete(index, row) {
				this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
			        this.deletePrinter({
						feedId: row.feedId
					});
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
				// console.log(index, row);	
			},
			deletePrinter(para) {
				removePrinter(para).then(res => {
					if(res.code === 0) {
						this.$message.success({
							message: '删除成功'
						});
						this.getPrinterList();
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
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
 .no-power {
	font-size: 20px;
	margin-top: 60px;
	text-align: center;
  }
</style>