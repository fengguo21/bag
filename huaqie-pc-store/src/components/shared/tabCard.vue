<template>
	<div style="width:999px; border:1px solid #2C2C2C; position: relative" align="left">
		<div class="title">
			<font>
				<font v-if='title !== ""'>{{title}}</font>
				<font v-else><slot></slot></font>
			</font>
		</div>

		<!-- 查看所有 -->
		<div v-if='more' style="float:right; width:140px; height: 35px; position:absolute; top: 50%; right: 0; transform: translateY(-50%) ">
			<div class="colorfff see-more" @click='queryAll'>
				<font style='vertical-align: middle'>
					<font>Hiển thị nhiều hơn&nbsp;&nbsp;&nbsp;</font>
				</font>
				<img  style='vertical-align: middle' src="../../assets/images/icon_arrow.png">
			</div>
		</div>
		<div class="clear"></div>
	</div>
</template>
<script>
export default {
	name: 'tabCard',
	props: {
		title: {
			type: String,
			default: ''
		},
		more: {
			type: Boolean,
			default: false
		},
		proStyle: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {}
	},
	computed: {
	},
	methods: {
		queryAll() {
			this.$emit('lookAll');
		}
	}
}
</script>
<style scoped>
.btn-wrap {
	display: inline-block;
	width: 30px;	
	padding: 10px 0;
}
.btn-wrap img {
	display: block;
	margin:  0 auto;
	line-height: 18px;
}
.see-more {
	padding: 10px 0;
	display: block;
	text-align: center;
	cursor: pointer;
}
</style>