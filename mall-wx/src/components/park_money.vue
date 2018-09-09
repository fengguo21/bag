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
            <li class="li2">当日免费停车1小时</li>
          </ul>
          <ul class="ul_list1">
            <li>特选银卡会员 </li>
            <li class="li2">当日免费停车2小时</li>
          </ul>
          <ul class="ul_list1">
            <li>金卡会员 </li>
            <li class="li2">当日免费停车3小时</li>
          </ul>
          <div class="clear"></div>
        </section>
        <section>
          <h2>凭当日购物小票自助扫码或至礼宾台，
            <br>领取停车优惠券
          </h2>
        </section>
        <section>
          <b>进入“领取优惠券”，了解规则详情</b>
        </section>
        <!--<section>
          <b>非会员/电子会员：</b>
          <p>• 当日累计消费满200元兑换1小时，最多兑换3小时 </p>
        </section>
        <section>
          <b>银卡/特选银卡/金卡会员：</b>
          <p>• 当日累计消费满100元兑换1小时，最多兑换3小时</p>
        </section>
        <section>
        -->
          <div class="list01">
            <div>*会员优惠可与消费优惠叠加</div>
            <div>*每个微信账户或会员账户每日/每次停车限享受1次会员停车优惠</div>
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
    background-size: cover;
    width: 100%;
    position: absolute;
    line-height: 150%;
    .park_cont {
      width: 95%;
      margin: 0 auto;
    }
    b {
      font-weight: normal;
      display: block;
    }
    .park_cont .cont {
      padding: 0.8rem 5%;
    }
    .park_cont .cont h2 {
      font-size: @ttsize;
      text-align: center;
      line-height: 160%;
      padding-bottom: 10px;
      border-bottom: 1px solid #f3f3f3;
      font-weight: normal;
      color: @yellow;
    }
    .btnlist {
      width: 100%;
    }
    .btnlist a {
      display: block;
      border: 1px solid @yellow;
      .btn_bigyellow2(@mrgtop: 0, @mrgbt: 0)
    }
    p {
      padding-top: 0.3125rem;
      color: rgba(0, 0, 0, 0.5);
    }
    .btnlist a.btn_next {
      display: block;
      .btn_bgwhite(@mrgtop: 0.3rem, @mrgbt: 0.4rem)
    }

    .park_cont .cont li {
      float: left;
      margin-bottom: 0.1rem;
      width:45%;
    }
    .park_cont .cont li:first-child {
      width: 50%;
    }
    .park_cont section {
      margin: 0.3rem 0 0.5rem 0;
      padding: 0 0.3rem;
    }
    .ul_list1 li.li2 {
      margin-left: 5%;
    }
  }

  .cont ul {
    margin-bottom: 0.2rem;
    line-height: 160%;
  }

  .list01 div {
    margin-bottom: 0.1rem;
    font-size: @smallsize;
  }

  @media only screen and (min-device-height:810px) {
    .park_mainbox .park_cont .cont {
      padding-top: 1.2rem;
    }
  }

</style>
<script>
  import wx from 'weixin-js-sdk'
  import {
    wxInit
  } from '@/assets/js/wxbase.js'
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
    mounted() {
      wxInit()
    },
    methods: {
      //scancode start
      scancode() {
        var that = this
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
