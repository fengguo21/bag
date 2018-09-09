<template>
	<div class='right-nav'>
		<router-link :to="{path: content.path}">
			<div class="nav-img">
				<img :src="content.imgUrl">
			</div>
			<div class="nav-name">{{content.title}}</div>
		</router-link>
	</div>
</template>
<script>
export default {
	name: 'bannerRight',
	props: ['content'],
	// content -> imgUrl, title
	data() {
		return {}
	}
}
</script>
<style scoped>
.right-nav {
	width: 225px;
	height: 54px;
	padding: 7px; 
	box-sizing: border-box;
	background: #fff;
	margin-bottom: 17px;
	border-radius: 3px;
}

.right-nav a {
	color: #f00;
	display: block;
	overflow: hidden;
}

.nav-img {
	float:  left;
}

.nav-name {
	height:  40px;
	overflow: hidden;
	text-align: left;
	font-size: 16px;
	line-height: 40px;
	padding-left: 10px;
	font-weight: 600;
	font-family: '微软雅黑', '宋体', Arial;
	color:black;
}
</style>