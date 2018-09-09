<template>
	<div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="会员名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
					<el-button type="primary" v-on:click="addVip">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="Vips" highlight-current-row v-loading="listLoading" style="width: 100%;">			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="rank" label="会员级别" sortable>
			</el-table-column>
			<el-table-column prop="title" label="会员名称" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
				
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" :page-size="10" :total="total" style="float:right;" @current-change="handleCurrentChange">
			</el-pagination>
		</el-col>


		<!--新增界面-->
		<el-dialog title="新增" v-model="addVipVisible" :close-on-click-modal="false" @close='initAdd'>
			<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="会员等级" prop="rank">
					<el-input v-model="addForm.rank" auto-complete="off" placeholder='请输入一个大于0的整数'></el-input>
				</el-form-item>
				<el-form-item label="会员名称" prop="title">
					<el-input v-model="addForm.title" auto-complete="off" placeholder='请输入对应的会员名称'></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addVipVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editVipVisible" :close-on-click-modal="false" @close='initEdit'>
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="会员名称" prop="title">
					<el-input v-model="editForm.title" auto-complete="off" placeholder='请输入对应的会员名称'></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editVipVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script >
import { createRank, updateRank, removeRank, getRank } from '@/api/api'
export default {
	name: 'vipControl',
	data() {
		return {
			filters: {
				name:''
			},
			largeRank: '',
			page:1,
			total:0,
			listLoading:true,
			Vips: [],
			addVipVisible: false,
			addForm: {
				rank:'',
				title:''
			},
			editVipVisible: false,
			editForm: {
				rankId: '',
				title: ''
			}
		}
	},
	created() {
		this.getRankList()	
	},
	methods: {
		getRankList() {
			getRank({
				title: this.filters.title,
				page: this.page,
				size: 10
			}).then(res => {
				if(res.code === 0) {
					this.listLoading = false;
					// console.log(res);
					this.Vips = res.data.list;
					this.store.set('rank', res.data.list);
					this.total = res.data.total;
					if(res.data.total > 0) {
						res.data.list.forEach((item, index) => {
							if(index === res.data.list.length-1) {
								this.largeRank = item.rank
							}
						})
					} else {
						this.largeRank = 0;
					}
				} else {
					this.$message.error({
						message: res.message
					})
				}
			})
		},
		removeRankById(row) {
			removeRank({
				rankId: row.rankId
			}).then(res => {
				if(res.code === 0) {
					this.$message.success({
						message: '删除成功'
					})
					this.getRankList();
					// console.log(res);
				} else {
					this.$message.error({
						message: res.message
					})
				}
			})
		},
		addVip() {
			this.addVipVisible = true;
		},
		addSubmit() {
			if(this.addForm.rank != this.largeRank+1) {
				this.$message.error({
					message: '请严格按照会员等级顺序进行设置'
				})
				return;
			}
			createRank(this.addForm).then(res => {
				if(res.code === 0) {
					this.$message.success({
						message: '新增会员等级成功'
					})
					this.getRankList();
					this.addVipVisible = false;
					this.$emit('regetuser')
					// console.log(res);
				} else {
					this.$message.error({
						message: res.message
					})
				}
			})
		},
		initAdd() {
			this.$refs.addForm.resetFields();
		},
		initEdit() {
			this.$refs.editForm.resetFields();
		},
		handleEdit(index, row) {
			this.editVipVisible = true;
			this.editForm = {
				rankId: row.rankId,
				title: row.title
			}
		},
		editSubmit() {
			updateRank(this.editForm).then(res => {
				if(res.code === 0) {
					this.$message.success({
						message: '修改成功'
					})
					this.getRankList();
					this.editVipVisible = false;
					this.$emit('regetuser')
				} else {
					this.$message.error({
						message: res.message
					})
				}
			})
		},
		handleDel(index, row) {
			console.log(row);
			this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	if(row.rank != this.largeRank) {
					this.$message.error({
						message: '请从最高级别进行删除'
					})
					return;
				}
	          	this.removeRankById(row);
	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消删除'
	          });          
	          this.$emit('regetuser')
	        });
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getRankList();
		},
		query() {
			this.page = 1
			this.getRankList()
		}
	}
}
</script>
<style scoped></style>