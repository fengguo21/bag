<template>
<section>
 <el-tabs v-model="activeName" @tab-click="handleClick">
 <el-tab-pane label="基本信息" name="pane1">
    	<app-basic-set></app-basic-set>
	</el-tab-pane>
    <el-tab-pane label="微信公众号设置" name="pane2">
    	<wx-set></wx-set>
	</el-tab-pane>
	<!-- <el-tab-pane label="商品提成" name="pane3"><el-form ref="form" :model="form" label-width="150px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="一级提成">
			<el-input-number v-model="form.percent1" :min="0" :max="1" :step="0.01"></el-input-number>
		</el-form-item>
		<el-form-item label="二级提成">
			<el-input-number v-model="form.percent2" :min="0" :max="1" :step="0.01"></el-input-number>
		</el-form-item>
		<el-form-item label="有效状态">
		<el-switch
		  v-model="form.percentStep"
		  on-color="#13ce66"
		  off-color="#ff4949">
		</el-switch>
		</el-form-item>

		<el-form-item>
			<el-button type="primary">保存</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
	</el-form></el-tab-pane>
	<el-tab-pane label="用户提成" name="pane4"><el-form ref="form" :model="form" label-width="150px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="提成金额">
			<el-input-number v-model="form.bonus" :min="0" :max="10000"></el-input-number>
		</el-form-item>
		<el-form-item label="有效状态">
		<el-switch
		  v-model="form.percentStep"
		  on-color="#13ce66"
		  off-color="#ff4949">
		</el-switch>
		</el-form-item>
		<el-form-item>
			<el-button type="primary">保存</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
	</el-form></el-tab-pane> -->
    <!-- <el-tab-pane label="公众号授权" name="pane4">
    	<el-button type="primary" @click="handleVerify">立即授权</el-button>
    </el-tab-pane> -->
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