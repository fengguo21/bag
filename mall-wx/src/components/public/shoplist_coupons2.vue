<template>
  <div>
    <div class="tt1">你今日消费{{consume}}元，可兑换以下停车券</div>
    <vueLoading v-show="vueload"></vueLoading>
    <div class="shopbox">
      <div class="shoplist" v-for='item in goodList'>
        <div class="img">
          <img :src="item.coupon_image">
        </div>
        <div class="txtlist">
          <div class="dscp">{{item.coupon_name}}</div>
          <div class="btnbox">
            <a to="" class="btn_th" @click='toExchange(item)'>立即兑换</a>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <div v-if="nodata" class="nodata">
      <img src="~assets/images/mc/icon-index5.png">
      <br>{{errormsg}}</div>
  </div>
</template>
<script type="text/javascript">
  import vueLoading from '../../components/vueload'
/*   import {
    getDatas
  } from '@/api/api' */
  export default {
    data() {
      return {
        vueload: true,
        consume:"",
        nodata:false,
        errormsg:"",
        goodList: [],    
      }
    },
    components: {
      vueLoading
    },
    methods: {
      getGoodList(newparam) {//获取消费券列表      
        var that = this
        this.vueload = true
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id + "/park/concou"
        let params = newparam
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            var data=res.data.data
            if (res.data.code == 0) {
              that.vueload = false              
              that.consume=data.consume
              that.goodList = data.coupons
            } else {
              that.vueload = false
               that.consume=data.consume
              this.nodata=true
              this.errormsg=res.data.msg
            }
          }).catch(function (res) {
            console.log(res);
          });
      },
      toExchange(item) {//积分兑换
        this.$router.push({
          name: 'exchange_coupons',
          params: {
            gift_id: item.id
          }
        })
      },
    },
    created() {
      this.getGoodList()
      this.mypoint = this.$store.state.member.memberpoint
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {}
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../../static/css/main.less';
  @import '../../../static/css/shoplist.less';
  .shopbox {
    background: #eceff5;
  }

  .tt1 {
    text-align: center;
    color: @yellow;
    border-bottom: .3125rem solid #eceff5;
    padding: 0.3rem 0;
    font-size: @ttsize;
  }

</style>
