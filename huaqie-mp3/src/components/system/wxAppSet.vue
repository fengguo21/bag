<template>
	<el-form ref="form" :model="form" label-width="165px" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="小程序ID">
			<el-input v-model="form.appId"></el-input>
		</el-form-item>
		<el-form-item label="小程序密钥">
			<el-input v-model="form.appSecret"></el-input>
		</el-form-item>
		<el-form-item label="微信商户ID">
			<el-input v-model="form.mchId"></el-input>
		</el-form-item>
		<el-form-item label="微信支付密钥">
			<el-input v-model="form.apiKey"></el-input>
		</el-form-item>
		<el-form-item label="certFile文件内容">
			<el-input type='textarea' v-model="form.cert" :autosize='{ minRows: 5, maxRows: 10 }'></el-input>
		</el-form-item>
		<el-form-item label="keyFile文件内容">
			<el-input type='textarea' v-model="form.key" :autosize='{ minRows: 5, maxRows: 10 }'></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click='saveSet'>保存</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
	import { wxAppPaySet } from '@/api/api'


	export default {
		name: 'wxPaySet',
		data() {
			return {
				form: {
					appId: '',
					appSecret: '',
					mchId: '',
					apiKey: '',
					cert: '',
					key: ''
				}
			}
		},
		mounted() {
			this.getApp();
		},
		methods: {
			// 保存当前设置
			/************todos need ajax************/
			saveSet() {
				// 数据返回值保持深复制
				console.log(this.form)
				wxAppPaySet({
					config: this.form
				}).then(res => {
					// console.log(res)
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '保存成功'
						});
						this.store.set('app', res.data)
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
				// console.log('save ok!');
			},
			getApp() {
				let weapp = this.store.get('app').extra.weapp;
				console.log(this.store.get('app').extra)
				if(weapp) {
					this.form = weapp
				}
			}
		}
	}
</script>
<style scoped></style>