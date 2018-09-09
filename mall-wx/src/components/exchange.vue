<template>
  <div class="exchange">
    <div class="banner">
      <img :src="goodInfo.coupon_image" class="bannerImg">
    </div>
    <div class="desc">
      <p class="nme">{{goodInfo.coupon_display_name}}</p>
    </div>
    <div class="count">
      <div class="score list" v-if="goodInfo.sp">{{goodInfo.coupon_point_sp}}积分</div>
      <div class="score list" v-else>{{goodInfo.coupon_point}}积分</div>
      <div class="top list">
        <label>兑换数量</label>
        <el-input-number v-model="count" size='mini' @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
        <div class="clearfix"></div>
      </div>
      <div class="bottom list">
        <label>领取截止日期:</label>
        <span v-if="goodInfo.expire_time">{{sub_date(goodInfo.expire_time.replace('T',' '))}}</span>
      </div>
    </div>
    <div id="bulletin">
      <div class="tt">礼品详情:</div>
      <div class="dsp" v-html="phtml" v-if="goodInfo.coupon_desc">
      </div>
    </div>
    <input class="btn" type="button" value="立即兑换" :disabled="!canEx" @click='dialogshow=true'>
    <!--兑换确认弹框1-->
    <div class="codeShowwrap" v-if='dialogshow'>
      <div class="codeShowBox">
        <div class="close" @click='hideCode'>
          X
        </div>
        <p>是否确认兑换{{count}}个{{goodInfo.coupon_display_name}},将消耗您
          <span v-if="goodInfo.sp">{{count*goodInfo.coupon_point_sp}}</span>
          <span v-else>{{count*goodInfo.coupon_point}}</span>
          积分</p>
        <!--<p>您本次兑换了{{count}}个{{goodInfo.coupon_display_name}},消耗了
          <span v-if="goodInfo.sp">{{count*goodInfo.coupon_point_sp}}</span>
          <span v-else>{{count*goodInfo.coupon_point}}</span>
          积分</p>-->
        <div class="options">
          <div class="btnwrap">
            <div class="innerbtn" @click='dialogshow=false'>再看看</div>
          </div>
          <div class="btnwrap">
            <div class="innerbtn" @click="func_confirm">确认</div>
          </div>
        </div>

      </div>
    </div>
    <!--兑换确认弹框2-->
    <div class="codeShowwrap" v-if='dialogshow_confirm'>
      <div class="codeShowBox">
        <div class="close" @click='hideCode'>
          X
        </div>
        <p>兑换成功</p>
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
    <!--错误信息弹窗-->
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
        dialogshow_confirm: false,
        gift_id: "",
        phtml: ""
      }
    },
    created() {
      this.gift_id = this.$route.params.gift_id
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {
      sessionStorage.removeItem('panel_num1')
      this.get_exchange()

    },
    methods: {
      func_confirm() {//确认弹框
        this.exchangeGood()//兑换礼品
      },
      ParseDate(s) { // 将字串解析成日期值
        var dv = new Date(Date.parse(s.replace("T", " ")))
        return dv
      },
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
              var goodInfo = that.goodInfo
              this.phtml = decodeURI(goodInfo.coupon_desc)
              if (new Date() >= that.ParseDate(goodInfo.exch_start_time_sp) && new Date() <= that.ParseDate(goodInfo.exch_end_time_sp)) {
                goodInfo.sp = true
              } else {
                goodInfo.sp = false
              }
            } else {
              that.popwarn1(res.data.msg, "提示")
            }
          }).catch(function (res) {
            console.log(res);
          });
      },
      viewgift(goodInfo) { //查看礼品，查看卡券
        if (this.goodInfo.coupon_flag == 3) { //卡券
          this.$router.push({
            name: 'mycard1'
          })
        } else { //礼品
          this.$router.push({
            name: 'myGift'
          })
        }
      },
      continueExchange() {
        this.$router.push({
          name: 'shopmall'
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
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id +
          "/gift/exchange"
        let params = {
          gift: this.goodInfo.id,
          coupon: this.goodInfo.coupon_flag,
          quantity: this.count,
          point: this.$store.state.member.memberpoint
        }
        that.$http.post(url, params)
          .then(res => {
            if (res.data.code == 0) {
               this.dialogshow = false//隐藏兑换第1个弹窗
               this.dialogshow_confirm = true//显示兑换成功弹窗
              if (this.goodInfo.coupon_flag == 3) {
                this.gifT = '卡券'
              } else {
                this.gifT = '礼品'
              }
            } else {
              this.msg = res.data.msg
              this.dialogshow = false//隐藏兑换第1个弹窗
              this.dialogshow2 = true//显示错误信息弹框
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
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  @import '../../static/css/exchange.less';

</style>
