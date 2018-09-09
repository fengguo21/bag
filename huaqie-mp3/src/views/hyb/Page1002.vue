<template>
<section>
 <el-tabs v-model="activeName">
    <el-tab-pane label="基本" name="pane1">
    	<app-basic-set></app-basic-set>
    </el-tab-pane>
	<el-tab-pane label="微信小程序配置" name="pane2">
		<wx-app-set></wx-app-set>
	</el-tab-pane>
	<el-tab-pane label="微信设置" name="pane3">
    	<wxpay-set></wxpay-set>	    	
    </el-tab-pane>
    <el-tab-pane label="支付宝设置" name="pane4">
    	<alipay-set></alipay-set>	
    </el-tab-pane>
	
  </el-tabs>
	
	</section>
</template>

<script>
import appBasicSet from '@/components/system/appBasicSet'
import wxAppSet from '@/components/system/wxAppSet'
import wxpaySet from '@/components/system/wxSet'
import alipaySet from '@/components/system/alipaySet'

export default {
		components: {
			appBasicSet,
			wxAppSet,
			wxpaySet,
			alipaySet
		},
		data() {
			return {
				activeName: 'pane1'
			}
		}
	}

</script>