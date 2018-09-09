<template>
	<div id="tab_content_1" class="tab_content" style="display: block;">
		<div v-html='desc'></div>
		<!-- <div class="pro-floor" v-for='item in images'>
			<p style="text-align:center" class='pro-img'>
				<img :alt="item.name" :src="item.url">
			</p>
		</div>	 -->	
	</div>	
</template>
<script>
export default {
	name: 'tabOverview',
	props: {
		desc: String
	}
}
</script>
<style scoped>
</style>