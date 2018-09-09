<template>
  <div id="mycard_box">
    <!--活动列表-->
    <div class="tab">
      <router-link :to="{name:'mycard1'}" replace>可使用</router-link>
      <router-link :to="{name:'mycard2'}" replace>已使用</router-link>
      <router-link :to="{name:'mycard3'}" replace>已过期</router-link>
      <div class="clear"></div>
    </div>
    <transition>
    <div class="box">
      <router-view></router-view>
    </div>
    </transition>
  </div>
</template>
<script>
  export default {
    name: 'mycard',
    data() {
      return {
      }
    },
    created() {
       if(document.getElementById('appLoading'))       {document.body.removeChild(document.getElementById('appLoading'))}
    },
    mounted: function () {
      
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less'; 
  #mycard_box{background:#f0f2f6;/*height:100%;  position:absolute;left:0px;top:0px; overflow-y:scroll;*/min-height:100%;width:100%;}
  #mycard_box .tab {
    padding: 0.28125rem 3%;
    background:#fff;
    position:fixed;left:0px;top:0px;width:100%;
    z-index:3;
  }
  #mycard_box .tab a {
    text-decoraction: none;
    height: 0.9375rem;
    width: 31%;
    display: block;
    float: left;
    font-size: @ttsize2;
    color: #303030;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 0.9375rem;
    vertical-align: middle;
  }

  #mycard_box .tab a:nth-child(1) {
    border-radius: 5px;
    border-radius: 5px 0 0 5px;
  }

  #mycard_box .tab a:nth-child(2) {
    border-left: none;
    border-right: none;
  }

  #mycard_box .tab a:nth-child(3) {
    border-radius: 5px;
    border-radius: 0px 5px 5px 0px;
  }

  #mycard_box .tab .router-link-active {
    color: #fff;
    background: #2a292c;
    border: 1px solid #2a292c;
  }
.quancode img{width:150px;height:150px;}
.box {
   /* margin-top: 1.6rem;*/
    padding: 1.4rem  0.28125rem 0.46875rem 0.28125rem;
  }
</style>
