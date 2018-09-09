<template>
  <div class="exchange">
    <div class="banner">
      <img :src="goodInfo.coupon_image" class="bannerImg">
    </div>
    <div class="desc">
      <p class="nme">{{goodInfo.coupon_display_name}}</p>
    </div>
    <div class="count">
      <div class="bottom list">
        <label>领取截止日期:</label>
        <span v-if="goodInfo.exch_end_time">{{goodInfo.exch_end_time.replace('T',' ')}}</span>
      </div>
    </div>
    <div id="bulletin">
      <div class="tt">礼品详情:</div>
      <div class="dsp" v-html="phtml">
      </div>
    </div>
    <input class="btn" type="button" value="立即兑换" :disabled="!canEx" @click='exchangeGood'>
    <el-dialog title="" :visible.sync="dialogVisible1" width="90%" center>
      <center>
        <p>您已成功领取了{{quan_count}}张券，
          <br>可至我的卡券中查看</p>
      </center>
      <span slot="footer" class="dialog-footer">
        <el-button @click="gopark" class="confirmbtn">停车缴费</el-button>
        <el-button type="primary" @click="continueExchange" class="confirmbtn">继续领取</el-button>
      </span>
    </el-dialog>
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
        dialogVisible1: false,
        quan_count: "",
        gift_id: "",     
        phtml:""   
      }
    },
    created() {
      this.gift_id = this.$route.params.gift_id
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
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id + "/gift/" +
          this.gift_id
        let params = {}
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              that.goodInfo = res.data.data
              this.phtml = decodeURI(goodInfo.coupon_desc)
            } else {
              that.popwarn1(res.data.msg, "提示")
            }
          }).catch(function (res) {
            console.log(res);
          });
      },
      exchangeGood() { //礼品兑换
        this.canEx = false
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id +"/park/concou"
        let params = {
          coupon: this.goodInfo.id
        }
        that.$http.post(url, params)
          .then(res => {
            if (res.data.code == 0) {
              that.quan_count=res.data.data.length
              that.dialogVisible1=true
            } else {
              that.popwarn1(res.data.msg, "提示")
            }
            this.canEx = true
          }).catch(function (res) {
            console.log(res);
          });
      },
      gopark() { //停车缴费
        this.dialogVisible1 = false
        this.$router.push({
          name: 'park_money'
        })
      },
      continueExchange() { //继续领取
        this.$router.push({
          name: 'shoplist_coupons'
        })
      },
    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less';
   @import '../../static/css/exchange.less';
</style>
