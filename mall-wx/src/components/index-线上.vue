<template>
  <div class="memberbox">
    <!--<vueLoading v-show="vueload"></vueLoading>-->
    <!--<transition name="loadanim">
      <div class="load" v-show="load" @click="loadhid">
      </div>
    </transition>-->
    <transition name="loadmemb">
      <!--<div class="membercenter" v-show="!load">-->
      <div class="membercenter">
        <indexkv @newNodeEvent="parentLisen"></indexkv>
        <div class="iconlist">
          <el-row>
            <el-col :span="8">
              <router-link :to="{name:'mygold'}">
                <img src="~assets/images/mc/icon-index1.png">
                <br>我的国金会
              </router-link>
            </el-col>
            <el-col :span="8">
              <div @click="contact">
                <img src="~assets/images/mc/icon-index2.png">
                <br>联系客服
              </div>
            </el-col>
            <el-col :span="8">
              <router-link :to="{name:'mycard'}">
                <img src="~assets/images/mc/icon-index3.png">
                <br>我的卡券
              </router-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <router-link :to="{name:'park_money'}">
                <img src="~assets/images/mc/icon-index4.png">
                <br>停车缴费
              </router-link>
            </el-col>
            <el-col :span="8">
              <router-link :to="{name:'shopmall'}">
                <img src="~assets/images/mc/icon-index5.png">
                <br>积分商城
              </router-link>
            </el-col>
            <el-col :span="8">
              <router-link :to="{name:'event'}">
                <img src="~assets/images/mc/icon-index6.png">
                <br>会员活动
              </router-link>
            </el-col>
          </el-row>
          <div class="clearfix"></div>
        </div>
        <div class="bannerlist">
          <h1>最新活动</h1>
          <banner :imgitems="imgitems"></banner>
        </div>
      </div>
    </transition>
    <el-dialog title="会员卡二维码" class="smallDialog" :visible.sync="dialogVisible1" width="80%" :modal-append-to-body="false" center>
      <center>
        <div class="quancode" ref="quan">
          会员卡号:{{card_num}}
         <vue-qr :text="qrcodetxt" width="800" height="800" class="qrcode" ></vue-qr>
          <!--<VueQArt :config="config"></VueQArt>-->
        </div>
        <img src="~assets/images/mc/loading1.gif">
      </center>
      <div class="footdscp">
        此二维码为成都IFS会员身份的唯一识别码，若泄露请自行负责
      </div>
    </el-dialog>
    <el-dialog title="联系客服" top=30vh :visible.sync="dialogVisible2" width="65%" :modal-append-to-body="false" center>
      <div>联系电话
        <br>
        <span v-show="vip==0">
          <a href="tel:028-6939" class="tel">028-69396939</a>
        </span>
        <span v-show="vip==1">
          <a href="tel:028-6939" class="tel">028-69399399</a>
        </span>
      </div>
      <div style="margin:10px 0">
        <div class="btn_yellow" @click="contact">在线客服</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  //import $ from 'jquery'
  import banner from '../components/public/bannerswiper'
  import indexkv from '../components/public/indexkv'
  import vueLoading from '../components/vueload'
  import VueQr from 'vue-qr'
 // import VueQArt from 'vue-qart'
  import md5 from 'js-md5';
  export default {
    data() {
      return {
        imgitems: [],
        load: "",
        vueload: true,
        card_num: "",
        qrcodetxt: "",
        dialogVisible1: false,
        dialogVisible2: false,
        vip: 0,
        config: {
            value: '',
            imagePath: '/static/images/codebg.jpg',
            filter: 'text'
        }
      }
    },
    components: {
      banner,
      indexkv,
      vueLoading,
      VueQr,
      //VueQArt
    },
    methods: {
      pushHistory() {
        let state = {
          title: '会员中心',
          url: '/mc'
        }
        history.pushState(state, state.title, state.url)
      },
      getmember() {
        var that = this
        that.card_num =that.$store.state.member.cardnum
        var membercode=that.$store.state.member.membercode
        var dateget = that.getnowdate()
        var txt = that.getmd5(that.getnowdate2()).toUpperCase()
      that.qrcodetxt = membercode + "|" + dateget + "|" + txt
      //  that.config.value = membercode + "|" + dateget + "|" + txt
      },
      loadhid() {
        this.$store.state.load = false
        this.load = false
      },
      contact() {
        this.$router.push({
          name: 'contact'
        })
      },
      parentLisen(evtValue) {
        //evtValue 是子组件传过来的值
        // alert(evtValue)
        this.dialogVisible1 = evtValue
      },
      getmd5(txt) {
        return md5(txt);
      },
      getnowdate(){
         var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
         return date.replace(" ","|")
      },
       getnowdate2(){
         var date = new Date().Format("hh:mm:ss");
         return date
      },
      getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
      getbanner() { //获取轮播图
        var that = this
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001684'
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              that.imgitems = res.data.data
            }
          }).catch(function (res) {

          });
      }
    },
    created() {
      this.getmember()
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {
      sessionStorage.removeItem('panel_num1')     
      this.vueload = false;
      this.getbanner()
      if (this.$store.state.member.gradenme == "金卡" || this.$store.state.member.gradenme == "钻石卡") {
        this.vip = 1
      } else {
        this.vip = 0
      }
    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less';
  .load {
    background: url('~assets/images/mc/loading.jpg') no-repeat;
    width: 100%;
    height: 100%;
    background-size: cover;
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 99;
  }

  .loadanim-enter-active {}

  .loadanim-leave-active {
    animation: opacity 1s;
  }

  .loadmemb-enter-active {
    animation: membanim 1s;
  }

  @keyframes membanim {
    0% {
      top: 110%;
    }
    100% {
      top: 0px;
    }
  }

  @keyframes opacity {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .iconlist .el-row {
    text-align: center;
    padding-top: .6rem
  }

  .iconlist .el-row img {
    width: 1.22rem;
  }

  .swiper-pagination {
    display: none;
  }

  .bannerlist {
    border-top: 10px solid #f2f2f2;
    position: relative;
    z-index: 2;
  }

  .bannerlist h1 {
    font-size: @ttsize;
    text-align: center;
    padding: .390625rem 0;
    background: #fff;
  }

  .iconlist {
    background: #fff;
    font-size: @ttsize2;
    z-index: 2;
    position: relative;
    padding-bottom: .75rem;
  }

  .memberbox {
    /* background: #393939;min-height:100%;*/
    background: #fff;

    position: absolute;
    height: 100%;
    /*  overflow-y: hidden; */
  }

  img {
    vertical-align: bottom;
  }

  .membercenter {
    height: 100%;
    /*   background: #393939; */
  }

  .el-dialog__body .vueqr img {
    width: 150px;
    height: 150px;
  }

  /* @media (min-height: 810px){  
.iconlist .el-row img{width:1.3rem;}
.iconlist .el-row{padding:.859375rem 0 0 0;}
.iconlist{padding-bottom:1rem;font-size:@ttsize2;}
}  */

  .footdscp {
    line-height: 180%;
    margin-top: .3rem;
  }
.el-dialog__body .qrcode img{width:70%;height:auto;}
</style>
