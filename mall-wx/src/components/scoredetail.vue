<template>
	<div>
		<div class="banner">
    	<p class="num">135</p>
    	<p class="desc">您当前的积分</p>
  	</div>
  	<div class="item" v-for='item in scoreList'>
  		<div class="content">
  			<p>积分兑换奖品</p>
  			<p class="date">2017-12-19</p>
  		</div>
  		<div class="balance">-{{item.Bonus}}积分</div>
  	</div>

  	<div class="more">查看更多</div>
	</div>
</template>
<script type="text/javascript">
import {getScoreDetail} from '@/api/api'
	export default{
		data(){
			return{
				scoreList:[]
			}
		},
		methods:{
			getScoreDetail(){
				let param = {}
				getScoreDetail(param).then((res)=>{
					this.scoreList = res.data
					console.log(res)
				})
			}
		},
 mounted() {
 
    
    },
    created() {
    		this.getScoreDetail()
 if(document.getElementById('appLoading'))       {document.body.removeChild(document.getElementById('appLoading'))}
    }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.banner
	height 4.35625rem
	background:url("~assets/images/score/scorebg.png") no-repeat;background-size:100% auto;width:100%;height:4.35625rem;
	color white
	text-align center
	padding-top 0.36875rem
	.num
		font-size 1.796875rem
		line-height 1.8
	.desc
		font-size 0.4375rem
.item
	display flex
	height 1.5625rem
	
	margin 0 0.3125rem
	border-bottom 0.0625rem solid #f1f1f2
	.content
		flex 1
		display flex
		flex-direction column
		justify-content center
		font-size 0.375rem
		.date
			font-size 0.28125rem
	.balance
		color #bf9d56
		font-size 0.359375rem
		line-height 1.5625rem
.more
	height 1.5625rem
	line-height 1.5625rem
	text-align center
	font-size 0.296875rem
	text-decoration underline
	color #7c7c7c
</style>