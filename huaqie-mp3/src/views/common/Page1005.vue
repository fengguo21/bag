<template>
<section>
 <el-tabs v-model="activeName">
 	<el-tab-pane label="基本" name="pane1">
 		<app-basic-set></app-basic-set>
 	</el-tab-pane>
    <el-tab-pane label="微信小程序配置" name="pane2">
    	<wx-app-set></wx-app-set>
    </el-tab-pane>

    <el-tab-pane label="销售员提成说明配置" name="pane3">
    	<sales-about-set></sales-about-set>
    </el-tab-pane>
	
  </el-tabs>
	
	</section>
</template>

<script>
import appBasicSet from '@/components/system/appBasicSet'
import wxAppSet from '@/components/system/wxAppSet'
import salesAboutSet from '@/components/system/salesAboutSet'
import session from 'store'
	export default {
		components: {
			appBasicSet,
			wxAppSet,
			salesAboutSet
		},
		data() {
			return {
				activeName: 'pane1'
			}
		}
	}

</script>