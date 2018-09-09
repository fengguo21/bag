<template>
  <div class="signbox">
    <!--input cont start-->
    <div class="inputcont">
      <div class="inputtxt">
        <span class="scanimg" @click="scancode">
          <img src="~assets/images/mc/icon-scan.png">
        </span>
        <input type="text" class="gmfl" v-model="scan_txt"></input>
      </div>
      <div class="col_2">
        <input type="button" value="查询" class="btnquery" @click="savecode">
      </div>
    </div>
    <div class="eventbox" v-if="sign_arr.camp_name">
      <h1>活动名称:{{sign_arr.camp_name}}</h1>
      <div class="cont">
        <p>会员名：{{sign_arr.member_info}}</p>
        <p>参组人数:{{sign_arr.participant_count}}</p>
        <p>场次：{{sign_arr.round_name}}</p>
        <input type="button" value="签到" class="btn_sign" @click="btnsign">
      </div>
    </div>
  </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  .inputtxt {

    border: 1px solid #ccc;
    border-radius: .078125rem;
    padding: 0.15rem 0;
    height: 0.8rem;
    width: 70%;
    margin: 0rem auto .46875rem auto;
    flex: 2;
    margin-right: 5%;

  }

  .inputtxt .scanimg {
    padding-left: .390625rem;
    float: left;
    margin-right: 5px;
  }

  .inputtxt .scanimg img {
    height: 0.8rem;
  }

  .inputtxt input {
    width: 70%;
    height: 0.8rem;
    border: none;
  }

  .signbox {
    .btnquery {
      .btn_middle
    }
    .inputcont {
      display: flex;
      margin: 5% 0;
      padding: 0 5%;
      border-bottom: 5px solid #eceff5;
    }
    .col_2 {
      flex: 1;
    }
    .eventbox {
      width: 90%;
      margin: 0px auto;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .eventbox h1 {
      padding: 0.3rem 0.5rem;
      border-bottom: 1px solid #ccc;
      font-size: @ttsize3;
    }
    .eventbox .cont {
      padding: 0.3rem 0.5rem 0 0.3rem;
    }
    .eventbox .cont p {
      margin-bottom: 0.3rem;
      font-size: @ttsize;
    }
    .btn_sign {
      .btn_bigyellow(@width: 100%, @mrglf: 0, @radius: 5px, @mrgtop: 0.2rem)
    }
  }

</style>
<script>
  import wx from 'weixin-js-sdk'
  /* import {
    wxInit
  } from '../../static/js/wxbase.js' */
  var wxbase = require('@/assets/js/wxbase.js')
  var wxInit = wxbase.wxInit
  export default {
    data() {
      return {
        scan_txt: "",
        sign_arr: []
      }
    },
    mounted() {
      wxInit()
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    methods: {
      //scancode start
      scancode() {
        var that = this
        wx.ready(function () {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果   
              that.scan_txt = result
            }
          });
        })
        wx.error(function (res) {
          console.log(res)
        });
      },
      btnsign() {
        var that = this
        //扫码签到 start
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001741',
          wechat_id:that.$store.state.id,
          signincode: that.scan_txt
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
               that.popwarn1(res.data.data[0].msg, "提示")              
            } 
             that.sign_arr=[]
          }).catch(function (res) {

          });
        //扫码签到 end
      },
      savecode() {
        var that = this
        //拒绝报名 start
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001743',
          signincode: that.scan_txt
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              that.sign_arr = res.data.data[0]
            } else {
              that.popwarn1("签到码错误", "提示")
            }
          }).catch(function (res) {

          });
        //拒绝报名 end
      },
      //scancode end
    }
  }

</script>
