<template>
  <div class="mygold_box">
    <div class="mygoldbnr">
      <div class="mytxbox">
        <div class="mygoldtxinfo">
          <span>当前等级</span>
          <br> {{mylevel}}
          <!--  <br>{{cardnum}}-->
        </div>
        <img v-bind:src="mytx" class="imgtx">
        <div class="mygoldtxinfo mygoldtxinfo2">
          <span>会员积分</span>
          <br> {{mypoint}}
        </div>
      </div>
    </div>
    <div class="swiper-pagination" slot="pagination"></div>
    <swiper :options="swiperOption" ref="swiperTop" class="gallery-top">
      <!-- 这部分放你要渲染的那些内容-->
      <swiper-slide v-for="item in carditems">
        <img :src="item.img">
      </swiper-slide>
      <!-- 这是轮播的小圆点 -->
    </swiper>
    <ul class="ul_list1">
    <li :class="[(this.currentidx==0)?'active':'']"></li>
    <li :class="[(this.currentidx==1)?'active':'']"></li>
    <li :class="[(this.currentidx==2)?'active':'']"></li>
    <li :class="[(this.currentidx==3)?'active':'']"></li>
    <li :class="[(this.currentidx==4)?'active':'']"></li>
    </ul>
    <el-row>
      <el-col :span="8">
        <router-link :to="{name: 'article_membership'}">
          <img src="~assets/images/mc/icon-gold1.png">
          <span>入会标准</span>
            <div class="dscp" v-if="this.currentidx==0">微信免费注册入会</div>
          <div class="dscp" v-if="this.currentidx==1">当日消费3000元</div>
          <div class="dscp" v-if="this.currentidx==2">当日消费30000元</div>
          <div class="dscp" v-if="this.currentidx==3">当日消费60000元</div>
          <div class="dscp" v-if="this.currentidx==4">邀请升级</div>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link :to="{name: 'magazine'}">
          <img src="~assets/images/mc/icon-gold2.png">
          <span>限量杂志</span>
          <div class="dscp">精选动态资讯</div>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link :to="{name: 'shopmall'}">
          <img src="~assets/images/mc/icon-gold3.png">
          <span>积分兑换</span>
          <div class="dscp">积分兑缤纷好礼</div>
          <span class="icon_new">
            <img src="~assets/images/mc/icon-new.png">
          </span>
        </router-link>
      </el-col>

      <el-col :span="8">
        <router-link :to="{name: 'park_money'}">
          <img src="~assets/images/mc/icon-gold4.png">
          <span>停车优惠</span>
          <div class="dscp" v-if="this.currentidx==0">消费享更多优惠</div>
          <div class="dscp" v-if="this.currentidx==1">免费停车1小时</div>
          <div class="dscp" v-if="this.currentidx==2">免费停车2小时</div>
          <div class="dscp" v-if="this.currentidx==3">免费停车3小时</div>
          <div class="dscp" v-if="this.currentidx==4">全天不限时免费</div>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link :to="{name: 'event'}">
          <img src="~assets/images/mc/icon-gold5.png">
          <span>会员活动</span>
          <div class="dscp">会员专享活动</div>
           <span class="icon_new">
            <img src="~assets/images/mc/icon-new.png">
          </span>
        </router-link>
      </el-col>
      <el-col :span="8" :class="[(active==0 || active==1)?'menu_noactive':'']" v-if="currentidx==2 || currentidx==3 || currentidx==4">
        <!--<div v-if="active==0 || active==1">
          <div>
            <img src="~assets/images/mc/icon-gold6.png">
            <span>生日权益</span>
            <div class="dscp">生日享双倍积分</div>
          </div>
        </div>-->
        <router-link :to="{name: 'article_birthday'}">
          <img src="~assets/images/mc/icon-gold6.png" v-if="active==2 || active==3 || active==4">
          <img src="~assets/images/mc/icon-gold6-gray.png" v-else>
          <span>生日权益</span>
          <div class="dscp">生日享双倍积分</div>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link :to="{name: 'article_park'}">
          <img src="~assets/images/mc/icon-gold7.png">
          <span>代客泊车</span>
          <div class="dscp" v-if="currentidx==0 || currentidx==1 || currentidx==2">积分兑泊车券</div>
          <div class="dscp" v-if="currentidx==3">每日免费1次</div>
          <div class="dscp" v-if="currentidx==4">全天免费</div>
        </router-link>
      </el-col>
      <el-col :span="8" :class="[(active==0 || active==1 || active==2)?'menu_noactive':'']" v-if="currentidx==3 || currentidx==4">
        <router-link :to="{name: 'article_vip'}">
          <img src="~assets/images/mc/icon-gold8.png" v-if="active==3 || active==4">
          <img src="~assets/images/mc/icon-gold8-gray.png" v-else>
          <span>VIP贵宾室</span>
          <div class="dscp">会员尊享权益</div>         
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link :to="{name: 'brand'}">
          <img src="~assets/images/mc/icon-gold9.png">
          <br>
          <span>会员专属折扣</span>
          <div class="dscp">联盟商户优惠</div>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link :to="{name: 'article_electronic'}">
          <img src="~assets/images/mc/icon-gold10.png">
          <br>
          <span>会员手册</span>
          <div class="dscp">了解国金会</div>
        </router-link>
      </el-col>
      <el-col :span="8">
        <div @click="dialogVisible1=true">
          <img src="~assets/images/mc/icon-gold11.png">
          <br>
          <span>联系客服</span>
          <div class="dscp">客服在线服务</div>
        </div>
      </el-col>
    </el-row>
    <!--<div><img src="~assets/images/mc/temp.jpg" style="width:100%"></div>-->
    <el-dialog title="联系客服" top=30vh :visible.sync="dialogVisible1" width="65%" :modal-append-to-body="false" center>
      <div>联系电话
        <br>
        <span v-if="active==0 || active==1 || active==2">028-6939 6939</span>
        <span v-else>028-6939 9399</span>
      </div>
      <div style="margin:10px 0">
        <div class="btn_yellow" @click="contact">在线客服</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import myuser from '../components/public/myuser'
  export default {
    data() {
      return {
        msg: '欢迎来到品4434343434牌列表！',
        mytx: "",
        currentidx: 0,
        active: 0,
        mypoint: "",
        mylevel: "",
        cardnum: "",
        goldmenu: [],
        dialogVisible1: false,
        carditems: [{
          'img': require('assets/images/mc/member.png'),
          'url': '/event'
        }, {
          'img': require('assets/images/mc/sliver1.png'),
          'url': '/event'
        }, {
          'img': require('assets/images/mc/sliver2.png'),
          'url': '/event'
        }, {
          'img': require('assets/images/mc/gold01.png'),
          'url': '/event'
        }, {
          'img': require('assets/images/mc/gold02.png'),
          'url': '/event'
        }],
        swiperOption: {
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet(index, className) {
              // var current = 1;
              var bullet
              var currentclass = ""
              if (index == 0) {
                bullet = "电子会员"
              } else if (index == 1) {
                bullet = "银卡"
              } else if (index == 2) {
                bullet = "特选银卡"
              } else if (index == 3) {
                bullet = "金卡"
              } else {
                bullet = "钻石卡"
              }
              /*  if (bullet == current) {
                 currentclass = "current"
               } */
              return `<span class="${className} ${currentclass} swiper-pagination-bullet-custom">${bullet}</span>`
            }
          }
        }
      }
    },
    components: {
      myuser
    },
    watch: {
    
    },
    created() {
      // this.current=this.$store.state.member.gradenme
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {
      var that=this
      //默认到第几个slide
      this.mypoint = this.$store.state.member.memberpoint
      this.mylevel = this.$store.state.member.gradenme
      this.cardnum = this.$store.state.member.cardnum
      var gradenme = this.$store.state.member.gradenme
      if (gradenme == "电子会员" || !gradenme) {
        this.active = 0
      } else if (gradenme == "银卡") {
        this.active = 1
      } else if (gradenme == "特选银卡") {
        this.active = 2
      } else if (gradenme == "特选银卡") {
        this.active = 3
      } else {
        this.active = 4
      }
      //  this.$nextTick(() => {
      var swiperTop = this.$refs.swiperTop.swiper
      swiperTop.slideTo(this.active, 1000, true);
      /*==切换变化 start===*/
      swiperTop.on("slideChange", () => {
        this.currentidx = swiperTop.activeIndex
       // that.changemenu()
      })
      /*==切换变化 end===*/
      //  })
      this.mytx = this.$store.state.headimgurl
      //this.changemenu()
    },
    methods: {
      changemenu() {
        var that = this
        if (that.current == 0) {
          that.goldmenu["入会标准"]="微信免费注册入会"
        }
        if (that.current == 1) {
          that.goldmenu["入会标准"]="当日消费3000元"
        }
        if (that.current == 2) {
          that.goldmenu["入会标准"]="当日消费30000元"
        }
        if (that.current == 3) {
          that.goldmenu["入会标准"]="当日消费60000元"
        }
        if (that.current == 4) {
          that.goldmenu["入会标准"]="邀请升级"
        }
      },
      contact() {
        var that = this
        let url = "https://api.weixin.qq.com/customservice/kfsession/create?access_token=ACCESS_TOKEN"
        let openid = localStorage.getItem('openid')
        console.log(openid)
        alert(url)
        alert(openid)
        let params = {
          "kf_account": "lily@Andoner123",
          "openid": openid
        }
        alert(params)
        that.$http.post(url, params)
          .then(res => {
            if (res.errcode == 0) {
              alert("成功")
            }
          }).catch(function (res) {
            alert("error" + res)
          });
        //调用wxend
      }
    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less';
  .mygold_box{
  .mygoldbnr {
    background: url('~assets/images/mc/goldbnr.jpg') no-repeat;
    width: 100%;
    height: 3.75rem;
    background-size: 100% auto;
  }

  .imgtx {
    width: 1.71875rem;
    height: 1.71875rem;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    float: left;
    border: .0625rem solid #23232c;
  }

  .mygoldtxinfo span {
    color: #b29664;
  }

  .mygoldtxinfo {
    color: rgba(255, 255, 255, 0.5);
    width: 3.90625rem;
    float: left;
    text-align: center;
    font-size: @ttsize;
    line-height: 160%;
  }

  .mygoldtxinfo2 {
    width: 3.5625rem;
  }

  .gallery-top .swiper-slide {
    position: relative;
    text-align: center;
  }

  .gallery-top .swiper-slide-prev {
    right: -40%;
  }

  .gallery-top .swiper-slide-next {
    left: -40%;
  }

  .gallery-top .swiper-slide {
    margin-top: 5%;
  }

  .gallery-top .swiper-slide-active {
    margin-top: 0;
  }

  .gallery-top .swiper-slide img {
    width: 55%;
    height: auto;
  }

  .gallery-top .swiper-slide-active img {
    width: 60%;
  }

  .swiper-container.gallery-top {
    padding-top: 0.2rem;
    background: #e5e5e5 url('~assets/images/mc/bnrtop.jpg') left top repeat-x;
    background-size: 10rem 0.546875rem;
    margin-top: 1.28rem;
    padding: 0.3rem 0 0.1rem 0;
  }

  .el-row {
    text-align: center;
  }

  .el-row img {
    width: 0.7rem;
    padding-bottom: .02rem;
  }



  .el-col span {
    /*  font-size: @ttsize; */
    display: block;
    color: #303030;
    line-height: @lineheight;
  }

  .el-col .dscp {
    color: #bdbdbd;
    font-size: @smallsize;
  }

  .el-col a {
    color: #686868;
  }



  .el-col:nth-of-type(3n+0) {
    border-right: none;
  }

  .swiper-pagination {
    display: block;
  }

  .swiper-pagination-fraction,
  .swiper-pagination-custom,
  .swiper-pagination-bullets {
    position: absolute;
    width: 10rem;
    top: 2.7rem;
    left: 0rem;
    z-index: 2;
    height: 1.5625rem;
  }

  .swiper-pagination-bullet {
    top: 0rem;
    z-index: 50;
    background: none;
    width: 20%;
    height: 100%;
    line-height: 1.5625rem;
    text-align: center;
    font-size: @ttsize2;
    display: block;
    float: left;
    margin: 0rem;
  }

  .swiper-pagination-bullet {
    opacity: 1;
  }

  .swiper-pagination-bullet-custom.swiper-pagination-bullet-active {
    background: url('~assets/images/mc/icon-arror.jpg') center bottom no-repeat;
    background-size: 0.765625rem 0.5rem;
    color: #b29664;
  }

  .swiper-pagination-bullet-custom.current {
    color: #b29664;
  }

  .el-col span.icon_new {
    position: absolute;
    right: 0px;
    top: 0px;
  }

  .el-row .icon_new img {
    width: 1.03125rem;
    height: auto;
  }

  .menu_noactive {
    /*background: #ccc;*/
  }

  /*修改*/
  .gallery-top .swiper-slide-active img {
    width: 75%;
  }

  .el-col {
    border-right: .015625rem solid #d4d4d4;
    border-bottom: .015625rem solid #d4d4d4;
    padding-top: .5rem;
    height: 2.7rem;
    color: #686868;
    position: relative;
  }
  .swiper-container.gallery-top {
    padding: .5rem 0;
  }

  .mytxbox {
    padding-top: .78125rem;
    display: flex;
    align-items: center;
  }

  .swiper-pagination-fraction,
  .swiper-pagination-custom,
  .swiper-pagination-bullets {
    top: 3.75rem;
  }

  .swiper-container.gallery-top {
    margin-top: 1.38rem;
  }
  /*修改*/
  .ul_list1{text-align:center;position:absolute;left:0px;top:10.1rem;width:100%;z-index:99;}
.ul_list1 li{background:url('~assets/images/mc/dot.png') center top no-repeat;
background-size:auto .171875rem;height:.18rem;width:.3125rem;margin-right:.234375rem;text-align:center;display:inline-block;}
.ul_list1 li.active{background:url('~assets/images/mc/dot-on.png') center top no-repeat;background-size:.28125rem .171875rem;}
  }
</style>
