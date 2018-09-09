<template>
    <!--活动列表 start-->
    <div>
    <div class="eventlist" v-for="item in eventdata">
      <div class="bnr">
        <router-link :to="'/eventdetail/'+item.id">
          <img :src="item.image">
        </router-link>
      </div>
      <div class="cont">
        <h1>{{item.camp_name}}</h1>
        <p>活动时间：{{substr_date(item.start_time)}} — {{substr_date(item.end_time)}}</p>
        <p class="gmfl">地址：{{item.location}}</p>
        <router-link :to="{path:'/eventdetail/'+item.id,query:{type:eventtypye}}"  class="btn_view">查看详情</router-link>        
        <div class="clear"></div>
      </div>
    </div>
    </div>
    <!--活动列表 end-->
</template>
<script>
  export default {
    props:['eventdata','eventtypye'],
    data() {
      return {}
    },
    methods:{
      substr_date(time){
          return time.substr(0,16)
      }
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../../static/css/main.less';
  @radius: 5px;
  .eventlist {
      border-radius: @radius;
      box-shadow: 0px 5px 5px #a8abb1;
      background: #fff;
      margin-bottom: 0.546875rem;
    .bnr {
      border-radius: 5px 5px 0 0;
    }

    .bnr img {
      width: 100%;
      border-radius: @radius @radius 0 0;
    }
    .cont {
      padding: 15px;
    }
    h1 {
      font-size: @ttsize2;
      margin-bottom: @margin5px;
      font-weight: normal;
    }
    p {
      color: #b3b3b3;
      font-size: 0.31rem;
      margin-bottom: @margin5px;
    }
    .cont a.btn_view {
      color: #b29664;
      float: right;
      margin-top: 4px;
    }

  }

</style>
