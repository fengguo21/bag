<template>
  <div class="exchange">
    <div class="banner">
      <img :src="goodInfo.coupon_image" class="bannerImg">
    </div>
    <div class="desc">
      <p class="nme">{{goodInfo.coupon_display_name}}</p>
    </div>
    <div class="count">
      <div class="score list">{{goodInfo.coupon_point}}积分</div>
      <div class="top list">
        <label>兑换数量</label>
        <el-input-number v-model="count" size='mini' @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
        <div class="clearfix"></div>
      </div>
      <div class="bottom list">
        <label>领取截止日期:</label>
        <span>{{goodInfo.exch_end_time}}</span>
      </div>
    </div>
    <div id="bulletin">
      <div class="tt">礼品详情:</div>
      <div class="dsp">{{goodInfo.coupon_desc}}
      </div>
    </div>
    <input class="btn" type="button" value="立即兑换" :disabled="!canEx" @click='exchangeGood'>
    <div class="codeShowwrap" v-if='dialogshow'>
      <div class="codeShowBox">
        <div class="close" @click='hideCode'>
          X
        </div>
        <p>您本次兑换了{{count}}个{{goodInfo.coupon_display_name}},消耗了{{count*goodInfo.coupon_point}}积分</p>
        <div class="options">
          <div class="btnwrap">
            <div class="innerbtn" @click='continueExchange'>继续兑换</div>
          </div>
          <div class="btnwrap">
            <div class="innerbtn" @click="viewgift(goodInfo)">查看{{gifT}}</div>
          </div>
        </div>

      </div>
    </div>
    <div class="codeShowwrap" v-if='dialogshow2'>
      <div class="codeShowBox">
        <div class="close" @click='dialogshow2 = false'>
          X
        </div>
        <p>{{msg}}</p>
        <div class="options">
          <div class="btnwrap">
            <div class="innerbtn" @click='continueExchange'>继续兑换</div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
 /*  import {
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
        gift_id: ""
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
      get_exchange() {//获取礼品详情
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id + "/gift/"+this.gift_id 
        let params = {
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {             
              that.goodInfo=res.data.data
            } else {
              that.popwarn1(res.data.msg, "提示")
            }
          }).catch(function (res) {
            console.log(res);
          });
      },
      viewgift(goodInfo) {//查看礼品，查看卡券
         if(this.goodInfo.coupon_flag==3){ //卡券
          this.$router.push({
            name: 'mycard1_park'
          })
        } else { //礼品
          this.$router.push({
            name: 'myGift'
          })
        }
      },
      continueExchange() {
        this.$router.push({
          name: 'shoplist_park'
        })
      },
      hideCode() {
        this.dialogshow = false
      },
      showdialog() {
        this.dialogshow = true
      },
      exchangeGood() { //礼品兑换
        this.canEx = false
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id + "/gift/exchange"
        let params = {
           gift: this.goodInfo.id,
           coupon: this.goodInfo.coupon_flag,
           quantity: this.count,
           point: this.$store.state.member.memberpoint           
        }
        that.$http.post(url, params)
          .then(res => {
            if (res.data.code == 0) {             
               this.dialogshow = true
               if(this.goodInfo.coupon_flag==3)
               {this.gifT = '卡券'}
               else
               {this.gifT = '礼品'}
            } else {
              this.msg = res.data.msg
               this.dialogshow2 = true
            }
              this.canEx = true
          }).catch(function (res) {
            console.log(res);
          });
      },
      handleChange() {}
    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less';
   @import '../../static/css/exchange.less';
</style>
