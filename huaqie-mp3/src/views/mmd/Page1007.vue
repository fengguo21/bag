<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="优惠券名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCoupons">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增优惠券</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="coupons" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.title" label="名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="basic.count" label="发放总量" width="120" sortable>
			</el-table-column>
			<el-table-column prop="basic.price" label="面值" width="120" sortable>
			</el-table-column>
			<el-table-column prop="basic.minAmount" label="使用门槛" width="120" sortable>
			</el-table-column>
			<el-table-column prop="basic.limit" label="每人限领" width="120" sortable>
			</el-table-column>
			<el-table-column prop="basic.startDate" label="生效日期" width="120" sortable>
			</el-table-column>
			<el-table-column prop="basic.endDate" label="过期日期" width="120" sortable>
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button size="small" type='primary' @click="handleShare(scope.$index, scope.row)">推广</el-button>
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

		<!--编辑界面-->
		<el-dialog title="修改优惠券" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
				<el-form-item label="优惠券名称" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="发放总量（张）">
					<el-input-number v-model="editForm.count" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="面值（元）">
					<el-input-number v-model="editForm.price" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="使用门槛（元）">
					<el-input-number v-model="editForm.minAmount" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="每人限领（次数）">
					<el-input-number v-model="editForm.limit" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生效日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startDate"></el-date-picker>
				</el-form-item>
				<el-form-item label="过期日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endDate"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增优惠券" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
				<el-form-item label="优惠券名称" prop="title">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="发放总量（张）">
					<el-input-number v-model="addForm.count" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="面值（元）">
					<el-input-number v-model="addForm.price" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="使用门槛（元）">
					<el-input-number v-model="addForm.minAmount" :min="0" :max="10000"></el-input-number>
				</el-form-item>
				<el-form-item label="每人限领（次数）">
					<el-input-number v-model="addForm.limit" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生效日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.startDate"></el-date-picker>
				</el-form-item>
				<el-form-item label="过期日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.endDate"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog size='tiny' title="推广优惠券" v-model="qrCoupon" :close-on-click-modal="false" style='text-align: center'>
			<img :src="getCoupon">
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getCouponListPage, addCoupon, removeCoupon, updateCoupon } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				qrCoupon: false,
				getCoupon: '',
				coupons: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入优惠券名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					title: '',
					count: 0,
					price: 0,
					minAmount: 0,
					limit: 0,
					startDate: moment(),
					endDate: moment()
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入优惠券名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					title: '',
					count: 0,
					price: 0,
					minAmount: 0,
					limit: 0,
					startDate: moment(),
					endDate: moment()
				}

			}
		},
		methods: {
			//性别显示转换
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm')
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCoupons();
			},
			//获取用户列表
			getCoupons() {
				let para = {
					title: this.filters.name,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getCouponListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total = res.data.total;
					this.coupons = res.data.list;
					this.listLoading = false;
					console.log(res.data.list)
					//NProgress.done();
				});
			},
			handleShare(index, row) {
				this.qrCoupon = true;
				// https://m.huaqie.com/mmd
				this.getCoupon = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://m.huaqie.com%2Fmmd%2F%23%2Fself%2Fcoupon%3FcouponId%3D'+row.couponId
				console.log(row.couponId);
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除优惠券：' +row.basic.title+ ' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { couponId: row.couponId };
					removeCoupon(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCoupons();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				console.log(row);
				this.editForm = Object.assign({}, row.basic);
				this.editForm.couponId = row.couponId;
				// console.log(this.editForm);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					title: '',
					count: 0,
					price: 0,
					minAmount: 0,
					limit: 0,
					startDate: moment(),
					endDate: moment()
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
							// console.log(para);
							updateCoupon(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getCoupons();
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
							para.startDate = moment(para.startDate).format('YYYY-MM-DD')
							para.endDate = moment(para.endDate).format('YYYY-MM-DD')
							
							addCoupon(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getCoupons();
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
						this.getCoupons();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getCoupons();
		}
	}

</script>

<style scoped>

</style>