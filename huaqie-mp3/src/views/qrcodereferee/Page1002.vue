<template>
<section>
 <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本" name="pane1">
		<el-form ref="form" :model="form" label-width="150px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
    <el-form-item label="商城ID">
			{{app.appId}}
			
		</el-form-item>
	</el-form>
	</el-tab-pane>
    <el-tab-pane label="公众号授权" name="pane2">
    	<div  style="margin:20px;width:100%;min-width:700px;">
    	<div v-if="authorize.nick_name">
    	<p>公众号头像：<img :src="authorize.head_img" style="vertical-align:middle;width:80px;height:80px"></p>
   			<p>公众号名称：{{authorize.nick_name}}</p>
   			<p>公众号appId：{{authorize.appId}}</p>
   			<p>公众号类型：{{formatServiceType(authorize.service_type_info.id)}}</p>
   			<p>公众号认证类型：{{formatVerifyType(authorize.verify_type_info.id)}}</p>
   			<p>公众号主体信息：{{authorize.principal_name}}</p>
   			<p>公众号介绍：{{authorize.signature}}</p>
   			<p>公众号原始ID：{{authorize.user_name}}</p>
   			<p>公众号微信号：{{authorize.alias}}</p>
   			<p>公众号二维码：<a :href="authorize.qrcode_url" target="_blank">{{ authorize.qrcode_url }}</a></p>
			
	
    	<el-button type="primary" @click="handleVerify">修改授权</el-button>
    	</div>
    	<el-button type="primary" v-else @click="handleVerify">立即授权</el-button>
    	</div>
    </el-tab-pane>
  </el-tabs>
	
	</section>
</template>

<script>
	import session from 'store'
	import wxSet from '@/components/system/wxSet'
	import { getAuthorize } from '../../api/api';

	export default {
		components: {
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
				},
				authorize: {}
			}
		},
		computed: {
			app() {
				return session.get('app')
			}
		},
		methods: {
			formatServiceType( t ) {
				const services = {
					0: '订阅号',
					1: '历史老帐号升级后的订阅号',
					2: '服务号'
				}
				return (t in services)?services[t]:'未知'
			},
			formatVerifyType ( t ) {
				const verifies = {
					'-1': '未认证',
					0: '微信认证',
					1: '新浪微博认证',
					2: '腾讯微博认证',
					3: '已资质认证通过但还未通过名称认证',
					4: '已资质认证通过、还未通过名称认证，但通过了新浪微博认证',
					5: '已资质认证通过、还未通过名称认证，但通过了腾讯微博认证'
				}
				return (t in verifies)?verifies[t]:'未知'
			},
			onSubmit() {
				console.log('submit!');
			},
			handleClick() {

			},
			handleVerify() {
				window.open( 'http://weixin.huaqie.com/?huaqieAppId='+session.get('app').appId, '_blank')
			}
		},
		created() {
			getAuthorize({}).then(res => {
				console.log(res)
				if(res.code == 0){
					this.authorize = res.data.basic.info.authorizer_info
					this.authorize.head_img = this.authorize.head_img.replace('http://', 'https://')
					this.authorize.appId = res.data.appId
				}
			})
		}
	}

</script>