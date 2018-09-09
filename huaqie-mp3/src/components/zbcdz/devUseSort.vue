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
			<el-table-column prop="product.basic.deviceCode" label="设备号">
			</el-table-column>
			<el-table-column prop="product.basic.title" label="设备地名">
			</el-table-column>
			<el-table-column prop="value" label="设备使用量" width="150" >
			</el-table-column>
		</el-table>

	</section>
</template>
<script>
	import { getDevSortList } from '@/api/api'
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
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			getSortList() {
				getDevSortList({
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