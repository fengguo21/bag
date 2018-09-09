<template>
<div class="eventmainbox">
<!--活动列表 start-->
<div class="eventlist" v-for="item in eventdata">
<div class="bnr"><router-link :to="'/magazinedetail/'+item.id"><img :src="item.mgz_image"></router-link></div>
<div class="cont">
<h1>{{item.mgz_name}}</h1>
<router-link :to="'/magazinedetail/'+item.id"  class="btn_view">查看详情</router-link>
<div class="clear"></div>
</div>
</div>
<!--活动列表 end-->
</div>
</template>
<script>
 export default {
     props: {
      eventdata: {
        type: Array
      }
     },
    data() {
      return {
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
 @import '../../../static/css/main.less';
 @radius:5px;
  .eventlist{border-radius:@radius;box-shadow:0px 5px 5px #a8abb1;}
 .eventlist .bnr{border-radius:5px 5px 0 0;}
 .eventlist{background:#fff;margin-bottom:0.546875rem;}
.eventlist .bnr img{width:100%;border-radius:@radius @radius 0 0;}
 .eventlist .cont{padding:15px; }
 .eventlist h1{font-size:@ttsize2;margin-bottom:@margin5px;}
 .eventlist p{color:#b3b3b3;font-size:@ttsize;margin-bottom:@margin5px;}
.cont a.btn_view{color:#b29664;float:right;margin-top:4px;}
.eventmainbox{background:#f0f2f6 url('~assets/images/event-bg.jpg') left top repeat-x;padding:0.46875rem 5%;
background-size:.78125rem .390625rem;position:absolute;left:0px;top:0px;width:90%;height:100%;overflow-y:scroll;}
</style>