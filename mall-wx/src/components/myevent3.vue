<template>
  <div class="myeventnewbox">
    <vueLoading v-show="vueload"></vueLoading>
    <div class="myevent2" v-for="item in eventdata">
      <myeventlist :item="item"></myeventlist>
      <div class="btn_view">已过期</div>
      <div class="clear"></div>
    </div>
    <div v-if="nodata" class="nodata">
      <img src="~assets/images/mc/icon-index6.png">
      <br>您还没有已过期的活动哦</div>
  </div>
</template>
<style>
  .eventnewbox .vue-loading {
    position: fixed;
    left: 50%;
    margin-left: -25px;
    top: 40%;
    z-index: 2;
  }

</style>
<script>
  import vueLoading from '../components/vueload'
  import myeventlist from '../components/public/myeventlist'
  /* import {
    getDatas
  } from '@/api/api' */
   var api = require('@/api/api')
  var getDatas=api.getDatas
  export default {
    data() {
      return {
        eventdata: [],
        vueload: true,
        nodata: false
      }
    },
    components: {
      myeventlist,
      vueLoading
    },
    created() {

      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    methods: {
      getExpireEvent() {
        console.log('ex')
        this.vueload = true
        let params = {
          repCode: 'REP_001530',
          arg_mall: 1,
          arg_wechator_id: this.$store.state.id,
        }
        getDatas(params).then((res) => {
          console.log(res)
          this.vueload = false
          this.eventdata = res.data
          if (this.eventdata.length <= 0) {
            this.nodata = true
          }
        }).catch(function (res) {
          this.vueload = false
          console.log(res);
        });
      }
    },
    mounted() {
      this.getExpireEvent()
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  .btn_view {
    float: right;
    margin: .15625rem .390625rem .15625rem;
  }

</style>
