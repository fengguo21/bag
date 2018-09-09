<template>
  <div class="exchange">
    <div class="banner">
      <img :src="goodInfo.coupon_image" class="bannerImg">
    </div>
    <div class="desc">
      <p class="nme">{{goodInfo.coupon_display_name}}</p>
    </div> 
    <div id="bulletin">
      <div class="tt">礼品详情:</div>
      <div class="dsp">{{goodInfo.coupon_desc}}
      </div>
    </div>
    <input class="btn" type="button" :value="btn_text" :disabled="!canEx" @click='exchangeGood'>


  </div>
</template>
<script type="text/javascript">
  /* import {
    getDatas,
    exchangeGift
  } from '@/api/api' */
  export default {
    data() {
      return {
        canEx: true,
        gifT: '礼品',
        goodInfo: [],
        goodName: '',
        msg: '',
        count: 1,
        num1: 1,
        dialogshow: false,
        dialogshow2: false,
        gift_id: "",
        btn_text: "立即领取"
      }
    },
    created() {
      this.gift_id = this.$route.query.gift_id
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {

      this.get_exchange()
    },
    methods: {

      get_exchange() { //获取礼品详情
        var that = this
        let url = that.global_config.datapost.codeurl + "/restful/api/mall/ifs/coupons/transfered/" + that.gift_id
        let params = {}
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            var data = res.data
            if (data.id) {
              that.goodInfo = data
            } else {
              that.btn_text = '已领取'
              that.popwarn1("获取礼品失败", "提示")
            }
          }).catch(function (res) {
            that.btn_text = '已领取'
            console.log(res);
          });
      },
      exchangeGood() { //礼品兑换   
       var succ=false     
        var that = this
        that.canEx = false
        let url = that.global_config.datapost.codeurl + "/restful/api/mall/ifs/coupons/transfered/" + that.gift_id +
          "/receive/"
        let params = {
          user: that.$store.state.id,
          coupon: that.goodInfo.id,
          mall: 1,
          openid: that.$store.state.openid
        }
        that.$http.post(url, params)
          .then(res => {
            var data = res.data
            console.log(data)
            console.log(data.status)
            if (data.id) {//有数据
              that.$alert("您已领取成功", '提示', {
                confirmButtonText: '确定',
                center: true,
                callback: action => {
                  that.$router.push({
                    name: "mycard1"
                  })
                }
              });
              succ=true
            }
            else
            {
              this.popwarn1("券领取失败", "提示")
            }
          }).catch(function (res) {
            console.log(res);
          });
        // this.canEx = true
      },
      handleChange() {}
    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less';
  .exchange {
    .banner img {
      width: 100%;
      vertical-align: bottom;
    }
    .desc .nme {
      background: #d6bb8e;
      padding: .3125rem .859375rem;
      font-size: @ttsize2;
      color: #fff;

    }
    .count {
      padding-left: .859375rem;
      background: url('~assets/images/mc/detail-bg01.jpg') center bottom no-repeat;
      background-size: 100% 0.5rem;
      padding-bottom: .5rem;
    }
    .count .score {
      color: @yellow;
      font-weight: bold;
      font-size: @ttsize3;
    }
    .count .el-input-number--mini {
      float: right;
      width: 2.34375rem;
      margin-right: .46875rem;
    }
    .count .el-input-number--mini .el-input__inner {
      padding-left: 0rem;
      padding-right: 0rem;
    }
    .el-input-number--mini .el-input-number__decrease,
    .el-input-number--mini .el-input-number__increase {
      width: .734375rem;
    }
    .count .list {
      padding: .3125rem 0;
      border-bottom: .015625rem solid #e5e5e5;
    }
    .count .list label {
      font-weight: bold;
    }
    .count .bottom {
      border-bottom: none;
      color: #b8b8b8;
    }
    #bulletin {
      padding: 0.390625rem 0 0.78125rem 0.859375rem;
      background: url('~assets/images/mc/detail-bg02.jpg') center bottom no-repeat;
      background-size: 100% auto;
    }
    #bulletin .tt {
      font-size: @ttsize;
      padding-bottom: .3125rem;
      border-bottom: .015625rem solid #e5e5e5;
    }
    #bulletin .dsp {
      padding: .46875rem 0;
    }
    .btn {
      background: #393939;
      display: block;
      width: 93%;
      margin: .28125rem auto;
      border-radius: @radius;
      border: none;
      background: #474747;
      color: @yellow;
      height: 1.171875rem;
      font-size: @btnmidsize;
    }
  }

  .codeShowwrap {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(7,
    17,
    27,
    0.8);
    .codeShowBox {
      width: 7.75rem;
      position: relative;
      background: white;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 0.15625rem;
      padding-top: 1.171875rem;
      padding-bottom: 0.78125rem;
    }
    .close {
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
    p {
      font-size: 0.4375rem;
      text-align: center;
      margin: 0 1.171875rem 0 1.171875rem;
      color: black;
      line-height: 1.3;
    }
    .options {
      display: flex;
      font-size: 0.390625rem;
      margin-top: 0.78125rem;
    }

    .btnwrap {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    .innerbtn {
      width: 2.65625rem;
      height: 1.0rem;
      border: 0.015625rem solid #be9d56;
      line-height: 1.0rem;
      text-align: center;
      border-radius: 0.078125rem;
    }
  }

</style>
