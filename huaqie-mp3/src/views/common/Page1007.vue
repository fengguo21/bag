<template>
	<section>
	
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="运费标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button  @click="handleAdd">新增运费</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="fees" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.title" label="标题" width="200" >
			</el-table-column>
			<el-table-column prop="basic.typehood" label="运费规则" :formatter="formatTypehood" width="200" >
			</el-table-column>
			<el-table-column  label="详情" min-width="300">
				<template scope="scope">
					<div v-if="scope.row.basic.typehood==1">
						<p>首重：{{scope.row.basic.baseWeight}} kg 首重费用：¥{{scope.row.basic.baseFee}}</p>
						<p>阶梯重量：{{scope.row.basic.stepWeight}} kg 阶梯费用：¥{{scope.row.basic.stepFee}}</p>
					</div>
					<div v-if="scope.row.basic.typehood==2">
						<p>金额：¥{{scope.row.basic.amount}} 费用：¥{{scope.row.basic.fee}}</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column  label="状态" min-width="100">
				<template scope="scope">
					<el-tag type="success" v-if="scope.row.basic.step==2">使用中</el-tag>
					<el-tag type="default" v-if="scope.row.basic.step!=2">未使用</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" width="180" >
			</el-table-column>
			<el-table-column label="操作" width="220">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button size="small" type="warning" v-if="scope.row.basic.step != 2" @click="handleValid(scope.$index, scope.row)">使用</el-button>
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
		<el-dialog title="新增运费规则" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="规则类型">
					<el-radio class="radio" v-model="addForm.typehood" label="2">金额</el-radio>
					<el-radio class="radio" v-model="addForm.typehood" label="1">重量</el-radio>
				</el-form-item>

				<div v-if="addForm.typehood=='1'">

				<el-form-item label="首重">
					<el-input-number v-model="addForm.baseWeight" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="首重费用">
					<el-input-number v-model="addForm.baseFee" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="阶梯重量">
					<el-input-number v-model="addForm.stepWeight" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="阶梯费用">
					<el-input-number v-model="addForm.stepFee" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				</div>
				<div v-if="addForm.typehood=='2'">

				<el-form-item label="金额">
					<el-input-number v-model="addForm.amount" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="费用">
					<el-input-number v-model="addForm.fee" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				</div>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="修改运费规则" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="规则类型">
					{{(editForm.typehood=='1')?'重量':'金额'}}
				</el-form-item>

				<div v-if="editForm.typehood=='1'">

				<el-form-item label="首重">
					<el-input-number v-model="editForm.baseWeight" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="首重费用">
					<el-input-number v-model="editForm.baseFee" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="阶梯重量">
					<el-input-number v-model="editForm.stepWeight" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="阶梯费用">
					<el-input-number v-model="editForm.stepFee" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				</div>
				<div v-if="editForm.typehood=='2'">

				<el-form-item label="金额">
					<el-input-number v-model="editForm.amount" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="费用">
					<el-input-number v-model="editForm.fee" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				</div>
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
	import { getProductFeeListPage, addProductFee, updateProductFee, removeProductFee } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					title: ''
				},
				fees: [],
				total: 0,
				page: 1,
				listLoading: false,

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入商品名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					feeId: '',
					title: '',
					typehood: 0,
					baseWeight: 0,
					baseFee: 0,
					stepWeight: 0,
					stepFee: 0,
					amount: 0,
					fee: 0
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					typehood: '2',
					baseWeight: 0,
					baseFee: 0,
					stepWeight: 0,
					stepFee: 0,
					amount: 0,
					fee: 0
				}

			}
		},
		methods: {
			//性别显示转换
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm')
			},
			formatTypehood: function (row, column) {
				const typehoods = {
					1: '重量',
					2: '金额'
				}
				return (row.basic.typehood in typehoods)?typehoods[row.basic.typehood]:'未知'
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getProductFees();
			},
			//获取用户列表
			getProductFees() {
				let para = {
					title: this.filters.title,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getProductFeeListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					
					this.total = res.data.total;
					this.fees = res.data.list;
					this.listLoading = false;
					console.log(this.fees)
					//NProgress.done();
				});
			},

			//使用
			handleValid: function (index, row) {
				this.$confirm('确认使用运费：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feeId: row.feeId, step: 2 };

					updateProductFee(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '使用成功',
							type: 'success'
						});
						this.getProductFees();
					});
				}).catch(() => {

				});
			},
			
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除运费：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feeId: row.feeId };

					removeProductFee(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getProductFees();
					});
				}).catch(() => {

				});
			},
			
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row.basic, {
					feeId: row.feeId
				});
				this.editForm.typehood = this.editForm.typehood.toString()
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					title: '',
					typehood: '2',
					baseWeight: 0,
					baseFee: 0,
					stepWeight: 0,
					stepFee: 0,
					amount: 0,
					fee: 0
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
							
							updateProductFee(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getProductFees();
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
							addProductFee(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getProductFees();
							});
						});
					}
				});
			},
			query() {
				this.page = 1
				this.getProductFees()
			}
		},
		mounted() {
			this.getProductFees();
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