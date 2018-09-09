<template>
  <div class="park_mainbox">
    <!--park_cont start-->
    <div class="park_cont">
      <div class="cont">
        <h2>出示您的微信会员二维码或实体会员卡，
          <br> 享会员停车优惠
        </h2>
        <section>

          <ul class="ul_list1">
            <li>银卡会员 </li>
            <li>当日免费停车1小时</li>
          </ul>
          <ul>
            <li>特选银卡会员 </li>
            <li>当日免费停车2小时</li>
          </ul>
          <ul>
            <li>金卡会员 </li>
            <li>当日免费停车3小时</li>
          </ul>
          <div class="clear"></div>
        </section>
        <section>
          <b>凭当日购物小票自助扫码或至礼宾台，领取停车优惠券 
          </b>
          </section>
          <section><b>非会员/电子会员：</b>
          当日累计消费满200元兑换1小时，最多兑换3小时 </section>
        <section>
          <b>银卡/特选银卡/金卡会员：</b>
          >当日累计消费满100元兑换1小时，最多兑换3小时
        </section>
        <section>
          <div class="list01">
            <div>*会员优惠可与消费优惠叠加</div>
            <div>*每个微信账户每日/每次停车限享受1次停车优惠</div>
            <div>*停车超出免费时间，按5元/小时计算</div>
          </div>
        </section>
        <div class="clear"></div>
      </div>
    </div>
    <!--cont end-->
    <div class="btnlist">
      <router-link :to="{name:'park_list'}">领取优惠券</router-link>
      <a href="javascript:void(0)" class="btn_next" @click="scancode">停车支付</a>
    </div>
  </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  .park_mainbox {
    /* background: #fff url("~assets/images/park/park-bg.png") center center no-repeat; */
    background-size: cover;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    position: fixed;
    line-height: 150%;
    .park_cont {
      /*background: rgba(111, 111, 111, 0.6);*/
      width: 95%;
      margin: 0 auto;
    }
    b {
      color: @yellow;
      padding-bottom: .1rem;
      display: block;
    }
    .park_cont .cont {
      padding: 0.8rem 5%;
      /* color: #fff; 
       font-size: @ttsize;
      */
    }

    .park_cont .cont h2 {
      font-size: @ttsize3;
      text-align: center;
      line-height: 160%;
      padding-bottom: .65rem;
      border-bottom: 1px solid #878787;
      font-weight: normal;
      color: @yellow;
    }

    .park_cont .cont p {
      margin-top: .34375rem;
    }
    .btnlist {
     /*  position: fixed;
      bottom: .3125rem;
      left: 0px; */
      width: 100%;
    }
    .btnlist a {
      display: block;
      .btn_bigyellow(@mrgtop: 0, @mrgbt: 0)
    }
    .btnlist a.btn_next {
      display: block;
      .btn_bgwhite(@mrgtop: 0.3rem, @mrgbt: 0.4rem)
    }
    .park_cont .cont li {
      float: left;
    }
    .park_cont .cont li:first-child {
      width: 40%;
    }
    .park_cont section {
      margin: 0.3rem 0 0.5rem 0;
      font-size:@ttsize2;
    }
  }

  .cont ul {
    margin-bottom: 0.2rem;
    line-height:160%;
  }
 .list01 div{line-height:160%;}

</style>
<script>
  import wx from 'weixin-js-sdk'
  /* import {
    wxInit
  } from '../../static/js/wxbase.js' */
  var wxbase = require('@/assets/js/wxbase.js')
  var wxInit = wxbase.wxInit
  export default {
    data() {
      return {

      }
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {},
    methods: {
      //scancode start
      scancode() {
        var that = this
        wxInit()
        wx.ready(function () {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
              that.$router.push({
                name: 'park',
                query: {
                  qrcode: result
                }
              })
            }
          });
        })
        wx.error(function (res) {
          console.log(res)
        });
      }
      //scancode end
    }
  }

</script>
