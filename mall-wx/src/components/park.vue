<template>
  <div class="parkmainbox">
    <div class="park_bnr">
      <h1 v-if="parkinfo.FeeType==1">超时补费</h1>
      <h1 v-else>停车缴费</h1>
      <h2>
        车牌号：{{parkinfo.PlateNo}}
        <br> 会员名：{{memberinfo.member_name}}
      </h2>
    </div>
    <div class="cont1">
      <el-row>
        <el-col :span="8">计费时长
        </el-col>
        <el-col :span="16" class="col-rt">{{toHourMinute(parkinfo.StopTime)}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">计费开始时间
        </el-col>
        <el-col :span="16" class="col-rt">{{parkinfo.FeeStartTime}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">计费结束时间
        </el-col>
        <el-col :span="16" class="col-rt">{{parkinfo.FeeEndTime}}
        </el-col>
      </el-row>
      <hr>
      <el-row>
        <el-col :span="8">停车费用
        </el-col>
        <el-col :span="16" class="col-rt" v-if="parkinfo.PayFee">￥{{parkinfo.PayFee/100}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">会员优惠金额
          <!--后续计算-->
        </el-col>
        <el-col :span="16" class="col-rt">{{priv_hour}}元
        </el-col>
        <!--<el-col :span="16" class="col-rt">{{total_park}}张
        </el-col>-->
      </el-row>
      <div v-for='(item,index) in couponinfo' v-if="index!=0">
        <el-row style="line-height:28px">
          <el-col :span="9">{{item.coupon_name}}
          </el-col>
          <el-col :span="15" class="col-rt">
            <div class="num_cnt"><el-input-number v-model="item.used" size='mini' @change="change_num1(index)" :min="0" :max="item.max_per_day" label="描述文字"></el-input-number>张</div>
           <span style="padding-left:10px">{{item.coupon_fee/100}}元</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--cont2 start-->
    <div class="cont2" v-if="islogin&&maxnum2>0">
      <el-row>
        <el-col :span="12">
          <img src="~assets/images/park/icon-member.png" class="icon_memb">会员积分
        </el-col>
        <el-col :span="12" class="col-rt">{{memberinfo.member_point}}
          <!-- <input type="checkbox" value="1" v-model="selected"></input>-->
        </el-col>
      </el-row>
    </div>
    <!--cont2 end-->
    <div class="cont3" v-if="islogin&&maxnum2>0">
      <el-row>
        <el-col :span="12">抵扣小时
          <span>{{num2}}小时</span>
        </el-col>
        <el-col :span="12" class="col-rt">抵扣积分
          <span>{{computePoint}}</span>
        </el-col>
      </el-row>
      <div class="cont3_2">
        <el-input-number v-model="num2" size='mini' @change="handleChange" :min="0" :max="maxnum2" label="描述文字"></el-input-number>
        <p>抵扣规则:{{per_hour}}积分抵扣1小时</p>
      </div>
    </div>
    <p class="note">
      <img src="~assets/images/park/icon-warn.png" class="icon_warn">请缴费后在15分钟内离开停车场，超时将重新收取停车费</p>
    <div class="footdscp">如需发票，请于当日在L1/LG2礼宾台或LG4缴费处领取。</div>
    <div class="foot">
      <span>实际需支付</span>
      <span class="pay">￥{{actual_fee}}</span>
    </div>
    <input type="button" class="btnpay" @click="wxpay" :value="paytxt" :disabled="disabled"></input>
  </div>


</template>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  @margbt1: .2rem;
  .park_bnr {
    margin-bottom: @margbt1;
    background: #bf9f58 url('~assets/images/park/park-bg1.jpg') repeat;
    background-size: auto 4.5625rem;
    width: 100%;
    padding: .5rem 0;
    color: #fff;
    text-align: center;
  }

  .parkmainbox {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    min-height: 100%;
    overflow-y: scroll;
    background: #f4f4f4;
    .park_bnr h1 {
      font-size: @ttsize3;
      margin-bottom: .3rem;
    }
    .park_bnr h2 {
      font-size: @ttsize2;
      font-weight: normal;
      line-height: 200%;
    }
    .el-row {
      color: @gray99;
      padding: .14rem .3125rem;
    }
    .cont1 {
      background: #fff;
      margin-bottom: @margbt1;
    }
    .el-row .col-rt {
      text-align: right;
      color: #000;
    }
    .cont1 hr {
      width: 95%;
      margin: 0px auto;
      height: 1px;
      background: #f0f0f0;
      border: none;
    }
    .cont2 {
      background: #fff;
      font-size: @ttsize2;
    }
    .cont2 .el-row {
      color: #000;
    }
    .cont3 {
      background: #fff;
      border-radius: 0 0 10px 10px;
      width: 90%;
      margin: 0px auto;
      padding: .16rem 2%;
    }
    .cont3 .el-row .col-rt {
      color: @gray99;
    }
    .cont3 .el-row span {
      color: #000;
      margin-left: .21875rem;
    }
    .cont3_2 {
      text-align: center;
      padding: .3rem 0 .3rem 0;
    }
    .cont3_2 p {
      margin-top: .3125rem;
    }
    .note {
      width: 94%;
      margin: .3125rem auto;
      font-size: @ttsize;
    }
    .foot {
      display: flex;
      font-size: @ttsize3;
      width: 94%;
      margin: 0px auto 1.3rem auto;
    }
    .foot span {
      flex: 1;
    }
    .foot span.pay {
      text-align: right;
      color: #e23426;
      font-weight: bold;
    }
    .btnpay {
      position: absolute;
      left: 0px;
      bottom: 0px;
      .btn_bigyellow(@width: 100%,
      @mrgbt: 0px)
    }
    .btnpay:disabled {
      background: #ccc;
    }
    .icon_memb {
      width: .8rem;
      vertical-align: middle;
      margin-right: .15625rem;
    }
    .icon_warn {
      width: .46875rem;
      vertical-align: middle;
      margin-right: .078125rem;
    }
    input[type="checkbox"] {
      -webkit-appearance: none;
      /*去除input默认样式*/
      margin-left: .15625rem;
      background: url(~assets/images/park/icon-park.png) center center no-repeat;
      width: .55rem;
      height: .55rem;
      background-size: .55rem auto;
      border: none;
      vertical-align: middle;
    }
    input[type="checkbox"]:checked {
      background: url(~assets/images/park/icon-park-on.png) center center no-repeat;
      background-size: .55rem auto;
    }
    .el-input-number--mini {
      width: 2.34375rem;
      margin-right: 10px;
    }
    .el-input-number--mini .el-input__inner {
      padding-left: 0px;
      padding-right: 0px;
    }
    .el-input-number--mini .el-input-number__decrease,
    .el-input-number--mini .el-input-number__increase {
      width: .734375rem;
    }
    .footdscp {
      width: 94%;
      margin: 0px auto 10px auto;
      padding-left: 0.86rem;
    }
    .num_cnt{float:left;margin-left:0.28rem;}
  }

</style>
<script>
  //import wx from 'weixin-js-sdk' 
  /* import {
    wxInit
  } from '../../static/js/wxbase.js' */
  var wx=require('weixin-js-sdk')
  var wxbase = require('@/assets/js/wxbase.js')
  var wxInit = wxbase.wxInit
  export default {
    data() {
      return {
        num1: 1,
        num2: 1,
        token: "",
        maxnum2: 0,
        qrcode: "",
        total_park: 0,
        parkinfo: [],
        memberinfo: [],
        couponinfo: [],
        points: "",
        actual_fee: "",
        resdata: "",
        islogin: "",
        wxarr: [],
        disabled: false,
        ispay: false,
        wxtip: "支付完成，您已经可以出场",
        paytxt: "微信支付",
        per_hour: "",
        priv_hour: ""
      }
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    computed: {
      computePoint: function () { //抵扣积分计算
        return (this.num2 * this.per_hour)
      }
    },
    mounted() {
      this.qrcode = this.$route.query.qrcode
      wxInit()
      this.getparkinfo('')
    },
    methods: {
      toHourMinute(minutes) {
        if (minutes) {
          return (Math.floor(minutes / 60) + "小时" + (Math.round(minutes % 60)) + "分");
        }
      },
      getparkinfo(confirm) {
        var that = this
        if (that.qrcode) {
          var qrcode = that.qrcode.split(",")[1]
        }
        let url = that.global_config.datapost.codeurl + '/wechat/ifs/wechator/' + that.$store.state.id + '/park/query'
        //测试用 start
      // var qrcode = "2215455622486353676301063318"
        // let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/4210/park/query"
        //测试用 end
        let params = {
          card: qrcode,
          confirm: confirm
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code != 0) {
              //code 9909异常处理 start
              if (res.data.code == 9009) {
                this.$confirm(res.data.msg, '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  //当用户点击确认时，附加一个参数confirm=1
                  this.getparkinfo(1)
                }).catch(() => {
                  this.disabled = true
                  this.$message({
                    type: 'info',
                    message: '已取消此次支付'
                  });
                }); //code 9909异常处理 end
              } 
              else {
                that.popwarn_m(res.data.msg, "提示")
                that.disabled = true
                return false
              }
            }
            if (res.data.data[0].member) {
              that.islogin = true
            } else {
              that.islogin = false
            }
            that.deal_data(res)
          }).catch(function (res) {
            console.log(res);
          });
      },
      deal_data(res) {
        var that = this
        var total_park = 0
        that.resdata = res.data.data[0]
        let data = res.data.data
        that.parkinfo = data[0].park_data
        if(that.parkinfo.FeeType==1)//1为超时补费
        {
          this.$alert("检测到您当前车辆为超时补费，请点击确定以继续", "提示", {
          confirmButtonText: '确定',
          type: 'warning',
          confirmButtonClass: "confirmbtn_1",
          center: true,
          callback: action => {

          }
        })
        }//超时补费end
        that.memberinfo = data[0].member
        that.couponinfo = data[0].coupon_dict
        that.actual_fee = (data[0].current_fee) / 100
        //抵扣小时
        that.num2 = parseInt(data[0].point_dedu_hour)
        //最多抵扣小时
        that.maxnum2 = parseInt(data[0].point_max_hour)
        that.token = data[0].token
        that.per_hour = data[0].park_rule.points_per_hour
        that.total_park = data[0].coupon_list.length
        if(data[0].privilege.priv_fee)
        {that.priv_hour = data[0].privilege.priv_fee/100}
        else
        {
          that.priv_hour=0
        }
      },
      change_num1(index, value) {
        var that = this
        let params = that.resdata
        let couponinfo = params.coupon_dict
        for (var i in couponinfo) {
          if (i == index) {
            couponinfo[index].used = value
          }
        }
        params.coupon_dict = couponinfo
        that.setdata(params)
      },
      handleChange(value) {
        var that = this
        let params = that.resdata
        params.point_dedu_hour = value
        that.setdata(params)
      },
      setdata(params) {
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id + "/park/query"//调整停车费用的接口
        window.setTimeout('', 10)
        that.$http.post(url, params)
          .then(res => {
            that.deal_data(res)
            //返回的code是3303，弹出返回的错误消息，用户点击确定后，返回上一页
            if(res.data.code==3303)
            {
             this.popwarn_m(res.data.msg,"提示")//弹错误信息，返回一页
            }
          }).catch(function (res) {
            console.log(res);
          });
      },
      go_money() { //转到停车支付
        this.$router.push({
          name: 'park_money'
        })
      },
      wxpay() {
        var that = this
        that.disabled = true
        that.paytxt = "请等待"
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id + "/park/pay"
        let params = {
          token: that.token
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            let data = res.data
            if (data.code == 0) { //接口返回成功
              that.ispay = data.data[0].wxpay
              if (that.ispay) { //判断是否需要支付
                that.wxarr = data.data[0]
                that.gowxpay()
              } else {
                that.popwarn_m(that.wxtip, "提示")
              }
            } else { //code不为0
              that.popwarn_m(data.msg, "提示")
            }
          }).catch(function (res) {
            console.log(res);
          });

        //ready end
      },
      popwarn_m(message, title) {//弹错误信息返回上一页的函数
        var that = this
        this.$alert(message, title, {
          confirmButtonText: '确定',
          type: 'warning',
          confirmButtonClass: "confirmbtn_1",
          center: true,
          callback: action => {
            that.go_money()
          }
        })
      },
      gowxpay() {
        var that = this
        wx.ready(function () {
          wx.chooseWXPay({
            timestamp: that.wxarr.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: that.wxarr.nonceStr, // 支付签名随机串，不长于 32 位
            package: that.wxarr.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: that.wxarr.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: that.wxarr.paySign, // 支付签名
            success: function (res) {
              that.$alert("支付完成，您已经可以出场", "提示", {
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true,
                type: 'warning',
                confirmButtonClass: "confirmbtn_1",
                center: true,
                callback: action => {
                  that.$router.push({
                    name: 'park_money'
                  })
                }
              });
              that.paytxt = "微信支付"
              // 支付成功后的回调函数
            }
          });
          //chooseWXPay end
        })
      } //gowxpay end
    }
  }

</script>
