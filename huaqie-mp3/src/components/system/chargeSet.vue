<template>
	<el-form label-width="165px" :model="setForm" style="margin:20px;width:60%;min-width:600px;">
	  <el-form-item label="APP_ID">
	    <el-input v-model="setForm.app_id" placeholder="请输入 APP_ID"></el-input>
	  </el-form-item>
	  <el-form-item label="KEY">
	    <el-input v-model="setForm.key" placeholder="请输入 KEY"></el-input>
	  </el-form-item>
	  <el-form-item>
	    <el-button type="primary" @click="saveSet">保存</el-button>
	    <el-button @click="cancel">取消</el-button>
	  </el-form-item>
	</el-form>
</template>
<script>
	import { chargeSet } from '@/api/api'
	export default {
		name: 'chargeSet',
		data() {
			return {
				setForm: {
		          app_id: '',
		          key: ''
		        }
			}
		},
		mounted() {
			this.getApp();
		},
		methods: {
			saveSet() {
				chargeSet({
					config: this.setForm
				}).then( res => {
					// console.log(res.data);
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
				// console.log('save');
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
				let batteryCharge = this.store.get('app').extra.batteryCharge;
				// console.log(batteryCharge);
				if(batteryCharge) {
					this.setForm = JSON.parse(JSON.stringify(batteryCharge))
				}
			}
		}
	}
</script>
<style scoped></style>