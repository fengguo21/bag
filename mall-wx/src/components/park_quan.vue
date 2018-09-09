<template>
  <div class="quanbox">
    <div class="tt1">点击下方按钮扫描小票二维码，自助领取停车优惠券</div>
    <div class="cont">
      <h2>
        <span>-</span>&nbsp;&nbsp;领券须知&nbsp;&nbsp;
        <span>-</span>
      </h2>
      <p>1.消费满额赠优惠券兑换
        <ul>
          <li>• 非会员、电子会员当日购物小票累计消费满200元兑换1小时</li>
          <li>• 银卡、特选银卡、金卡会员当日购物小票累计消费满100元兑换1小时</li>
          <li>* 每个微信账户或会员账户每日停车限享受3小时消费停车优惠</li>
        </ul>
      </p>
      <p>2. 餐饮娱乐消费赠优惠券兑换
        <ul>
          <li> • 当日累计消费满100元兑换4小时，每个微信账户或会员账户每日停车限享受4小时消费停车优惠</li>
        </ul>
      </p>
      <p>3.购物小票不隔日、跨日计算</p>

      <p style="word-break:break-all">4.如需多张购物小票叠加兑换，请至商场礼宾台/兑换时间:
        <br>&nbsp;&nbsp;&nbsp;10:00~22:00； 或至负四层停车缴费处/兑换时间：24小时
      </p>
      <p>5.每个微信账户或会员账户每日/每次停车限享受1次会员停车优惠</p>
      <p>6.停车超出免费时间，按5元/小时计费</p>
      <p>*如有争议，成都IFS保留最终解释权</p>
    </div>
    <div class="btn">
      <div class="btncode" @click="scancode">扫描领券</div>
      <router-link :to="{name:'shoplist_coupons'}" class="btncode">消费换券</router-link>
    </div>
    <el-dialog title="" :visible.sync="dialogVisible1" width="90%" center>
      <center>
        <p>您已成功领取了{{quan_count}}张券，
          <br>可至我的卡券中查看</p>
      </center>
      <span slot="footer" class="dialog-footer">
        <el-button @click="gopark" class="confirmbtn">停车缴费</el-button>
        <el-button type="primary" @click="scancode" class="confirmbtn">继续领取</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  @mrgbt: .546875rem;
  .quanbox .tt1 {
    color: @yellow;
    text-align: center;
    padding: 10px 0;
    border-bottom: 1px solid #f3f3f3;
  }

  .quanbox h2 {
    font-size: @ttsize2;
    text-align: center;
    margin-bottom: @mrgbt;
  }

  .quanbox h2 span {
    color: @yellow;
    font-size: @ttsize3;
  }

  .quanbox .btn {
    display: flex;
    width: 95%;
    margin: 0px auto;
    margin-top: 0.5rem;
  }

  .quanbox .btncode {
    flex: 1;
    .btn_bigyellow(@width: 45%, @mrgtop: 0, @mrgbt: 0)
  }

  .quanbox .btncode:first-child {
    margin-right: 4%;
  }

  .quanbox .cont {
    width: 90%;
    padding: .4rem 0 0rem 0;
    margin: 0px auto;
  }


  .quanbox .cont p {
    margin-bottom: 0.3rem;
    font-size: 0.28rem;
  }

  .quanbox .cont ul {
    color: rgba(0, 0, 0, 0.5);
  }

  .quanbox .cont li {
    margin: .3125rem 0 0 .3125rem;
  }

  @media only screen and (min-device-height:810px) {
    .quanbox .cont p {
      margin-bottom: @mrgbt;
    }
    .quanbox .cont p {
      margin-bottom: 0.4rem;
      font-size: @basesize;
    }
  }

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
        quan_count: "",
        dialogVisible1: false
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
      gopark() {
        this.dialogVisible1 = false
        this.$router.push({
          name: 'park_money'
        })
      },
      //scancode start
      scancode() {
        var that = this
        wx.ready(function () {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
              that.savecode(result)
            }
          });
        })
        wx.error(function (res) {
          console.log(res)
        });
      },
      savecode(qrcode) {
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id + "/park/scanqr"
        var qrcode_s = qrcode.split("?")[1]
        var qrdate = qrcode_s.split("|")[4]
        var qrdate = qrdate.substr(0, 4) + "-" + qrdate.substr(4, 2) + "-" + qrdate.substr(6, 2)
        let params = {
          "store_code": qrcode_s.split("|")[2],
          "cashier_code": qrcode_s.split("|")[3],
          "sale_num": qrcode_s.split("|")[6],
          "consume_date": qrdate,
          "amount": qrcode_s.split("|")[5]
        }
       // alert(JSON.stringify(params))
        that.$http.post(url, params)
          .then(res => {
            if (res.data.code == 0) {
              that.quan_count=res.data.data
              that.dialogVisible1=true
            } else {
              that.popwarn1(res.data.msg, "提示")
            }
          }).catch(function (res) {
            console.log(res);
            alert("错误" + res)
          });
      } //savecode end
    }
  }

</script>
