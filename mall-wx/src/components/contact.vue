<template>
  <div class="contact_box">
    <!--cont start-->
    <div class="cont">
      <div class="tx">
        <img src="~assets/images/mc/tx-service.png">
      </div>
      <!--txtbox start-->
      <div class="txtbox">
        <div class="txtbox_top">
          <div class="txtbox_end">
            <h1>以下是热门问题，欢迎先查阅哦</h1>
            <ul>
              <li>
                <router-link :to="{name:'park_money'}">停车收费</router-link>
              </li>
              <li>
                <router-link :to="{name:'selfscore'}">自助积分</router-link>
              </li>
              <li>
                <router-link to="/article_electronic">VIP权益</router-link>
              </li>
             <li>
                <router-link to="/brand">品牌查询</router-link>
              </li>
              <li>
                <router-link to="/service">服务设施</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--txbox end-->
      <div class="clear"></div>
      <div class="tx" style="margin-top:0.3rem">
        <img src="~assets/images/mc/tx-service.png">
      </div>
      <!--txtbox start-->
      <div class="txtbox txtbox2">
        <div class="txtbox_top">
          <div class="txtbox_end">
         人工客服服务热线：<a href="tel:028-69396939" class="tel">028-69396939</a>
         <!-- <span v-if="$store.state.member.gradenme=='金卡' || $store.state.member.gradenme=='特选银卡'"><a href="tel:028-69399399" class="tel">028-69399399</a></span>
           <span v-else><a href="tel:028-69396939" class="tel">028-69396939</a></span>--><br>
            人工客服服务时间：10:00-22:00
          </div>
        </div>
      </div>
      <!--txbox end-->
      <div class="clear"></div>
    </div>
    <!--cont end-->
    <div class="btn_kefu" @click="contact">找人工客服</div>
  </div>
</template>
<script>
  export default {
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    methods: {
      contact() {
        WeixinJSBridge.call('closeWindow')
      }
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  .contact_box {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #f9f9f9;
  }

  @import '../../static/css/main.less';
  .btn_kefu {
    .btn_bigyellow(@mrgtop: 0.3rem, @radius: 5px)
  }

  .contact_box .cont {
    padding: .65rem 0 0.8rem 0;
  }

  .contact_box .tx {
    width: 1.32rem;
    float: left;
    margin: 0 .16rem;
  }

  .contact_box .tx img {
    width: 100%;
    border-radius: 50%;
  }

  .contact_box .txtbox {
    float: left;
    background: url('~assets/images/mc/topbg-02.jpg') repeat-y;
    width: 7.92rem;
    background-size: 7.92rem auto;
  }

  .contact_box .txtbox_top {
    background: url('~assets/images/mc/topbg-01.jpg') left top no-repeat;
    background-size: 7.92rem 1.03125rem;
  }

  .contact_box .txtbox_end {
    background: url('~assets/images/mc/topbg-03.jpg') left bottom no-repeat;
    background-size: 7.92rem auto;
    line-height:160%;
  }

  .contact_box h1 {
    font-size: @ttsize2;
    font-weight: normal;
    padding: .46875rem .5rem;
  }

  .contact_box li {
    padding: .25rem 0.25rem 0.25rem 0.7rem;
    border-top: 1px solid #d0d0d0;
    margin-left: 0.25rem;
    color: #3f65d2;
    background: url('~assets/images/mc/icon-dot.jpg') 0.25rem center no-repeat;
    background-size: .3125rem auto;
    font-size: @ttsize;
  }

  .contact_box li a {
    color: #3f65d2;
  }

  .contact_box .txtbox2 {
    margin-top: 0.4rem;
  }

  .contact_box .txtbox2 .txtbox_end {
    padding: .46875rem 0.1rem 0.46875rem 0.7rem;
  }
  .tel{color:@yellow;}

</style>
