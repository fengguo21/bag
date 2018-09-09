<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					每日TOP 10
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="batterys" highlight-current-row style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="people.basic.avatar" label="头像" width='120'>
				<template scope="scope">
					<img :src="scope.row.people.basic.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="people.basic.sex" label="性别" :formatter="formatSex" >
			</el-table-column>
			<el-table-column prop="people.basic.name" label="昵称">
			</el-table-column>
			<el-table-column prop="value" label="收入">
				<template scope='scope'>
					{{scope.row.value.toFixed(2)}}
				</template>
			</el-table-column>
		</el-table>

	</section>
</template>
<script>
	import { getAgentSortList } from '@/api/api'
	import moment from 'moment'
	export default {
		name: 'devUseSort',
		data() {
			return {
				batterys: []
			}	
		},
		created() {
			this.getSortList();
		},
		methods: {
			formatSex(row, column) {
				return row.people.basic.sex == 1 ? '男' : row.people.basic.sex == 2 ? '女' : '未知';
			},
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			getSortList() {
				getAgentSortList({
					size: 10 
				}).then(res => {
					if(res.code === 0) {
						console.log(res);
						this.batterys = res.data;
						// this.total = res.data.total;
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
		}
	}
</script>
<style></style>