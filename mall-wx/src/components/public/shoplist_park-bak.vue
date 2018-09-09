<template>
  <div>
    <vueLoading v-show="vueload"></vueLoading>
    <div class="">
      <div class="shoplist" v-for='item in goodList'>
        <div class="img">
          <img :src="item.coupon_icon">
        </div>
        <div class="txtlist">
          <div class="tt tt2" v-if='item.countdowns2'>
            <span class="tt_txt1">即将上线：</span>
            <VueCountdown :time=item.countdowns2>
              <template slot-scope="props">
                <span>
                  <span class="time">{{ props.days }}</span>&nbsp;天</span>
                <span class="time">{{ props.hours }}</span>&nbsp;:
                <span class="time">{{ props.minutes }}</span>&nbsp;:
                <span class="time">{{ props.seconds }}</span>
              </template>
            </VueCountdown>
          </div>
          <div class="tt tt1" v-if='item.countdowns'>
            <span class="tt_txt1">距结束</span>
            <VueCountdown :time=item.countdowns>
              <template slot-scope="props">
                <span>
                  <span class="time">{{ props.days }}</span>&nbsp;天</span>
                <span class="time">{{ props.hours }}</span>&nbsp;:
                <span class="time">{{ props.minutes }}</span>&nbsp;:
                <span class="time">{{ props.seconds }}</span>
              </template>
            </VueCountdown>
          </div>
          <div class="tt tt1" v-if='item.end'>
            <span class="tt_txt1">已结束</span>
          </div>
          <div class="dscp">{{item.coupon_display_name}}</div>
          <div class="jf" v-if="item.coupon_point">{{item.coupon_point}}积分</div>
          <div class="btnbox">
            <span class="btn_end" v-if='item.countdowns2'>即将上线</span>
            <a to="" class="btn_th" @click='toExchange(item)' v-if='!item.end && !item.countdowns2'>立即兑换</a>
            <span class="btn_end" v-if='item.end'>已结束</span>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import vueLoading from '../../components/vueload'
  import VueCountdown from '@xkeshi/vue-countdown'
  /* import {
    getDatas
  } from '@/api/api' */
  export default {
    data() {
      return {
        vueload: false,
        mypoint: 0,
        hour: "",
        minute: "",
        second: "",
        endTime: "",
        content: "",
        txtday: "",
        txthour: "",
        txtmin: "",
        txtsec: "",
        goodList: []
      }
    },
    components: {
      VueCountdown,
      vueLoading
    },

    methods: {
      getGoodList(newparam) {
        this.goodList=[]
        this.vueload = true
        /*===积分商城列表 start===*/
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id + "/gift/list"
        let params = newparam
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              var that = this
              that.vueload = false
              var data = res.data.data
              data.forEach((item) => {
                if (item.exch_start_time) {
                  item.countdowns2 = that.countdown(item.exch_start_time)
                }
                if (item.countdowns2) {
                  item.countdowns = false
                } else {
                  if (item.exch_end_time) {
                    item.countdowns = that.countdown(item.exch_end_time)
                  }
                }
                if (item.exch_end_time) {
                  item.end = that.countdown2(item.exch_end_time)
                }
                // console.log(item)
              })
              that.goodList = data
            } else {
              that.popwarn1(res.data.msg, "提示")
            }
          }).catch(function (res) {
            console.log(res);
          });
        /*===积分商城列表 end===*/
      },
      countdown(timestamp) {
        timestamp = timestamp.replace(/\-/g, "/");
        timestamp = timestamp.replace("T", " ");
        let self = this;
        let nowTime = Date.parse(new Date());
        let endTime = Date.parse(timestamp);
        let t = endTime - nowTime;
        if (t > 0) {
          return t
        }
      },
      countdown2(timestamp) {
        timestamp = timestamp.replace(/\-/g, "/");
        timestamp = timestamp.replace("T", " ");
        let self = this;
        let nowTime = Date.parse(new Date());
        let endTime = Date.parse(timestamp);
        let t = endTime - nowTime;
        if (t <= 0) {
          return true
        } else {
          return false
        }
      },
      exchange(idx, search) { //名称和分类搜索
        this.category = idx
        if (idx == 0) {
          idx = ''
        }

        this.name = search
        this.getGoodList({//getGoodList传参修改
          category_id: idx,
          fstr: search,
          coupon: 2
        })
      },
      toExchange(item) {
        this.$router.push({
          name: 'exchange',
          params: {
            gift_id: item.id
          }
        })
      },
    },

    created() {
      this.mypoint = this.$store.state.member.memberpoint
    },
    mounted() {
      var category_id=""
      this.getGoodList({
        coupon: 1,
        category_id:category_id,
        fstr: "",
      })
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../../static/css/main.less';
  @import '../../../static/css/shoplist.less';
  .shopbox {
    background: #eceff5;
  }
</style>
