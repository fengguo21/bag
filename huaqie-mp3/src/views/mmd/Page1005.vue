<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.phone" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="saleses" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="basic.name" label="姓名" width="120" >
			</el-table-column>
			<el-table-column prop="basic.phone" label="手机号" width="200" >
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="130" >
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template scope="scope">
					<!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>-->
					<el-button type="primary" size="small" @click="handleViewBalance(scope.$index, scope.row)">查看个人业绩</el-button>
					<el-button  size="small" @click="handleViewClient(scope.$index, scope.row)">查看团队业绩</el-button>
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
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--查看个人业绩界面-->
		<el-dialog
		  title="个人业绩"
		  :visible.sync="dialogVisible"
		  size="tiny">
		  <p>姓名：{{viewBalance.name}}</p>
		  <p>手机号：{{viewBalance.phone}}</p>
		  <p>个人业绩：{{viewBalance.balance}}</p>
		  <span slot="footer" class="dialog-footer">
		    
		    <el-button  @click="dialogVisible = false">关 闭</el-button>
		  </span>
		</el-dialog>

		<!--查看团队业绩界面-->
		<el-dialog
		  title="团队业绩"
		  :visible.sync="dialogClientVisible">
		  <p>销售员姓名：{{salesPeopleName}} &nbsp;&nbsp;&nbsp;&nbsp;销售员手机号：{{salesPeoplePhone}}</p>
		  <el-table
		    :data="clients"
		    stripe
		    style="width: 100%">
		    <el-table-column label="头像" width="120">
						<template scope="scope">
							<img :src="scope.row.basic.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
						</template>
					</el-table-column>
		    <el-table-column
		      prop="basic.name"
		      label="昵称"
		      width="180">
		    </el-table-column>
		    <el-table-column
		      prop="basic.sex"
		      label="性别"
		      :formatter="formatSex">
		    </el-table-column>
		    <el-table-column
		      prop="score"
		      label="积分">
		    </el-table-column>
		    <el-table-column
		      prop="extra.rank"
		      label="会员级别"
		      :formatter='formatLevel'>
		    </el-table-column>
		    <el-table-column
		      prop="created"
		      label="注册时间"
		      :formatter="formatDate"
		      min-width="120">
		    </el-table-column>
		  </el-table>
		  <el-col :span="24" class="toolbar">
		
			<el-pagination layout="total, prev, pager, next" @current-change="handleClientCurrentChange" :page-size="10" :total="clientTotal" style="float:right;">
			</el-pagination>
		</el-col>
		  <span slot="footer" class="dialog-footer">
		    
		    <el-button  @click="dialogClientVisible = false">关 闭</el-button>
		  </span>
		</el-dialog>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getSalesListPage, removeSales, getPeopleBalance, getPeopleListPage, getRank } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				filters: {
					name: '',
					phone: ''
				},
				dialogVisible: false,
				dialogClientVisible: false,
				saleses: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				viewBalance: {
					name: '',
					phone: '',
					balance: 0
				},

				clients: [],
				clientPage: 1,
				clientTotal: 0,
				Vips: [],
				salesPeopleId: '',
				salesPeopleName: '',
				salesPeoplePhone: '',

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return (row.basic.sex==1)?'男':'女'
			},
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm')
			},
			formatLevel: function(row){
				console.log('this.vips', this.Vips, row.extra.rank)
				let el = ''
				this.Vips.forEach(item => {
					if(item.rank == row.extra.rank) {
						el = item.title
					}
				})
				return el;
			},
			getRankList() {
				getRank({
					page: 1,
					size: 10
				}).then(res => {
					if(res.code === 0) {
						// console.log(res);
						this.Vips = res.data.list;
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getSaleses();
			},
			handleClientCurrentChange(val) {
				this.clientPage = val;
				getPeopleListPage({
					salesPeopleId: this.salesPeopleId,
					page: this.clientPage,
					size: 10
				}).then(res => {
					this.clients = res.data.list
					this.clientTotal = res.data.total
				})
			},
			//获取用户列表
			getSaleses() {
				let para = {
					name: this.filters.name,
					phone: this.filters.phone,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getSalesListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					console.log('res', res)
					this.total = res.data.total;
					this.saleses = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			// 查看个人业绩
			handleViewBalance(index, row) {
				this.dialogVisible = true
				this.viewBalance = {
					name: row.basic.name,
					phone: row.basic.phone,
					balance: 0
				}
				getPeopleBalance({
					peopleId: row.peopleId
				}).then(res => {
					console.log('BALANCE:', res.data)
					this.viewBalance.balance = '¥'+
						(res.data.balance + ((res.data.frozen)?res.data.frozen:0) + ((res.data.withdraw)?res.data.withdraw:0)).toFixed(2)
				})
			},
			// 查看团队业绩
			handleViewClient(index, row) {
				this.dialogClientVisible = true
				this.clientPage = 1
				this.salesPeopleId = row.peopleId
				this.salesPeopleName = row.basic.name
				this.salesPeoplePhone = row.basic.phone
				getPeopleListPage({
					salesPeopleId: row.peopleId,
					page: this.clientPage,
					size: 10
				}).then(res => {
					this.clients = res.data.list
					this.clientTotal = res.data.total
				})
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { salesId: row.salesId };
					removeSales(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getSaleses();
					});
				}).catch(() => {

				});
			},
			 handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
     },
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
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
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getSaleses();
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
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getSaleses();
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
						this.getSaleses();
					});
				}).catch(() => {

				});
			},
			query() {
				this.page = 1
				this.getSaleses()
			}
		},
		mounted() {
			this.getSaleses();
			this.getRankList()
		}
	}

</script>

<style scoped>

</style>