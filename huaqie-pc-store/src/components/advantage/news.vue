<template>
	<div class="sta_all_2" align="justify" style=" background:#fff; padding:40px; position: relative; box-sizing: border-box">
		<div v-if='total > 0'>
			<div class="list-wrap">
				<div class="list-item" v-for='item in list'>
					<div class='item-msg'>
						<el-tooltip effect="dark" placement="top-start">
							<div slot="content">{{item.basic.title}}</div>
					    	<span class='news-title'>{{item.basic.title}}</span>
					    </el-tooltip>
						
						<span class='news-time'>{{item.updated|filterTime}}</span>
					</div>
					<div class='item-btn'>
						<el-button size='small' type="info" @click='queryDetail(item.feedId)'>查看详情<i class="el-icon-d-arrow-right"></i></el-button>
					</div>
				</div>
			</div>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
				</el-pagination>
			</el-col>
		</div>
		<div class='empty' v-else>
			<span>NO NEWS~~</span>
		</div>
	</div>
</template>
<script>
import { getNewsList } from '@/api/api'
import moment from 'moment'
export default {
	data() {
		return {
			page: 1,
			total: 0,
			list: []
		}
	},
	created() {
		this.getNewsList()
	},
	filters: {
		filterTime(val) {
			return moment(val).format('YYYY-MM-DD hh:mm');
		}
	},
	methods: {
		getNewsList() {
			getNewsList({
				page: this.page,
				size: 10
			}).then(res => {
				if(res.code > 0) {
					this.$message.error(res.message)
					return;
				}
				this.list = res.data.list;
				this.total = res.data.total;
			})
		},
		queryDetail(feedId) {
			// console.log(feedId)
			this.$router.push({path: '/advantage/newsDetail', query: {feedId: feedId}})
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getNewsList();
		}
	}
}
</script>
<style scoped>
.empty {
	font-size: 18px;
	text-align: center;
	color: #808281;
}
.list-wrap {
	width: 100%;
	box-sizing: border-box;
	padding: 0 30px;
	overflow: hidden;
}
.list-item {
	width: 45%;
	box-sizing: border-box;
	padding: 15px 20px;
	background: #f6f6f6;
	border-radius: 5px;
	margin-bottom: 20px;	
}
.list-item:nth-child(2n-1) {
	float: left;
}
.list-item:nth-child(2n) {
	float: right;
}
.item-msg {
	width: 100%;
	overflow: hidden;
}
.news-title {
	width: 60%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	font-size: 16px;
	float: left;
}
.news-title:hover {
	cursor: pointer;
}
.news-time {
	display: inline-block;
	width: 40%;
	font-size: 14px;
	text-align: right;
}
.item-btn {
	width: 100%;
	margin-top: 10px;
}
</style>