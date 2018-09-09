<template>
<section>
 <el-tabs v-model="activeName" @tab-click="handleClick">
 <el-tab-pane label="基本信息" name="pane1">
    	<app-basic-set></app-basic-set>
	</el-tab-pane>
    <el-tab-pane label="微信公众号设置" name="pane2">
    	<wx-set></wx-set>
	</el-tab-pane>
	
  </el-tabs>
	
	</section>
</template>

<script>
	import appBasicSet from '@/components/system/appBasicSet'
	import wxSet from '@/components/system/wxSet'
	export default {
		components: {
			appBasicSet,
			wxSet
		},
		data() {
			return {
				activeName: 'pane1',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					percent1: 0,
					percent2: 0,
					percentStep: false,
					bonus: 0
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleClick() {

			},
			// handleVerify() {
			// 	window.location.href = 'http://weixin.huaqie.com/'
			// }
		}
	}

</script>