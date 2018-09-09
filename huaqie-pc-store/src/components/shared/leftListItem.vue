<template>
	<div id="left_catname_reg">
		<router-link :to='{path: path}'>
			<font>
				<font>
					<slot>
						{{content}}
					</slot>
				</font>
			</font>
		</router-link>
	</div>
</template>
<script>
export default {
	name: 'leftListItem',
	props: {
		content: {
			type: String,
			default: '默认内容'
		},
		path: {
			type: String,
			default: '/'
		}
	},
	data() {
		return {}
	}
}
</script>
<style scoped>
</style>