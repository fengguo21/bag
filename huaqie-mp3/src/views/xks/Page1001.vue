<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="收款窗口标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button v-show='level == 1' type="primary" v-on:click="addBranch">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="dataForm" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop='basic.title' label='收款窗口标题' width="200">
			</el-table-column>
			<el-table-column prop='basic.desc' label='收款窗口描述'>
			</el-table-column>
			<el-table-column label='收款窗口状态' width="140">
				<template scope='scope'>
					<div :class="[{'step-open': scope.row.step == 1},{'step-close': scope.row.step == 2}]">
			            {{ scope.row.step|filterStep }}
			        </div>
				</template>
			</el-table-column>
			<el-table-column :formatter='formatDate' label='创建时间' width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width='250'>
		      <template scope="scope">
		      	<el-button
		          size="small"
		          type='primary'
		          @click="handleCreateQR(scope.$index, scope.row)">生成二维码</el-button>
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
		<el-dialog title="新增收款窗口" v-model="addBranchVisible" @close='initAddForm'>
		  <el-form :model="addForm" label-width="140px">
		    <el-form-item label="收款窗口标题">
		      <el-input v-model="addForm.title" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="收款窗口描述">
		      <el-input type='textarea' :autosize='{ minRows: 3, maxRows: 6 }' v-model="addForm.desc" auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="addBranchVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addCheck">确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑收款窗口" v-model="editBranchVisible">
		  <el-form :model="editForm" label-width="140px">
		    <el-form-item label="收款窗口标题">
		      <el-input v-model="editForm.title" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="收款窗口描述">
		      <el-input type='textarea' :autosize='{ minRows: 3, maxRows: 6 }' v-model="editForm.desc" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="收款窗口状态">
		      <el-select v-model="editForm.step" placeholder="请选择状态">
		        <el-option label="营业中" :value="1"></el-option>
		        <el-option label="打烊" :value="2"></el-option>
		      </el-select>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="editBranchVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editCheck">确 定</el-button>
		  </div>
		</el-dialog>
		<el-dialog title='窗口二维码' size='tiny' v-model="QRCodeVisible">
			<div class='canvas-wrap'>
				<canvas id="canvas"></canvas>
				<p>小贴士：右键下载窗口二维码</p>
			</div>
		</el-dialog>
	</section>
</template>
<script>
	import { getAllBranch, createBranch, updateBranch, removeBranch } from '@/api/api'
	import moment from 'moment'
	import session from 'store'
	let QRCode = require('qrcode');
	export default {
		name: 'Branch',
		created() {
			this.getBranchList();
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
				addBranchVisible: false,
				addForm: {
					title: '',
					desc: ''
				},
				editBranchVisible: false,
				editForm: {
					branchId: '',
					title: '',
					desc: '',
					step: ''
				},
				QRCodeVisible: false
			}
		},
		methods: {
			handleCreateQR(index, row) {
				this.QRCodeVisible = true;
				const url = session.get('app').extra.url
				this.createQR(url+'/index.html?branchId='+row.branchId);
			},
			createQR(msg) {
				// console.log(msg);
				this.$nextTick(() => {
					let canvas = document.getElementById('canvas');
					// console.log(document.getElementById('canvas'));
					if(canvas) {
						QRCode.toCanvas(canvas, msg, (error) => {
							if(error) {
								this.$message.error({
									message: error
								})
							}
						})
					}			
				})		
			},
			getBranchList() {
				this.listLoading = true;
				getAllBranch({
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
			addBranch() {
				this.addBranchVisible = true;
			},
			addCheck() {
				// console.log(this.addForm);
				createBranch(this.addForm).then(res => {
					if(res.code === 0) {
						this.addBranchVisible = false;
						// console.log(res.data);
						this.$message.success({
							message: '新增成功'
						})
						this.getBranchList();
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
					desc: ''
				}
			},
			// 编辑操作模块
			editBranch() {
				this.editBranchVisible = true;
			},
			editCheck() {
				updateBranch(this.editForm).then(res => {
					if(res.code === 0) {
						this.$message.success({
							message: '修改成功'
						});
						this.editBranchVisible = false;
						this.getBranchList();
					} else {
						this.$message.error({
							message: res.message
						});
					}
				})
				// this.editBranchVisible = false;
				// console.log(this.editForm);
			},
			initEditBranch(row) {
				let edit = {
					branchId: row.branchId,
					title: row.basic.title,
					desc: row.basic.desc,
					step: row.step
				}
				this.editForm = JSON.parse(JSON.stringify(edit));
			},
		// 表格操作
			// 格式化表格数据
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.getBranchList();
			},
			// 编辑
			handleEdit(index, row) {
				this.editBranchVisible = true;
				this.initEditBranch(row);
				// console.log(index, row);
			},
			// 删除
			handleDelete(index, row) {
				this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
			        this.deleteBranch({
						branchId: row.branchId
					});
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
				// console.log(index, row);	
			},
			deleteBranch(para) {
				removeBranch(para).then(res => {
					if(res.code === 0) {
						this.$message.success({
							message: '删除成功'
						});
						this.getBranchList();
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
</style>