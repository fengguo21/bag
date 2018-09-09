<template>
  <div class="park_list">
    <!-- <li @click="tab(0)" :class="[tabact==0?'active':'']">
        <a href="javascript:void(0)">消费领券</a>
      </li>
      <li @click="tab(1)" :class="[tabact==1?'active':'']">
        <a href="javascript:void(0)">积分兑换</a>
      </li>
      <li @click="tab(2)" :class="[tabact==2?'active':'']">
        <a href="javascript:void(0)">我的卡券</a>
      </li>-->
    <ul class="tab">
      <li>
        <router-link :to="{name:'park_quan'}" replace>消费领券</router-link>
      </li>
      <li>
        <router-link :to="{name:'shoplist_park'}" replace>积分兑换</router-link>
      </li>
      <li>
        <router-link :to="{name:'mycard1_park'}" replace>我的卡券</router-link>
      </li>
    </ul>
    <div class="cont">
      <router-view></router-view>
    </div>
    <!-- <div class="cont" v-if="tabact==0">
      <parkquan></parkquan>
    </div>
    <div class="cont"  v-if="tabact==1">
      <shoplist_park></shoplist_park>
    </div>
     <div class="cont"  v-if="tabact==2">
      <mycard1></mycard1>
    </div>-->
  </div>
</template>
<script>
  /*  import parkquan from '../components/park_quan'
        import shoplist_park from '../components/public/shoplist_park'
        import mycard1 from '../components/mycard1' */
  export default {
    data() {
      return {
        tabact: 0,
      }
    },
    components: {
      /*  parkquan,
       shoplist_park,
       mycard1 */
    },
    methods: {
      tab(idx) {
        this.tabact = idx
      }
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  .park_list .tab {
    width: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    background: #fff;
    display: flex;
    align-items: center;
    height: 1.25rem;
    font-size: @ttsize2;
    z-index: 10;
    border-bottom: .3125rem solid #eceff5;
  }

  .shopbox {
    background: #eceff5;
  }

  .park_list .tab li {
    flex: 1;
    text-align: center;
    line-height: 1.25rem;
    background: url('~assets/images/icon-line.jpg') right center no-repeat;
    background-size: 1px .375rem;
  }
  .park_list .tab li:last-child{background:none;}

  .park_list .cont {
    padding-top: 1.7rem;
  }

  .park_list .tab a {

    color: #000;
    text-decoration: none;
    display: inline-block;
  }

  .park_list .tab a.router-link-active {
    border-bottom: 1px solid @yellow;
    color: @yellow;
  }
.park_list .mainbox{padding-top:0.2rem;}
</style>
