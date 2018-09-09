<template>
  <div class="eventnewbox">
    <vueLoading v-show="vueload"></vueLoading>
    <div class="myevent1" v-for="item in eventdata" @click="getbm(item)">
      <myeventlist :item="item"></myeventlist>
      <div v-if="item.confirm_status==2">
      <div class="status_audit">不想参加的原因：{{item.confirm_reason}}</div>
      </div>
      <div v-else>
        <div v-if="item.audit_status==0">
          <div class="status_audit">审核状态：审核中</div>
        </div>
        <div v-if="item.audit_status==1">
          <div class="status_audit">审核状态：通过</div>
        </div>
        <div v-if="item.audit_status==2">
          <div class="status_audit">失败原因：{{item.audit_desc}}</div>
        </div>
      </div>
      <a href="javascript:void(0)" class="btn_view" @click="getbm(item)">查看详情</a>
      <div class="clear"></div>
    </div>
    <div v-if="nodata" class="nodata">
      <img src="~assets/images/mc/icon-index6.png">
      <br>您还没有已报名的活动哦</div>
    <el-dialog title="" :visible.sync="dialogVisible1" width="80%" center :modal-append-to-body="false">
      <center><h3 style="font-size: 1.6em;margin-bottom: 20px">{{poptt}}</h3></center>
      <!-- <div v-if="have_data.length>0">
        <p>活动：{{bm_arr.camp_name}}</p>
        <p>开始时间：{{substr_date(bm_arr.start_time)}}</p>
        <p>结束时间：{{substr_date(bm_arr.end_time)}}</p>
        <p>签到开始时间：{{substr_date(bm_arr.signin_start)}}</p>
        <p>地点：{{bm_arr.location}}</p>
        <p>参与组数：{{bm_arr.ui_group}}</p>
       //<p>如报名成功，将扣减相应积分</p
      </div>>-->
      <div v-if="have_data.length>0">
        <p>参与组数：{{bm_arr.ui_group}}</p>
        <!-- <p>如报名成功，将扣减相应积分</p>-->
      </div>
      <span v-if="bm_status==0">
        工作人员将在活动开始前
        <span style="color:red">5个工作日内</span>确认报名信息，请关注本服务号推送，或在会员中心-我的活动页面查看报名确认结果
        <br>如报名成功，将扣减相应积分
      </span>
      <span slot="footer" class="dialog-footer" v-if="bm_status==1 && bm_arr.confirm_status==0">
        <el-button type="primary" @click="refuse_bm" class="confirmbtn">计划有变</el-button>
        <el-button type="primary" @click="confirm_bm" class="confirmbtn">确认参加</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogVisible2" width="80%" center :modal-append-to-body="false">
      <center>
        <div style="margin-top:0.3rem">不想参加的原因：</div>
        <select v-model="refuse_reason" class="select">
          <option value="">请选择</option>
          <option value="不想参加">不想参加</option>
          <option value="临时有安排">临时有安排</option>
          <option value="参与同伴无法参加">参与同伴无法参加</option>
          <option value="其他">其他</option>
        </select>
      </center>
      <center style="padding-bottom:10px">
        <el-button type="primary" @click="confirm_refuse" class="confirmbtn">确认</el-button>
      </center>
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
        dialogVisible2: false,
        dialogVisible1: false,
        nodata: false,
        bm_arr: [],
        have_data: [],
        int_id: "",
        bm_status: "",
        refuse_reason: "",
        poptt: "请确认以下报名信息"
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
      confirm_refuse() {
        if (!this.refuse_reason) {
          this.popwarn1("请选择不想参加原因", "提示")
          return false
        }
        var that = this
        //不想参加的原因 start
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001718',
          int_id: that.int_id,
          var_confirm_reason: that.refuse_reason
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              this.dialogVisible2 = false
            } else {
              that.popwarn1("获取失败", "提示")
            }
          }).catch(function (res) {

          });
        //不想参加的原因 end
      },
      confirm_bm() {
        //确认报名
        var that = this
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001691',
          int_id: that.int_id,
          wechat_id: this.$store.state.id
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            that.dialogVisible1 = false
            if (res.data.code == 0) {
              that.getSignedEvent()
              that.popwarn1("确认成功，感谢您对成都IFS的支持", "提示")
            } else {
              that.popwarn1("报名失败", "提示")
            }
          }).catch(function (res) {

          });
      },
      refuse_bm() {
        var that = this
        //拒绝报名 start
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001717',
          int_id: that.int_id
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              that.dialogVisible1 = false
              that.dialogVisible2 = true
              that.getSignedEvent()
            } else {
              that.popwarn1("获取失败", "提示")
            }
          }).catch(function (res) {

          });
        //拒绝报名 end
      },
      getSignedEvent() { //已报名列表
        console.log('ex')
        this.vueload = true
        let params = {
          repCode: 'REP_001528',
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
      },
      getbm(item) { //获取报名信息
        var id = item.id
        var status = item.audit_status
        var that = this
        that.dialogVisible1 = true;
        that.int_id = id
        if (status != 1) {
          //that.poptt = "报名信息"
          that.poptt = "报名审核中"
        }
        that.bm_status = status //是否审核
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001681',
          int_id: id
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              that.have_data = res.data.data
              that.bm_arr = res.data.data[0]
              that.bm_arr["confirm_status"] = item.confirm_status  //是否确认
            } else {
              that.popwarn1("报名信息获取失败", "提示")
            }
          }).catch(function (res) {

          });
      },
       substr_date(time){
          return time.substr(0,16)
      }
    },
    mounted() {
      this.getSignedEvent()
      var int_id = this.$route.query.int_id
      //模板信息进入的页面
      if (int_id) {
        this.getbm(int_id, 1)
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

  .status_audit {
    float: left;
    margin: .15625rem 0 0 .390625rem;
    color: #999;
  }

  .select {
    border: 1px solid #ccc;
    padding-left: .390625rem;
    border-radius: .078125rem;
    height: 1rem;
    margin: 0.2rem auto .46875rem auto;
    line-height: 0.6rem;
    font-size: @popsize;
    -webkit-appearance: none;
    background: #fff;
    padding-right: 20px;
    background: url(~assets/images/mc/icon-arror.png) 95% center no-repeat;
    background-size: auto 0.16rem;
  }

</style>
