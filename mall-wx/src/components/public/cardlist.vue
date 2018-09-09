<template>
  <div class="mainbox cardlistbox">
    <!--活动列表 start-->
    <div class="cardlist" v-for="item in carddata"  @click="view(item)">
      <div class="bnr">
        <img :src="item.coupon_image" v-if="item.coupon_image">
        <!--<div class="coupon_name">
          <span style="padding-left:20px">{{item.coupon_time}}</span>
        </div>-->
        <div class="type_name">
          <span>{{item.type_name2}}</span>
          <br>{{item.type_name3}}</div>
      </div>
      <div class="cont" >
        <div class="coupon_name">{{item.coupon_name}}</div>
        <p class="gmfl">使用期限： {{sub_date(item.effect_time)}} — {{sub_date(item.expire_time)}}</p>
        <div class="btn_view" v-if="cardtype=='0'">立即使用</div>
        <div class="btn_view btn_disable" v-if="cardtype=='2'">已使用</div>
        <div class="btn_view btn_disable" v-if="cardtype=='1'">已过期</div>
        <div class="clear"></div>
      </div>
    </div>
    <!--活动列表 end-->
    <div class="share_overlay" v-if="share_show" @click="share_show=false">
      <img src="~assets/images/mc/share-pic.png">
    </div>
    <el-dialog :title="quan.coupon_name" :visible.sync="dialogVisible1" :modal-append-to-body=false width="65%" center @close="dialog_close">
      <center>
        <div class="quancode">
          <vue-qr :text="bill_num" height="150" width="150" class="vueqr"></vue-qr>
          <div>兑换码：{{bill_num}}</div>
          <div>单张券小时数：
          
          {{quan.coupon_time}}小时</div>
          <!-- <div class="btn_present"  @click="share_present(quan)">转赠给好友</div>-->
          <div class="btn_present" v-if="quan.ispresent>=1 && showpresent" @click="share_present(quan)">转赠给好友</div>
        </div>
      </center>
      <div class="tt">使用须知</div>
      <div class="quan_detail">
        {{decodeURI(quan.coupon_desc)}}
      </div>
      <!--实时显示已兑换-->
      <div class="icon_change" v-if="quan.status==2">
        <img src="~assets/images/mc/btn-th.png">
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // 节流函数
  var timer = 0;
  var delay = (function () {
    return function (callback, ms) {
      clearInterval(timer);
      timer = setInterval(callback, ms);
    };
  })();
  //import wx from 'weixin-js-sdk'
  /*   import {
    wxInit
  } from '../../../static/js/wxbase.js' */
  var wx=require('weixin-js-sdk')
  var wxbase = require('@/assets/js/wxbase.js')
  var wxInit=wxbase.wxInit
  import VueQr from 'vue-qr'
  export default {
    props: ['carddata', 'cardtype'],
    data() {
      return {
        dialogVisible1: false,
        quan: [],
        bill_num: "",
        showpresent:true,
        share_show: false
      }
    },
    components: {
      VueQr
    },
    watch: {},
    methods: {
      share() {
        this.dialogVisible1 = false
        this.share_show = true
      },
      dialog_close() { //弹窗关闭
        clearInterval(timer);
      },
      get_status(item) {
        //显示券详情
        var that=this
        var quanid = item.id
        this.$http.get(
            this.global_config.datapost.data_url + '/saas-api/api/portal/custom', {
              params: {
                dataSourceCode: this.global_config.datapost.dataSourceCode,
                repCode: 'REP_001540',
                wechator_id: this.$store.state.id,
                mall: 1,
                coupon: quanid
              }
            })
          .then(res => {
            if (res.data.code == 0) {
              this.quan = res.data.data[0]
              this.bill_num = res.data.data[0].coupon_code              
              /*===如果已兑换===*/
              if (res.data.data[0].status!=0) {
                 this.showpresent=false
                that.$emit('refreshList')
              }
              /*===刷新可使用列表=*/
              this.quan["coupon_image"] = item.coupon_image
              this.quan["coupon_name"] = item.coupon_name
              this.quan["ispresent"] = item.ispresent
              this.quan["coupon_time"] = item.coupon_time
            }
          }).catch(function (res) {
            console.log(res);
          });
        //显示券详情 end
      },
      view(item) { //定时刷新券详情
      if(this.cardtype!=0)
        {return false}
        this.dialogVisible1 = true        
        this.get_status(item)
         delay(() => {
            this.get_status(item)
          }, 1000);  
      },
      share_present(quan) { /*===分享 start==*/
        var that = this
        var coupon_id = quan.id
        that.share()
        if (quan != '') {
          var links=that.global_config.datapost.shareurl + "/weixin/#/mc/present?gift_id=" + coupon_id
          var title=that.$store.state.member.membername + "送了你一张优惠券，快来领取吧"
          var desc = quan.coupon_name
          var quanimg = quan.coupon_image
        } else {
          return false
        }
        wx.onMenuShareAppMessage({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: quanimg, // 分享图标
          type: 'link',
          trigger: function (res) {
          },
          success: function () {
            that.share_show = false
            that.share_quan(coupon_id)
            //分享后刷新页面
            that.$emit('refreshList')
          },
          cancel: function () {}
        });
      },
      share_quan(quaid) { /*===调用券标识为分享接口 start*/
        var that=this
        var url = that.global_config.datapost.codeurl + "/restful/api/mall/ifs/subscribers/" + that.$store.state.id +
          "/coupons/" + quaid + "/transfer/"
        var params = {
          user: that.$store.state.id,
          coupon: quaid,
          mall: 1,
          openid: that.$store.state.openid
        }
        that.$http.post(url, params)
          .then(res => {
            var data = res.data
            if (!data.id) {
              this.popwarn1("转赠失败", "转赠给好友")
            }
          }).catch(function (res) {
            console.log(res);
          });
      }
    },
    mounted() {
      wxInit()
    },
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../../static/css/main.less';
  @radius: 5px;
  .cardlist {
    border-radius: @radius;
  }

  .cardlist .bnr {
    border-radius: 5px 5px 0 0;
    position: relative;
  }

  .yellow {
    color: @yellow;
  }

  .cardlist {
    background: #fff;
    margin-bottom: 0.546875rem;
    box-shadow: 0px 7px 8px #b7b8dc;
  }

  .cardlist .bnr img {
    width: 100%;
    border-radius: @radius @radius 0 0;
  }

  .cardlist .cont {
    padding: .234375rem;
  }

  .cardlist p {
    color: #b3b3b3;
    font-size: @ttsize;
    margin-bottom: @margin5px;
  }

  .cardlist .btn_view {
    color: #b29664;
    float: right;
  }

  .cardlist .btn_disable {
    color: #999;
  }

  .mainbox {
    padding-top: 0.4rem;
  }

  .box .nodata {
    padding-top: 0px;
  }

  .cardlistbox .el-dialog__body {
    font-size: @basesize;
  }

  .cardlistbox .el-dialog .quancode {
    color: @gray9d;
  }

  .cardlistbox .el-dialog .quancode img {
    width: 100%;
  }

  .cardlistbox .el-dialog .el-dialog__title {
    color: #b89f64;
  }

  .cardlistbox .el-dialog .tt {
    font-size: @ttsize;
    margin-left: 20px;
  }

  .cardlistbox .el-dialog .quan_detail {
    color: @gray9d;
    margin-left: 20px;
    word-break: break-all;
  }

  .cardlistbox .el-dialog .quan_detail li {
    list-style: disc;
  }

  .cardlistbox .coupon_name {
    /*  color: #fff;
    position: absolute;
    left: .234375rem;
    top: .234375rem; font-weight: bold;*/
    font-size: 0.4rem;

    margin-bottom: 10px;
  }

  .cardlistbox .type_name {
    position: absolute;
    right: .546875rem;
    top: .78125rem;
    color: #797a82;
    font-size: @ttsize;
    font-weight: bold;
  }

  .cardlistbox .type_name span {
    font-size: 0.48rem;
    font-weight: bold;
    color: #fff;
  }

  .btn_present {
    color: #fff;
    border-radius: 3px;
    display: block;
    text-align: center;
    font-size: @btnsize;
    height: .75rem;
    line-height: .75rem;
    width: 2.8rem;
    margin: 0.2rem 0;
    background: @yellow;
  }

  .icon_change {
    position: absolute;
    right: 10px;
    bottom: -0.8rem;
    width: 3rem;
    animation: mychange 1s;
    -webkit-animation: mychange 0.5s;
  }

  .icon_change img {
    width: 100%;
  }

  @keyframes mychange {
    0% {
      transform: scale(2.5, 2.5);
      -webkit-transform: scale(2.5, 2.5);
    }
    100% {
      transform: scale(1, 1);
      -webkit-transform: scale(1, 1);
    }
  }

  .share_overlay {
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 52999;
    text-align: right;
  }

  .share_overlay img {
    width: 70%;
    margin: 20% 5% 0 0;
  }

</style>
