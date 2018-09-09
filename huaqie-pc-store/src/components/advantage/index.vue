<template>
	<div class='static-wrap'>
		<!--<img src="../../assets/images/friend.png">-->
		<tab-card>{{advantageName}}</tab-card>
		<router-view></router-view>
	</div>
</template>
<script>
import tabCard from '@/components/shared/tabCard'
export default {
	name: 'advantage',
	computed: {
		advantageName() {
			return this.$route.meta.name;
		}
	},
	data() {
		return {}
	},
	components: {
		tabCard
	}
}
</script>
<style scoped>
.static-wrap > img {
	display: block;
	margin: 10px 0;
}
</style>