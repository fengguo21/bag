<template>
  <div class="kv">
    <img v-bind:src="imgsrc">
    <div class="card">
      <div class="cardimg" @click="call_dialog()">
        <img :src="card.card_img[0]" v-if="card.card_level=='电子会员'">
        <img :src="card.card_img[1]" v-if="card.card_level=='银卡'">
        <img :src="card.card_img[2]" v-if="card.card_level=='特选银卡'">
        <img :src="card.card_img[3]" v-if="card.card_level=='金卡'">
        <img :src="card.card_img[4]" v-if="card.card_level=='钻石卡'">
        <div class="cardcode">
          <img src="~assets/images/mc/index-code.png">
        </div>
      </div>
      <div class="cardtxt">{{card.card_level}}
        <br>{{card.card_num}}</div>
    </div>
    <router-link :to="{name:'selfscore'}" class="btn_mypoint"></router-link>
    <ul class="ul_jflist">
      <li v-for="item in scorejf">
          <span class="score">{{item.score}}分</span>
          <br>{{item.year}}年积分
        <span class="clearfix"></span>
      </li>
    </ul>
    <!--活动列表 end-->
    
  </div>
</template>
<script>
  import Vue from 'vue' 
  export default {
    data() {
      return {
        imgsrc: require("assets/images/mc/kv.jpg"),
        card: {
          card_img: [require("assets/images/mc/member.png"), require("assets/images/mc/sliver1.png"), require(
            "assets/images/mc/sliver2.png"), require("assets/images/mc/gold01.png"), require(
            'assets/images/mc/gold02.png')],
          "card_level": "",
          "card_num": ""
        },
        scorejf: [],
        qrcodetxt:"",
        year: "",
        dialogVisible1: false
      }
    },
    mounted() {
      this.getmember()
      var myDate = new Date()
      var year = myDate.getFullYear()
      this.year = year
      var pastyear = year - 1
      this.scorejf.push({
        score: this.$store.state.member.memberpoint,
        year: year
      })
      if (this.$store.state.member.pastpoint > 0) {
        this.scorejf.push({
          score: this.$store.state.member.pastpoint,
          year: pastyear
        })
      }
    },
    components: {
    },
    methods: {
      getmember() {
        var that = this
        that.card.card_level = that.$store.state.member.gradenme
        that.card.card_num = that.$store.state.member.cardnum
        //var dateget=that.getNowFormatDate()
        //var txt=that.getmd5(that.card.card_num+"|"+dateget)
       // that.qrcodetxt=that.card.card_num+"|"+dateget+"|"+txt
      },
      call_dialog(){
          this.$emit('newNodeEvent', true)
      }
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../../static/css/main.less';
  .ul_jflist {
    right: .3125rem;
    top: .3125rem;
    position: absolute;
    color: rgba(255, 255, 255, 0.5);
    text-align: right;
  }

  .ul_jflist li {
    clear: both;
    background: url('~assets/images/mc/icon-line.png') right bottom no-repeat;
    padding-bottom: .234375rem;
    margin-bottom: .390625rem;
  }

  .ul_jflist .score,
  .ul_jflist a .score {
    color: #d3b692;
    font-size: @ttsize;
    font-weight: bold;
  }

  .ul_jflist a {
    color: rgba(255, 255, 255, 0.5);
  }

  .kv {
    position: relative;
   /*  height:35%;
    z-index:3;
    overflow-y:hidden; */
  }

  .kv img {
    width: 100%;
  }

  .kv .card {
    position: absolute;
    left: .3125rem;
    bottom: .46875rem;
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
  }

  .kv .cardimg {
    float: left;
    position: relative;
  }

  .kv .cardimg img {
    width: 1.5rem;
  }

  .kv .cardimg .cardcode {
    position: absolute;
    right: 0.12rem;
    bottom: 0.08rem;
  }

  .kv .cardimg .cardcode img {
    width: 0.3rem;
  }

  .kv .cardtxt {
    float: left;
    font-weight: bold;
    margin-left: .21875rem;
    line-height: @lineheight;
  }

  .btn_mypoint {
    position: absolute;
    bottom: 0.6rem;
    right: 0rem;
    background: url('~assets/images/mc/btn-jf.png') no-repeat;
    width: 2.3rem;
    height: .8rem;
    background-size: 2.3rem auto;
  }

  .footdscp {
    padding-bottom: .15625rem;
  }
 
/* @media (min-height: 810px){  
.kv{height:29%;}
}  */
</style>
