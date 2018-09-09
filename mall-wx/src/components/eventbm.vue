<template>
  <div class="eventbm">
    <div class="inputbox">
      <b class="red">*</b>&nbsp;&nbsp;姓名：
      <input type="text" placeholder="请输入姓名" v-model="var_ui_name">
    </div>
    <div class="inputbox">
      <b class="red">*</b>&nbsp;&nbsp;手机号：
      <input type="text" placeholder="请输入手机号" v-model="var_ui_phone">
    </div>
    <div class="inputbox">
      <b class="red">*</b>&nbsp;&nbsp;参与组数：
      <select v-model="var_ui_group">
        <option value="">请选择参与组数</option>
        <option v-for="option in group" :value="option">{{option}}</option>
      </select>
    </div>
    <div class="dscp">说明：{{brief}}</div>
    <div class="tt">
      <b class="red">*</b>&nbsp;&nbsp;场次</div>
    <div v-if="multi_part==0">
      <el-radio-group v-model="round_id" size="mini">
        <el-radio-button :label="option.round_id" v-for="option in round_arr" :disabled="option.disabled"  v-if="option.round_name">{{option.round_name}}
          <div v-if="FormatDate(option.start_time)==FormatDate(option.end_time)">
            {{FormatDate(option.start_time)}}
            <br>{{FormatTime(option.start_time)}}&nbsp;-{{FormatTime(option.end_time)}}
          </div>
          <div v-else>
            {{FormatDate(option.start_time)}}&nbsp;&nbsp;{{FormatTime(option.start_time)}}&nbsp;-
            <br>{{FormatDate(option.end_time)}}&nbsp;&nbsp;{{FormatTime(option.end_time)}}
          </div>
        </el-radio-button>
      </el-radio-group>
    </div>
    <div v-else>
      <el-checkbox-group v-model="round_id2" size="small">
        <el-checkbox-button :label="option.round_id" v-for="option in round_arr" :disabled="option.disabled" v-if="option.round_name">{{option.round_name}}
          <div v-if="FormatDate(option.start_time)==FormatDate(option.end_time) && option.round_name">
            {{FormatDate(option.start_time)}}
            <br>{{FormatTime(option.start_time)}}&nbsp;-{{FormatTime(option.end_time)}}
          </div>
          <div v-else>
            {{FormatDate(option.start_time)}}&nbsp;{{FormatTime(option.start_time)}}&nbsp;-
            <br>{{FormatDate(option.end_time)}}&nbsp;&nbsp;{{FormatTime(option.end_time)}}
          </div>
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
    <input type="button" class="btn_bm" @click="handle_confirm" value="报名" :disabled="disabled_bm1"></input>
    <el-dialog title="请确认以下报名信息" :visible.sync="dialogVisible1" width="90%" center>
      <p class="line1">活动:{{bm_arr.camp_name}}</p>
      <div class="line1" v-for="item in select_round" v-if="$store.state.member.gradenme!='非会员'  ">
        <p>场次:
          <span class="yellow">{{item.round_name}}</span>
        </p>
        <p>起止时间:{{FormatDate(item.start_time)}}&nbsp;{{FormatTime(item.start_time)}}-{{FormatDate(item.end_time)}}&nbsp;{{FormatTime(item.end_time)}}</p>
      </div>
      <p>地点:{{bm_arr.location}}</p>
      <p>参与组数:{{var_ui_group}}</p>
      <p>如报名成功，将扣减相应积分</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false" class="confirmbtn">再看看</el-button>
        <el-button type="primary" @click="confirm_bm" class="confirmbtn">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        round_id: "",
        round_id2: [],
        round_arr: [], //参与场次
        group: [], //参与组数
        dialogVisible1: false,
        camp_id: "", //活动id
        multi_part: 0,
        var_ui_group: "",
        var_ui_name: "",
        var_ui_phone: "",
        brief: "",
        int_id: "", //生成的活动id,
        bm_arr: [],
        round_list: [],
        select_round: [],
        disabled_bm1: false
      }
    },
    created() {
      var that = this
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {
      this.camp_id = this.$route.query.camp_id
      this.var_ui_phone = this.$store.state.member.phone
      this.var_ui_name = this.$store.state.member.membername
      this.getGroup()
      this.getMulti()
    },
    methods: {
      handle_confirm() {
        if (this.validate()) {
          return false
        }
        this.getbm()
        // this.postbm()

      },
      ParseDate(s) { // 将字串解析成日期值
        var dv = new Date(Date.parse(s.replace(/-/g, "/")))
        return dv
      },
      postbm() { //确认报名
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id +
          "/campaign/subscribe"
        var var_round_id = []
        if (that.multi_part == 0) {
          var_round_id.push(this.round_id)
        } else {
          var_round_id = this.round_id2
        }
        let params = {
          campaign: that.camp_id,
          round: var_round_id,
          group: that.var_ui_group,
          name: that.var_ui_name,
          phone: that.var_ui_phone
        }
        that.$http.post(url, params)
          .then(res => {
            if (res.data.code == 0) {
              /*===会员信息 start===*/
              var message = ""
              var msg_title = ""
              var session_type = sessionStorage.getItem("audit_type")
              if (session_type == 0) // 0无需审核
              {
                message = "报名成功"
                msg_title = "提示"
              } else // 1人工审核
              {
                msg_title = "报名信息已提交"
                message = "工作人员将在活动开始前<span style='color:red'>5个工作日内</span>确认报名信息，请关注本服务号推送，或在会员中心-我的活动页面查看报名确认结果"
              }
              that.dialogVisible1 = false
              that.$alert(message, msg_title, {
                confirmButtonText: '确定',
                dangerouslyUseHTMLString:true,
                type: 'warning',
                confirmButtonClass: "confirmbtn_1",
                center: true,
                callback: action => {
                  that.$router.push({
                    name: 'myevent'
                  })
                }
              });
              /*===会员信息 end===*/
            } else {
              that.dialogVisible1 = false
              that.$confirm(res.data.msg, '提示', {
                confirmButtonText: '回活动页',
                cancelButtonText: '再看看',
                type: 'warning',
                center: true
              }).then(() => {
                that.$router.push({
                  name: 'event'
                })
              }).catch(() => {
              });
            }
          }).catch(function (res) {
            console.log(res);
          });

      },
      getbm() { //获取报名信息
        var that = this
        that.select_round = []
        //单场场次选择 start
        if (that.round_id != "") {
          that.round_arr.forEach((item) => {
            if (item.round_id == that.round_id) {
              that.select_round.push(item)
            }
          })
        } else { //多场场次选择 start
          that.round_id2.forEach((item1) => {
            that.round_arr.forEach((item2) => {
              if (item1 == item2.round_id) {
                that.select_round.push(item2)
              }
            })
          })
        }
        //获取报名详情
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001526',
          id: that.camp_id,
          wechat_id: this.$store.state.id
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              that.bm_arr = res.data.data[0]
              that.round_list = res.data.data
              that.dialogVisible1 = true;
            } else {
              that.popwarn1("报名信息获取失败", "提示")
            }
          }).catch(function (res) {

          });
      },
      confirm_bm() { //确认报名
        var that = this
        that.postbm()
      },
      validate() {
        if (!this.var_ui_name) {
          this.popwarn1('请输入姓名', '提示')
          return true
        }
        if (!this.var_ui_phone) {
          this.popwarn1('请输入手机号', '提示')
          return true
        }
        if (!this.var_ui_group) {
          this.popwarn1('请选择参与组数', '提示')
          return true
        }
        if (this.multi_part == 0 && this.round_id == "") {
          this.popwarn1('请选择场次', '提示')
          return true
        }
        if (this.multi_part == 1 && this.round_id2.length <= 0) {
          this.popwarn1('请选择场次', '提示')
          return true
        }
        return false
      },
      FormatDate(strTime) {
        if (strTime) {
          var strTime = strTime.replace(/\-/g, "/")
          var date = new Date(strTime)
          return (date.getMonth() + 1) + "/" + date.getDate()
        }
      },
      FormatTime(strTime) {
        if (strTime) {
        var strTime = strTime.replace(/\-/g, "/")
        var date = new Date(strTime)
        var hours = date.getHours()
        var Minutes = date.getMinutes()
        if (hours < 10) {
          hours = "0" + hours
        }
        if (Minutes < 10) {
          Minutes = "0" + Minutes
        }
        return (hours + ":" + Minutes)
        }
      },
      getGroup() { //获取参与组数
        var that = this
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001665',
          var_campaign_id: that.camp_id
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            var group_max = res.data.data[0].group_limit_per_sub
            for (var i = 1; i <= group_max; i++) {
              that.group.push(i)
            }
          }).catch(function (res) {

          });
      },
      getRound() { //获取场次
        var that = this
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001390',
          camp_id: that.camp_id
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            that.round_arr = res.data.data
            //判断场次是否可选 start
            var arr=that.round_arr 
            var disabled_length=0
            for(var i = 0;i < arr.length; i++) 
            {
              var is_where1=new Date() >= that.ParseDate(arr[i].subscribe_start) && new Date() <= that.ParseDate(arr[i].subscribe_end)
              var is_where2=arr[i].point=="非会员" || arr[i].point.indexOf(that.$store.state.member.gradenme)>=0
              if(is_where1 && is_where2)
               {
                 that.round_arr[i]["disabled"]=false
               }
               else
               {
                 that.round_arr[i]["disabled"]=true
                 disabled_length++
               }
            }
            if(disabled_length==arr.length)
            {
              that.disabled_bm1=true
            }
             //判断场次是否可选 end
            var round_date = new Date() >= that.ParseDate(that.round_arr[0].subscribe_start) && new Date() <= that.ParseDate(
              that.round_arr[0].subscribe_end)
            if (!(round_date)) {
              return false
            }           
            if (that.round_arr.length == 1 && that.multi_part == 0) { //单场次
              that.round_id = that.round_arr[0].round_id
            }
            if (that.round_arr.length == 1 && that.multi_part == 1) { //多场次
              that.round_id2.push(that.round_arr[0].round_id)
            }
          }).catch(function (res) {

          });
      },
      getMulti() { //场次可单选或者多选
        var that = this
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001673',
          var_campaign_id: that.camp_id
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            that.multi_part = res.data.data[0].multi_part
            this.brief = res.data.data[0].brief
            this.getRound()
          }).catch(function (res) {

          });
      },
    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less';
  .eventbm {
    width: 90%;
    margin: 0px auto;
    padding-top: 0.5rem;
    .inputbox {
      border: 1px solid #ccc;
      padding-left: .390625rem;
      border-radius: .078125rem;
      height: 1rem;
      margin: 0rem auto .46875rem auto;
      line-height: 1rem;
      font-size: @popsize;
    }

    .inputbox input,
    .inputbox select {
      background: none;
      height: 95%;
      width: 60%;
      border: none;
      -webkit-appearance: none;
    }
    .inputbox select {
      background: url(~assets/images/mc/icon-arror.png) right center no-repeat;
      background-size: auto 0.16rem;
    }
    .btn_bm {
      .btn_bigyellow(@width: 100%)
    }
    .dscp {
      color: red;
      margin-bottom: .15625rem;
    }
    .tt {
      font-weight: bold;
      margin: 0.3rem 0;
      color: @yellow;
      font-size: @ttsize2;
    }
  }

  .el-dialog .inputbox select,
  .eventbm .inputbox select {
    width: 70%;
  }

  .el-radio-button,
  .el-radio-button__inner,
  .el-checkbox-button,
  .el-checkbox-button__inner {
    margin-left: .25rem;
    margin-bottom: 10px;
  }

  .el-radio-button--mini .el-radio-button__inner {
    line-height: 150%;
  }

  /* .line1{border-bottom:1px solid #ccc;} */

</style>
