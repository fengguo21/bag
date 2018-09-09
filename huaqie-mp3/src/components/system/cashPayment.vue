<template>
	<el-form :model="setForm" label-width="165px" style="margin:20px;width:60%;min-width:600px;">
	  <el-form-item label="提现费用">
	    <div style='display: inline-block'><el-input v-model="setForm.money" placeholder="提现费用"></el-input></div> 
	    <span> %</span>
	  </el-form-item>
	  <el-form-item>
	    <el-button type="primary" @click="saveSet">保存</el-button>
	    <el-button @click="cancel">取消</el-button>
	  </el-form-item>
	</el-form>
</template>
<script>
	import { setWithdrawFee } from '@/api/api'
	export default {
		name: 'cashPayment',
		data() {
			return {
				setForm: {
					money: ''
				},
				withdrawFee: ''
			}
		},
		mounted() {
			this.getApp();
		},
		methods: {
			// 保存当前设置
			saveSet() {
				// 数据返回值保持深复制
				setWithdrawFee({
					fee: this.setForm.money
				}).then(res => {
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '保存成功'
						})
						this.store.set('WithdrawFee', this.setForm.money)
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
				// console.log(this.setForm.money);
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
				let WithdrawFee = this.store.get('WithdrawFee');
				if(WithdrawFee) {
					this.setForm.money = WithdrawFee;
				} else {
					getWithdrawFee({}).then(res => {
						if(res.code === 0) {
							this.setForm.money = res.data.fee;
							this.store.set('WithdrawFee', res.data.fee);
							// console.log(res.data);
						} else {
							this.$message.error({
								message: res.message
							})
						}
					})
				}
			}
		}
	}
</script>
<style scoped></style>