<template>
  <div class="selfbox">
    <div class="tt">积分规则</div>
    <div class="dscp">
      <ul>
        <li>>全场消费购物小票均可用于会员积分；</li>
        <li>>储值卡、充值卡均不可积分；</li>

        <li>>所有定金单、订货单均不可积分；</li>

        <li>>每张购物小票仅可积分一次，手写单据、重印或复印小票均不可积分；</li>

        <li>>会员卡积分时限为消费之日起的7日内（定金或订货情况下则以提货或完成尾款支付后7日内），逾期不予办理积分；</li>

        <li>>对于租用IFS收银机的店铺，仅接受IFS统一购物小票作为唯一积分凭证，店铺自有小票不再参与积分；</li>
        <li>>对于自有收银机店铺，购物小票需加盖“IFS积分章”方可作为积分凭证；</li>

        <li>>会员积分流水不作为顾客消费凭据，顾客消费信息查询以顾客本人所持品牌销售记录及消费小票原件为准。</li>
      </ul>
    </div>
    <div class="btnlist">
      <div class="btn" @click="scancode">扫码积分</div>
      <div class="btn" @click='takepic'>拍照积分</div>
    </div>
    <div class="notice">
      <div class="title">扫码积分：</div>
      <div class="content"> 1.请扫描成都IFS购物小票上二维码进行自助积分，请于消费之日起7日内完成积分 操作，逾期无效；
        <br> 2.非二维码消费小票，请拍照积分或至商场礼宾台积分。
      </div>
    </div>
    <div class="mynote">
      <div class="desc" @click='goMyScoreList'>我的消费明细</div>
      <div @click='goMyScoreList' class="more">查看更多></div>
    </div>
    <ul class="scorelist" v-for='item in consume' @click="getimg(global_config.datapost.codeurl+item.image_path)">
      <li>
        <span>消费店铺： {{item.store_name}}</span>
        <span class="txtrt" v-if="item.point_status==1">审核中</span>
        <span class="txtrt" v-if="item.point_status==2">已通过</span>
        <span class="txtrt" v-if="item.point_status==3">未通过</span>
      </li>
      <!--<li>消费金额：{{item.amount/100}}</li>-->
      <li>上传日期：{{item.create_time?item.create_time.substr(0,10):''}}</li>
      <li class="date">消费日期：{{item.consume_date}}</li>
    </ul>
    <el-dialog title="" class="selfdialog" :visible.sync="dialogVisible1" width="80%" :modal-append-to-body="false" center>
      <div v-if="jfsuc">
        <center>
          <b>
            <span class="el-icon el-icon-success"></span>
            <br>
            <span class="tt">积分成功</span>
          </b>
          <br> 本次积分：
          <span class="yellow">{{jfarr.bonus.split(".")[1]>0?jfarr.bonus:parseInt(jfarr.bonus)}}</span>
        </center>
        <section>会员卡号：
          <b>{{jfarr.vipcode}}</b>
          <br> 消费店铺：
          <b>{{jfarr.name}}</b>
          <br> 消费金额：
          <b>{{jfarr.amount}}</b>
        </section>
      </div>
      <div v-else>
        <center>
          <b>
            <span class="el-icon el-icon-error"></span>
            <br>
            <span class="tt">积分失败</span>
          </b>
          <br> {{errormsg}}
          <br>如有疑问，请咨询礼宾台</center>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="scancode" class="confirmbtn">扫描下一张</el-button>
        <el-button type="primary" @click="goindex" class="confirmbtn">会员中心</el-button>
      </span>
    </el-dialog>
    <div class="imgshow" v-show="showimg" @click="showimg=false">
      <div class="overlay"></div>
      <div class="imgcont">
        <img :src="imgpath">
        <div class="icon_close" @click="showimg=false">
          <img src="~assets/images/mc/icon-close2.png">
        </div>
      </div>

    </div>
  </div>

</template>

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
        card_num: "",
        jfarr: [],
        dialogVisible1: false,
        jfsuc:false,
        errormsg: "",
        showimg: false,
        consume: [],
        imgpath: ""
      }
    },
    mounted() {
       wxInit()
      this.card_num = this.$store.state.member.cardnum
      this.getscore()
      var qrcode=this.$route.query.s
      if(qrcode)
      {this.savecode(qrcode)}
    },
    methods: {
     /*  goScoreDetail() {
        this.$router.push({
          name: 'scoredetail',
        });
      }, */
      goindex() {
        this.$router.push({
          name: 'mc',
        });
      },
      scancode() {
        var that = this
        wx.ready(function () {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
              // alert("二维码"+result)
              that.savecode(result)
            }
          });
        })
        wx.error(function (res) {
          console.log(res)
        });
      },
      savecode(qrcode) {
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id + "/scan"
        let params = {
          s: qrcode
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              that.jfsuc = true
              that.jfarr = res.data.data
            } else {
              that.jfsuc = false
              that.errormsg = res.data.msg
            }
            that.dialogVisible1 = true
          }).catch(function (res) {
            console.log(res);
            alert("错误" + res)
          });
         this.$router.replace({query:{s:""}})
      },
      goMyScoreList() {
        this.$router.push({
          name: 'myselfscore',
        });
      },
      takepic() {
        this.$router.push({
          name: 'uploadscore',
        });
      }, //获得自助记录 start
      getscore() {//积分明细
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/member/pointhist/" + that.$store.state.id
        let params = {
          type: 1
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              if (res.data.data) {
                that.consume = res.data.data.slice(0, 3)
              }
            } else {
              that.popwarn1(res.data.msg, "提示")
            }
          }).catch(function (res) {
            console.log(res);
            alert("错误" + res)
          });
      },
      getimg(obj) {
        this.imgpath = obj
        this.showimg = true
      } //获得自助记录 end
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    }

  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  .selfbox {
    font-size: @smallsize;
    .tt {
      background: url('~assets/images/mc/jf-bg3.jpg') center top no-repeat;
      font-size: @ttsize3;
      text-align: center;
      font-weight: bold;
      height: .546875rem;
      background-size: 95% auto;
      margin-top: 0.4rem;
    }
    .dscp {
      padding: .2rem .3rem 0 .4rem;
      line-height: 150%;
    }
    .dscp li {
      margin-bottom: 0.08rem;
    }
    .btnlist {
      display: flex;
      width: 90%;
      margin: 0.6rem auto;
    }
    .btnlist .btn {
      flex: 1;
      margin-right: 10%;
      background: @yellow;
      color: #fff;
      padding: 0.3rem 0;
      font-size: @btnmidsize;
      text-align: center;
      vertical-align: middle;
      border-radius: 3px;
    }
    .btnlist .btn:last-child {
      margin-right: 0px;
    }
    .notice {
      padding-left: 0.4rem;
      line-height: 150%;
    }
    .mynote {
      margin-top: 0.4rem;
      background: #edeaea;
      padding: 0 .8rem 0 .46875rem;
      height: .6875rem;
      flex: 1;
      line-height: .6875rem;
      display: flex;
    }
    .mynote div {
      flex: 1;
    }
    .mynote .more {
      text-align: right;
    }
    .scorelist {
      padding: 0.3rem 0 0 .390625rem;
      line-height: 150%;
    }
    .scorelist .date {
      /* color: #6f6e6e; */
    }
    .scorelist li {
      display: flex;
    }
    .scorelist li span {
      flex: 2;
    }
    .scorelist li span.txtrt {
      flex: 1;
      text-align: right;
      margin-right: 0.8rem;
    }
    .imgshow .imgcont {
      width: 90%;
      margin: 0px auto;
      position: absolute;
      left: 50%;
      top: 10%;
      z-index: 101;
      margin-left: -45%;
      border-radius: @radius;
    }
    .imgshow img {
      width: 100%;
    }

    .imgshow .overlay {
      position: fixed;
      z-index: 100;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background: rgba(7, 17, 27, 0.6);
    }
    .imgshow .icon_close {
      position: absolute;
      right: -.2rem;
      top: -.2rem;
    }
    .imgshow .icon_close img {
      width: 0.9rem;
      height: auto;
    }
  }

  .selfdialog section {
    margin-top: .3125rem;
    padding-left: 10%;
  }

  .selfdialog span.yellow {
    color: @yellow;
    font-weight: bold;
  }

  .selfdialog span.tt {
    font-size: @ttsize3;
  }

  .selfdialog .el-icon {
    font-size: 20px;
    color: @yellow;
  }

  @media only screen and (min-device-height:810px) {
    .selfbox .dscp,
    .selfbox .notice {
      line-height: 190%;
    }
    .selfbox {
      font-size: @basesize;
    }
  }

</style>
