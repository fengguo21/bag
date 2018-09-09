<template>
	<el-form ref="form" :model="setForm" label-width="165px" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="微信服务号AppID">
			<el-input v-model="setForm.appId"></el-input>
		</el-form-item>
		<el-form-item label="微信服务号AppSecret">
			<el-input v-model="setForm.appSecret"></el-input>
		</el-form-item>
		<el-form-item label="微信商户ID">
			<el-input v-model="setForm.mchId"></el-input>
		</el-form-item>
		<el-form-item label="微信支付密钥">
			<el-input v-model="setForm.apiKey"></el-input>
		</el-form-item>
		<el-form-item label="certFile文件内容">
			<el-input type='textarea' v-model="setForm.cert" :autosize='{ minRows: 5, maxRows: 10 }'></el-input>
		</el-form-item>
		<el-form-item label="keyFile文件内容">
			<el-input type='textarea' v-model="setForm.key" :autosize='{ minRows: 5, maxRows: 10 }'></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click='saveSet'>保存</el-button>
			<el-button @click='cancel'>取消</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
	import { wxPaySet } from '@/api/api'
	export default {
		name: 'wxPaySet',
		data() {
			return {
				setForm: {
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
				wxPaySet({
					config: this.setForm
				}).then(res => {
					// console.log(res)
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '保存成功'
						});
						this.store.set('app', res.data);
						setTimeout(() => {
							this.getApp();
						}, 0)
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
				// console.log('save ok!');
			},
			cancel() {
				// 数据重新赋予
				this.$confirm('此操作将恢复原本数据, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.$message({
		            type: 'success',
		            message: '恢复成功!'
		          });
		          this.getApp();
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已放弃恢复'
		          });          
		        });
			},
			getApp() {
				let wewap = this.store.get('app').extra.wewap;
				if(wewap) {
					this.setForm = JSON.parse(JSON.stringify(wewap))
				}
			}
		}
	}
</script>
<style scoped></style>