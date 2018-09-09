<template>
  <div class="eventnewbox">
    <vueLoading v-show="vueload"></vueLoading>
    <div class="myevent2" v-for="item in eventdata" @click="getinfo(item)">
      <myeventlist :item="item"></myeventlist>
      <a href="javascript:void(0)" :class="[item.signin_status==0 || item.signin_status==null?'btn_view':'btn_view view_disabled']"
        @click="getinfo(item)">签到码</a>
      <div class="clear"></div>
    </div>
    <div v-if="nodata" class="nodata">
      <img src="~assets/images/mc/icon-index6.png">
      <br>您还没有已确认的活动哦</div>
    <el-dialog :title="bm_arr.camp_name" :visible.sync="dialogVisible1" :show-close = "dialog_close" width="80%" center :modal-append-to-body="false">
      <div class="popcode">
        <vue-qr :text="bmid" class="vueqr" width="150"></vue-qr>
        <!--<p><span class="event_lf">签到开始时间：</span><span class="gmfl">{{sub_date(bm_arr.signin_start)}}</span></p>-->
        <p><span class="event_lf">签到时间：</span><span class="gmfl">{{sub_date(bm_arr.signin_start)}}-{{sub_date(bm_arr.signin_end)}}</span></p>
        <p><span class="event_lf">场次时间：</span><span class="gmfl">{{sub_date(bm_arr.start_time)}}</span></p>
        <p><span class="event_lf">活动地点：</span><span class="gmfl">{{bm_arr.location}}</span></p>
        <p><span class="event_lf">报名人：</span><span class="gmfl">{{bm_arr.ui_name}}</span></p>
         <p><span class="event_lf">参与组数：</span><span class="gmfl">{{bm_arr.ui_group}}</span></p>
        <p><span class="event_lf">扣减积分：</span><span class="gmfl">{{bm_arr.point_subed}}</span></p>
          <!--（如有则显示分值，如无则显示0）-->
         <p><span class="event_lf">活动编码：</span><span class="gmfl">{{bm_arr.signin_code}}</span></p>
         <br>
        <div @click="dialogVisible1 = false"  class="btn_confirm">确定</div>

      </div>
    </el-dialog>
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
  import VueQr from 'vue-qr'
  var api = require('@/api/api')
  var getDatas=api.getDatas
  export default {
    data() {
      return {
        eventdata: [],
        vueload: true,
        dialogVisible2: false,
        nodata: false,
        dialogVisible1: false,
        dialog_close:false,
        bm_arr: [],
        bmid: ""
      }
    },
    components: {
      myeventlist,
      vueLoading,
      VueQr
    },
    created() {

      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    methods: {
       substr_date(time){
          return time.substr(0,16)
      },
      getinfo(item) {
        if (!(item.signin_status == 0) && item.signin_status != null) {
          return false
        }
        var id = item.id
        //获取报名信息
        var that = this
        that.dialogVisible1 = true
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001682',
          int_id: id
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              that.bm_arr = res.data.data[0]
              that.bmid = that.bm_arr.signin_code.toString()
            } else {
              that.popwarn1("报名信息获取失败", "提示")
            }
          }).catch(function (res) {

          });
      },
      getAlreadyEvent() {
        this.vueload = true
        console.log('ex')
        let params = {
          repCode: 'REP_001529',
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
      this.getAlreadyEvent()
      var int_id = this.$route.query.int_id
      //模板信息进入的页面
      if (int_id) {
        this.getinfo(int_id)
      }
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  .btn_view {
    float: right;
    margin: .15625rem .390625rem .15625rem;
    color: @yellow;
  }

  .popcode {
    text-align: center;
    padding-bottom:5px;
  }
 .popcode p{clear:both;}
  .view_disabled {
    color: #ccc;
  }
 .event_lf{float:left;width:3.3rem;text-align:right;}
 .btn_confirm{
   margin-top: 15px;
 }
</style>
