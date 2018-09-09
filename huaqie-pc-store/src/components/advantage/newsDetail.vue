<template>
	<div class="sta_all_2" align="justify" style=" background:#fff; padding:40px;">
		<div class="news-header">
			<div class="news-title">{{detail.basic.title}}</div>
			<div class="news-time">time：{{detail.updated|filterTime}}</div>
		</div>
		<div class='news-body'>
			<div v-html='text'></div>
		</div>
		<div class="news-footer">
			<el-button type="primary" @click='$router.go(-1)'><i class='el-icon-d-arrow-left'></i> BACK</el-button>
		</div>
	</div>
</template>
<script>
import { getNewsById } from '@/api/api'
import moment from 'moment'
export default {
	name: 'newsDetail',
	data() {
		return {
			detail: {
				basic: {}
			},
			text: ''
		}
	},
	created() {
		this.getNewsById()
	},
	filters: {
		filterTime(val) {
			return moment(val).format('YYYY-MM-DD hh:mm');
		}
	},
	methods: {
		getNewsById() {
			const feedId = this.$route.query.feedId;
			getNewsById({
				feedId: feedId
			}).then(res => {
				if(res.code > 0) {
					this.$message.error(res.message)
					return;
				}
				this.detail = res.data;
				this.text = res.data.basic.text;
				// console.log(res.data);
			});
		}
	}
}
</script>
<style scoped>
.news-header {
	width: 100%;
	padding-bottom: 10px;
	border-bottom: 1px solid #ccc;
}
.news-title {
	width: 50%;
	font-size: 24px;
	word-break: break-all;
	text-align: center;
	margin: 0 auto;
}
.news-time {
	margin: 10px 0;
	font-size: 16px;
	text-align: center;
}
.news-body {
	margin-top: 30px;
	word-break: break-all;
	font-size: 14px;
	line-height: 1.5;
	text-indent:35px
}
.news-footer {
	text-align: center;
	margin-top: 20px;
}
</style>