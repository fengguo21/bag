<template>
	<el-form label-width="165px" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="应用ID">
			{{ getApp().appId }}
		</el-form-item>
	</el-form>
</template>
<script>

	export default {
		name: 'appBasicSet',
		data() {
			return {
				
			}
		},
		mounted() {
			this.getApp();
		},
		methods: {
			getApp() {
				return this.store.get('app')
			}
		}
	}
</script>
<style scoped></style>