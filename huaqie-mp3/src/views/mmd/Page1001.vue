<template>
	<section>
		<el-tabs v-model="activeName">
			<el-tab-pane label="用户管理" name="first">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="filters.name" placeholder="昵称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="getUsers">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>

				<!--列表-->
				<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
					
					<el-table-column type="index" width="60">
					</el-table-column>
					<el-table-column label="头像" width="120">
						<template scope="scope">
							<img :src="scope.row.basic.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
						</template>
					</el-table-column>
					<el-table-column prop="basic.name" label="昵称" width="200" sortable>
					</el-table-column>
					<el-table-column prop="basic.sex" label="性别" width="100" :formatter="formatSex" sortable>
					</el-table-column>
					<el-table-column prop="score" label="积分" width="100" sortable>
					</el-table-column>
					<el-table-column prop="extra.rank" :formatter='formatLevel' label="会员级别" width="150" sortable>
					</el-table-column>
					<el-table-column prop="created" :formatter="formatDate" label="注册时间" min-width="180" sortable>
					</el-table-column>
					<el-table-column label="操作" width="150">
					
						<template scope="scope">
							<el-button size="small" type='primary' @click="handleEdit(scope.$index, scope.row)">修改会员等级</el-button>
							<!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
						</template>
						
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					
					<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
					</el-pagination>
				</el-col>
			</el-tab-pane>
			<el-tab-pane label="会员等级管理" name="second">
				<vip-control @regetuser='regetUser'></vip-control>
			</el-tab-pane>	
		</el-tabs>
		

		<!--编辑界面-->
		<el-dialog title="编辑" size='tiny' v-model="editFormVisible" :close-on-click-modal="false">
		    <el-select v-model="rank" placeholder="请选择会员级别">
		      <el-option :label="item.title" :value="item.rank" v-for='(item, index) in Vips' :key='index'></el-option>
		    </el-select>
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
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getPeopleListPage, changeRank, getRank } from '../../api/api';
	import moment from 'moment'
	import vipControl from '@/components/mmd/vipControl'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				activeName: 'first',
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					rank: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {},
				rank: 1,

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
				},
				Vips: [],
			}
		},
		// computed: {
		// 	vipList() {
		// 		let arr = [];
		// 		this.Vips.forEach(item => {
		// 			arr.push({
		// 				label: item.title,
		// 				value: item.rank
		// 			})
		// 		})
		// 		return arr;
		// 	}
		// },
		components: {
			vipControl
		},
		methods: {
			regetUser() {
				// console.log('regetUser');
				this.getRankList();
				this.getUsers();
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.basic.sex == 1 ? '男' : row.basic.sex == 2 ? '女' : '未知';
			},
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatLevel: function(row){
				let el = ''
				this.Vips.forEach(item => {
					if(item.rank == row.extra.rank) {
						el = item.title
					}
				})
				return el;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			getRankList() {
				getRank({
					page: this.page,
					size: 10
				}).then(res => {
					if(res.code === 0) {
						// console.log(res);
						let vipList = []
						this.Vips = res.data.list;
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			//获取用户列表
			getUsers() {
				let para = {
					name: this.filters.name,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getPeopleListPage(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					console.log(res.data.list);
					this.total = res.data.total;
					this.users = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				// console.log(row);
				this.editForm = row;
				this.rank = row.extra.rank?row.extra.rank:1
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
				// console.log(this.editForm);

				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.editLoading = true;
					//NProgress.start();
					// console.log('para', para);
					changeRank({
						peopleId: this.editForm.peopleId,
						rank: this.rank
					}).then(res => {
						if(res.code === 0) {
							this.editLoading = false;
							//NProgress.done();
							this.$message({
								message: '修改成功',
								type: 'success'
							});
							this.rank = 1;
							this.editFormVisible = false;
							this.getUsers();
						} else {
							this.$message({
								message: res.message,
								type: 'error'
							});
						}
					})
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
								this.getUsers();
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
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
			if(this.store.get('rank')) {
				this.Vips = this.store.get('rank');
			} else {
				this.getRankList();
			}
			// console.log(this.Vips);
		}
	}

</script>

<style scoped>

</style>