<template>
  <div class="myeventlist">
    <div class="bnrlist">
      <img :src="item.image">
    </div>
    <div class="cont">
      <h1>活动名称：{{item.camp_name}}</h1>
      <p>场次：{{item.round_name}}</p>
      <!--<p v-if="item.signin_start">签到开始时间：{{substr_date(item.signin_start)}}</p>-->
      <p v-if="item.signin_start">签到时间：{{substr_date(item.signin_start)}}-{{substr_date(item.signin_end)}}</p>
      <p v-if="item.start_time && item.end_time">活动时间：{{substr_date(item.start_time)}}-{{substr_date(item.end_time)}}</p>
      <p>活动地址：{{item.location}}</p>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['item'],
    data() {
      return {}
    },
    methods: {
      substr_date(time) {
        return time.substr(0, 16)
      }
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../../static/css/main.less';

  .myeventlist {
    display: flex;
    align-items: center;
    background: #fff url('~assets/images/mc/myevent-bg.jpg') left top repeat-x;
    background-size: auto 2.40625rem;
    color: #999;
    padding: .234375rem;
    border-bottom: 1px solid #ebebec;
    flex-wrap: wrap;
    /* .bnr{width:90%;} */
    .bnrlist img {
      width: 100%;
      border: 1px solid #bebebe;
    }
    .bnrlist {
      width: 25%;
      padding-right: 5%;
    }
    h1 {
      font-size: @ttsize2;
      margin-bottom: @margin5px;
      font-weight: normal;
    }

    .cont {
      /*display:flex;
    flex-wrap:wrap;
    align-items:center;
    min-height:2rem;*/
      padding-top: .15625rem;
      width: 70%;
    }
    .cont p {
      margin-bottom: @margin5px;
    }
  }

</style>
