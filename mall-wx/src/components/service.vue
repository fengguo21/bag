<template>
  <div class="servicebox">
    <div class="kv">
      <img v-bind:src="servicekv">
      <div class="kvicon">
        <div class="kvicon1">
          <img src="~assets/images/service/kv-icon1.png">
        </div>
        <transition name="loadanim">
          <div class="kvicon2" v-show="load">
            <img src="~assets/images/service/kv-icon2.png">
          </div>
        </transition>
      </div>
    </div>
    <div class="menulist">
      <el-row>
        <el-col :span="6">
          <router-link :to="{name:'artical_tip1'}">
            <img src="~assets/images/service/index-icon1.png">
            <br>母婴室
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link :to="{name:'artical_tip2'}">
            <img src="~assets/images/service/index-icon2.png">
            <br>礼宾台
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link :to="{name:'artical_tip3'}">
            <img src="~assets/images/service/index-icon3.png">
            <br>包装服务
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link :to="{name:'artical_tip4'}">
            <img src="~assets/images/service/index-icon4.png">
            <br>租借服务
          </router-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <router-link :to="{name: 'article_park'}">
            <img src="~assets/images/service/index-icon5.png">
            <br>代客泊车
          </router-link>
        </el-col>
        <el-col :span="12">
          <router-link :to="{name:'article_vip'}">
            <img src="~assets/images/service/index-icon6.png" style="margin-left:8%">
            <br>VIP贵宾室
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link :to="{name:'artical_tip7'}">
            <img src="~assets/images/service/index-icon7.png">
            <br>急救设备
          </router-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <router-link :to="{name:'artical_tip8'}">
            <img src="~assets/images/service/index-icon8.png">
            <br>失物招领
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link :to="{name:'artical_tip9'}">
            <img src="~assets/images/service/index-icon9.png">
            <br>物品寄存
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link :to="{name:'park_money'}">
            <img src="~assets/images/service/index-icon10.png">
            <br>停车服务
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link :to="{name:'artical_tip11'}">
            <img src="~assets/images/service/index-icon11.png">
            <br>其他服务
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        load: false,
        servicekv: require("assets/images/service/kv.jpg")
      }
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {
      var that=this
      setTimeout(function(){that.load = true},300)     
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  .loadmemb-enter-active {
    animation: opacity 2s;
  }
  @keyframes opacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .kv {
    position: relative;
  }
  .kv img {
    width: 100%;
    vertical-align: bottom;
    border-bottom: 1px solid #414858;
  }
  .kv .kvicon {
    position: absolute;
    left: 50%;
    top: 1.328125rem;
    margin-left: -2.046875rem;
  }
  .kv .kvicon1 {
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .kv .kvicon2 {
    position: absolute;
    left: 0px;
    top: 0px;
    animation: opacity 1s;
    -webkit-animation: opacity 1s;
  }
  .kv .kvicon img {
    width: 4.09375rem;
    height: auto;
  }
  .menulist .el-col {
    text-align: center;
    border-right: 1px solid #535b6f;
    border-bottom: 1px solid #535b6f;
    padding: .7rem 0;
  }
  .menulist .el-col img {
    height: 1.09375rem;
    width: auto;
  }
  .menulist .el-col:last-child {
    border-right: none;
  }
  .servicebox {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    background: #414858;
    color: rgba(255, 255, 255, 0.5);
    font-size: @ttsize;
  }
  .servicebox a {
    color: rgba(255, 255, 255, 0.5);
  }
</style>
