<template>
	<el-form ref="setForm" :model="setForm" label-width="165px" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="支付宝服务号AppID">
			<el-input v-model="setForm.app_id"></el-input>
		</el-form-item>
		<el-form-item label="应用RSA私钥">
			<el-input type='textarea' :autosize='{ minRows: 5, maxRows: 10 }' v-model="setForm.merchantPrivateKey"></el-input>
		</el-form-item>
		<el-form-item label="支付宝公钥">
			<el-input type='textarea' :autosize='{ minRows: 5, maxRows: 10 }' v-model="setForm.alipayPublicKey"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click='saveSet'>保存</el-button>
			<el-button @click='cancel'>取消</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
	import { aliPaySet } from '@/api/api'
	export default {
		name: 'alipaySet',
		data() {
			return {
				setForm: {
					app_id: '',
					merchantPrivateKey: '',
					alipayPublicKey: '',
				}
			}
		},
		mounted() {
			this.getApp();
		},
		methods: {
			// 保存当前设置
			saveSet() {
				// 数据返回值保持深复制
				aliPaySet({
					config: this.setForm
				}).then(res => {
					// console.log(res);
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
		            message: '恢复成功'
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
				let alipay = this.store.get('app').extra.alipay;
				if(alipay) {
					this.setForm = JSON.parse(JSON.stringify(alipay))
				}
			}
		}
	}
</script>
<style scoped></style>