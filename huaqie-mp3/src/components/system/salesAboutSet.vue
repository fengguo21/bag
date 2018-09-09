<template>
	<el-form label-width="165px" :model="setForm" style="margin:20px;width:60%;min-width:600px;">
	<el-form-item label="标题">
	    <el-input v-model="setForm.title" placeholder=""></el-input>
	  </el-form-item>
	  <el-form-item label="内容">
	    <el-input type='textarea' v-model="setForm.text" :autosize='{ minRows: 10, maxRows: 10 }'></el-input>
	  </el-form-item>
	  
	  <el-form-item>
	    <el-button type="primary" @click="saveSet">保存</el-button>
	  </el-form-item>
	</el-form>
</template>
<script>
	import { setSalesAbout, getSalesAbout } from '@/api/api'
	export default {
		name: 'chargeSet',
		data() {
			return {
				setForm: {
					title: '',
		          	text: ''
		        }
			}
		},
		mounted() {
			this.getApp();
		},
		methods: {
			saveSet() {
				
				setSalesAbout({
					title: this.setForm.title,
					text: this.setForm.text
				}).then( res => {
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '保存成功'
						});
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
				// console.log('save');
			},
			getApp() {
				getSalesAbout({}).then(res => {
					console.log('====', res.data)
					if(!res.data || !res.data.basic)
						return
					this.setForm = {
						title: res.data.basic.title,
						text: res.data.basic.text
					}
				})
			}
		}
	}
</script>
<style scoped></style>