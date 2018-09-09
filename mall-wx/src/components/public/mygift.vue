<template>
  <div class="">
    <vueLoading v-show="vueload"></vueLoading>
    <div class="popbox" v-show="codeShow">
      <div class="mask" @click="closegift"></div>
      <div class="popshow">
        <!-- <el-dialog title="" :visible.sync="codeShow" width="90%" top="5vh" center custom-class="dialog_box" @close="getMyGifts">-->
        <div class="cont">
          <!--  <div @click="closegift" class="icon_close">
            <img src="~assets/images/mc/icon-close2.png">
          </div>-->
          <center>
            <p>兑换礼品： {{currentGift.ITEMDESCI}}</p>
            <div class="codeWrap">
              <div id="qrcode" ref="qrcode"></div>
            </div>
          </center>
          <div class="small small1">
            <p>凭此二维码至（{{currentGift.LOCATION}}）领取礼品
            </p>
            <P>*此二维码为礼品领取唯一凭证，请妥善保管，若泄露
              <br>请自行负责</P>
          </div>
          <ul class="cusul small small2">
            <li>
              <span class="gift_lf">
                礼品名称：</span>{{currentGift.ITEMDESCI}}</li>
            <li>
              <span class="gift_lf">
                校验码：</span>{{currentGift.CHECKCODE}}</li>
            <li>
              <span class="gift_lf">
                会员号：</span>{{currentGift.VIPCODE}}</li>
            <li>
              <span class="gift_lf">兑换日期：</span>{{substr_date(currentGift.USEDATE)}}</li>
            <li>
              <span class="gift_lf">领取截止日期：</span><span v-if="currentGift.CUTOFFDATE">{{substr_date(currentGift.CUTOFFDATE)}}</span>
            </li>
            <li>
              <span class="gift_lf">
                兑换数量：</span>{{currentGift.QTY}}</li>
            <li>
              <span class="gift_lf" >
                扣减积分：</span>{{currentGift.BONUS}}</li>
            <li>
              <span class="gift_lf" >
                订单号：</span>{{currentGift.DOCNO}}</li>
          </ul>
          <div @click="closegift" class="btn_confirm">确定</div>
        </div>
      </div>
    </div>
    <!-- popbox-->
    <div v-for='item in gifts' class="shoplist"  @click='showcode(item)'>
      <div class="goodsinfo">
        <div class="img">
          <!--<img :src="item.COUPON_IMAGE">-->
          <img :src="item.PHOTOPATH">
        </div>
        <div class="txtlist">
          <div class="dscp">{{item.COUPON_NAME}}</div>
          <div class="dscp">兑换数量：{{item.QTY}}</div>
          <div class="dscp">兑换积分：{{item.BONUS}}</div>
          <div class="dscp">订单号：{{item.DOCNO}}</div>
          <div class="dscp">领取地点：{{item.LOCATION}}</div>
        </div>
        <div class="clear"></div>
      </div>
      <div class="footinfo">
        <div class="date">
          领取截止日期：{{substr_date(item.CUTOFFDATE)}}
        </div>
        <div class="code">
          <div v-if="item.STATUS=='未领取'">
            <input type="button" class="codebtn" @click='showcode(item)' value="兑换码">
          </div>
          <div v-if="item.STATUS=='已过期'">
            <input type="button" class="codebtn" value="已过期" disabled="true">
          </div>
          <div v-if="item.STATUS=='领取'">
            <input type="button" class="codebtn" value="已领取" disabled="true">
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <div class="more" v-if="ismore && !loadingShow" @click="getmore()">查看更多>></div>
    <div v-if="loadingShow" class="nodata">
      <img src="~assets/images/mc/icon-index5.png">
      <br>您还没有可使用的礼品哦</div>
  </div>
</template>
<script type="text/javascript">
  import vueLoading from '../../components/vueload'
  import store from '@/vuex/store'
  //import VueQr from 'vue-qr'
  import QRCode from 'qrcodejs2' //生成二维码
/*   import {
    getMyGifts
  } from '@/api/api' */
   var api = require('@/api/api')
  var getMyGifts=api.getMyGifts
  var qrcode
  export default {
    data() {
      return {
        vueload: true,
        codeShow: false,
        loadingShow: false,
        gifts: [],
        currentGift: '1234567',
        testcode: false,
        th_txt: "兑换码",
        ismore: true
      }

    },
    components: {
     // VueQr,
      vueLoading
    },
    methods: {
      getmore() {
        this.getMyGifts('0')
        this.ismore = false
      },
      qrcode(item) { //生成二维码
        qrcode.makeCode(item.VERIFY_STR);
      },
      closegift() {
        this.codeShow = false
        this.getMyGifts('0')
      },
      getMyGifts(type) {
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/member/exchist/" + that.$store.state.id
        let params = {
          type: type
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            var res = res.data
            if (!res.data) {
              this.loadingShow = true
              return false
            }
            if (res.data.length == 0) {
              this.loadingShow = true
            }
         /*    res.data.forEach((item) => {
              if(item.CUTOFFDATE)
              {item.CUTOFFDATE = item.CUTOFFDATE.substr(0, 16)}
              if(item.USEDATE)
              {item.USEDATE = item.USEDATE.substr(0, 16)}
            }) */
            this.gifts = res.data
            this.vueload = false
          }).catch(function (res) {
            console.log(res);
          });
      },
      hideCode() {
        this.codeShow = false
      },
      showcode(item) {
        if(item.STATUS!='未领取')
        {return false}
        this.currentGift = item
        this.codeShow = true
        this.qrcode(item) //生成二维码
      }
    },

    mounted() {
      qrcode = new QRCode('qrcode', {
        width: 120,
        height: 120,
        text: ""
      })
      this.getMyGifts('1')
      console.log(store.state, 44)
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../../static/css/main.less';
  .dot {
    display: inline-block;
    height: 4px;
    width: 4px;
    background: #999;
    margin: 3px;
    border-radius: 50%;

  }

  .shopbox {
    .shoplist {
      padding: 0;
    }
    .codeShowwrap {
      position: fixed;
      z-index: 100;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background: rgba(7, 17, 27, 0.8);
    }
    .codeShowwrap .codeShowBox {
      width: 7.75rem;
      height: 7.1875rem;
      position: relative;
      background: #fff;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      border-radius: 0.15625rem;
      padding-top: 0.65625rem;
    }
    .nodata {
      text-align: center;
      padding-bottom: 0.46875rem;
      background: white
    }
    .codeShowwrap .codeShowBox .close {
      position: absolute;
      width: 0.625rem;
      height: 0.625rem;
      background: #e0e0e0;
      border-radius: 50%;
      line-height: 0.625rem;
      text-align: center;
      right: -0.3125rem;
      top: -0.3125rem;
      z-index: 120;
    }
    .codeShowwrap .codeShowBox p {
      font-size: 0.359375rem;
      margin-left: 0.78125rem;
      color: #000;
    }
    .codeShowwrap .codeShowBox .codeWrap {
      width: 5.34375rem;
      height: 5.34375rem;
      margin: 0.46875rem auto 0 auto;
      display: block;
    }
    .codeWrap img {
      width: 150px;
    }
    .shoplist {
      /* padding-top 0.28125rem*/
      font-size: 0.38rem;
      background: #fff;
      margin-top: 0.3125rem;
    }
    .shoplist .goodsinfo {
      padding-left: 0.234375rem;
      padding-bottom: 0.15625rem;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      padding-top: 0.3rem;
      border-bottom: 0.0625rem solid #f1f1f2;
      align-items: center;
    }
    .shoplist .goodsinfo .img {
      width: 2.859375rem;
      height: 2.671875rem;
      margin-right: 0.46875rem;
      /* margin-top:0.25rem;
       margin-top: 0.625rem; */
      float: left;
      max-height: 2rem;
      overflow: hidden;
    }
    .shoplist .goodsinfo .img img {
      width: 100%;
    }
    .shoplist .goodsinfo .txtlist {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      line-height: 150%;
    }
    .shoplist .goodsinfo .tt,
    .shoplist .goodsinfo .dscp,
    .shoplist .goodsinfo .jf {
      font-size: 0.29rem;
    }
    .shoplist .goodsinfo .tt_txt1 {
      padding-right: 10px;
    }
    .shoplist .footinfo {
      /*  display: -webkit-box;
      display: -ms-flexbox;
      display: flex; */
      height: 1.4375rem;
      padding: 0 0.3rem;
      /*margin-bottom -0.46875rem*/
    }
    .shoplist .footinfo .date {
      /*   -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1; */
      font-size: 0.328125rem;
      line-height: 1.4375rem;
      text-align: center;
      float: left;
    }
    .shoplist .footinfo .code {
      float: right;
      /*  -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center; */
      margin-top: 0.28rem;
    }
    .shoplist .footinfo .code .codebtn {
      width: 2.1rem;
      background: #bf9d56;
      color: #fff;
      height: 0.75rem;
      line-height: 0.75rem;
      text-align: center;
      margin-left: 1.6rem;
      border-radius: 5px;
      -webkit-appearance: none;
      border: none;
    }
    .shoplist .footinfo .code .codebtn:disabled {
      background: #ccc;
    }
    .el-dialog__wrapper .el-dialog--center .el-dialog__body .small {
      font-size: 0.3rem;
    }
    .gift_lf {
      width: 3.6rem;
      text-align: right;
      display: inline-block;
    }
    .mask {
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0px;
      top: 0px;
      z-index: 2000;
    }

    .popbox {
      position: fixed;
      z-index: 99;
      width: 100%;
      height: 100%;
      left: 0px;
      top: 0px;
    }

    .popshow {
      position: absolute;
      left: 50%;
      top: 5%;
      width: 90%;
      margin-left: -45%;
      z-index: 2001;
      background: #fff;
      border-radius: 5px;
      padding-top: .3rem;
    }

    .popshow .cont {
      padding: 5px 20px 10px;
      line-height: 19px;
    }
    #qrcode {
      margin: 10px auto;
    }
    .icon_close {
      position: absolute;
      right: -0.2rem;
      top: -0.2rem;
    }

    .icon_close img {
      width: 0.625rem;
      height: auto;
    }

    .more {
      float: right;
      margin: 10px 20px 10px 0;
      text-decoration:underline;
      font-size:@ttsize2;
    }
  }
.small1{width: 88%;margin: 0 auto;}
  .small2{}
</style>
