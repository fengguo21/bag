<template>
<section>
 <el-tabs v-model="activeName">
 	<el-tab-pane label="基本" name="pane1">
 		<app-basic-set></app-basic-set>
 	</el-tab-pane>
    <el-tab-pane label="微信小程序配置" name="pane2">
    	<wx-app-set></wx-app-set>
    </el-tab-pane>

   
	
  </el-tabs>
	
	</section>
</template>

<script>
import appBasicSet from '@/components/system/appBasicSet'
import wxAppSet from '@/components/system/wxAppSet'

export default {
	components: {
		appBasicSet,
		wxAppSet
	},
	data() {
		return {
			activeName: 'pane1'
		}
	}
}

</script>