<template>
	<div>
		<section  v-if='level==1'>
		  <el-tabs v-model="activeName" @tab-click="handleClick">
		  <el-tab-pane label="基本信息" name="pane1">
		    	<app-basic-set></app-basic-set>	    	
		    </el-tab-pane>
		    <el-tab-pane label="微信设置" name="pane2">
		    	<wxpay-set></wxpay-set>	    	
		    </el-tab-pane>
		    <el-tab-pane label="支付宝设置" name="pane3">
		    	<alipay-set></alipay-set>	
		    </el-tab-pane>
		  </el-tabs>	
		</section>
		<div v-else>
			<h1 class='no-power'>没有管理权限</h1>
		</div>
	</div>
</template>

<script>
	import appBasicSet from '@/components/system/appBasicSet'
	import wxpaySet from '@/components/system/wxSet'
	import alipaySet from '@/components/system/alipaySet'
	export default {
		data() {
			return {
				activeName: 'pane1',
				level: ''
			}
		},
		created() {
			this.level = this.store.get('user').role.level
			// console.log()
			// console.log(this.store.get('user').role)
		},
		computed: {
			// activeName() {
			// 	return this.level != 1? 'third':'first'
			// }
		},
		components: {
			appBasicSet,
			wxpaySet,
			alipaySet
		},
		methods: {
			// tab切换时触发事件
			handleClick(tab, event) {
				// console.log(tab, event)
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