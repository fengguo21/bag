<template>
	<div>
		<section  v-if='level==1'>
			<el-tabs v-model="activeName" @tab-click="handleClick">
			  <el-tab-pane label="资金概览" name="p1">
					<overview></overview>
			  </el-tab-pane>
			  <el-tab-pane label="收入明细" name="p2">
			  		<income></income>
			  </el-tab-pane>
			  <el-tab-pane label="日收入明细" name="p3">
			  		<day-count></day-count>
			  </el-tab-pane>
			  <!--
			  <el-tab-pane label="我的日收入统计" name="p4">
			  		<day-report></day-report>
			  </el-tab-pane>
			  -->
			</el-tabs>
		</section>
		<div v-else>
			<h1 class='no-power'>没有管理权限</h1>
		</div>
	</div>
</template>
<script>
	import overview from '@/components/cashier/management/overview'
	import income from '@/components/cashier/management/income'
	import dayCount from '@/components/cashier/management/dayCount'
	import dayReport from '@/components/cashier/management/dayReport'
	export default {
		name: 'xksManagement',
		components: {
			overview,
			income,
			dayCount,
			dayReport
		},
		created() {
			this.level = this.store.get('user').role.level
		},
		data () {
			return {
				level: '',
				activeName: 'p1'
			}
		},
		methods: {
			handleClick(tab, event) {

			}
		}
	}
</script>
<style scoped>
.no-power {
	font-size: 20px;
	margin-top: 60px;
	text-align: center;
}	
</style>