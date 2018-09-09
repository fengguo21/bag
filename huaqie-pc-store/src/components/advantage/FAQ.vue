<template>
	<div class="sta_all_2" align="justify" style=" background:#fff; padding:20px;">
		<div class='wrap'>
			<div v-html='text'></div>
		</div>
	</div>	
</template>
<script>
import { getFaq } from '@/api/api'
export default {
	data() {
		return {
			text: ''
		}
	},
	created() {
		this.getFaq()
	},
	methods: {
		getFaq() {
			getFaq({}).then(res => {
				if(res.code > 0) {
					this.$message.error(res.message)
					return;
				}
				this.text = res.data.basic.text;
			})
		}
	}
}
</script>
<style scoped>
.wrap {
	font-size: 16px;
	line-height: 1.5;
	text-indent: 35px;
	word-break: break-all;
}
</style>