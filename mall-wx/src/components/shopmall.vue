<template>
  <div class="shopbox">
    <div class="topbar">
      <myuser></myuser>
      <div class="searchbox">
        <input type="text" value="" placeholder="请输入礼品名称 / 关键词" v-model.trim="searchtxt"></input>
      </div>
      <div class="searchtab">
        <ul class="list">
          <li :class="[num==0?'active':'']" @click="tab(0)">
            <router-link  :to="{name: 'shopmallIndex'}" replace>{{sel_cate}}
              <i :class="[0==num?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
            </router-link>
          </li>
          <li :class="[num==1?'active':'']" @click="tab(1)">
          <a @click="gogift" href="javascript:void(0)">我的礼品</a>
          </li>
        </ul>
         <!--panel start-->
      <div class="panel" v-show="this.num==0">
        <h2>请选择类别</h2>
        <ul>
          <li v-for="(item,index) in cate1_arr" :class="{active:item.id == panel_num1}" @click="chgpanel_1(item.id,item.category)">{{item.category}}</li>
        </ul>
        <div class="clear"></div>
      </div>
        <div class="clear"></div>
      </div>
     
      <div class="clear"></div>
      
    </div>
  <router-view keep-alive ref="shoplist"></router-view>
  <div class="mask" v-show="num==0" @click="num=-1"></div>
  <!-- <shoplist></shoplist> -->
  </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  .shopbox {
    background: #eceff5;
    padding-top: 5.37rem;
  }
    
  .topbar {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    z-index: 99;
  }

  .itemlist {
    background: #fff;
    width: 93%;
    margin: 0px auto;
    position: relative;
    margin-bottom: .4rem;
    border-radius: @radius10;
    padding: .3125rem 0;
    display: flex;
    align-items: center;
    box-shadow: 0px 5px 5px #a8abb1;
  }
 .mask{ position: fixed;
    left: 0px;
    top: 0px;
    width:100%;
    height:100%;
    z-index:2;
    background:rgba(0,0,0,0.5);
    }
  h1 {
    font-size: @ttsize;
    margin-bottom: .15rem;
  }

  .itemlist .floor {
    margin-bottom: .3125rem;
    color: rgba(48, 48, 48, 0.5);
  }

  h2 i {
    color: #000;
    margin-right: 5px;
  }

  .itemlist .img img {
    width: 1.875rem;
    height: auto;
  }

  .itemlist .img {
    float: left;
    padding: 0 .3125rem 0 .3125rem;
  }

  .itemlist a {
    color: #b97b00;
  }

  .itemlist .itemtext {
    width: 4.5rem;
  }

  .searchbox {
    padding: .3125rem 0;
    background: #fff;
    border-bottom: 1px solid #c3c3c3;
    box-shadow: 0px 5px 5px #eeeeee;
  }

  .searchbox input {
    background: #f3f5f9 url('~assets/images/icon-search.png') 20% center no-repeat;
    background-size: .375rem auto;
    border: none;
    width: 93%;
    height: .90625rem;
    margin: 0rem auto;
    display: block;
    border-radius: @radius;
    text-align: center;
  }

  .itembox {
    background: url('~assets/images/brand/brand-bg.jpg') left top no-repeat;
    background-size: 10rem .890625rem;
    padding-top: .3125rem;
  }

  .phone {
    border-left: 1px solid #d4d4d5;
    height: .625rem;
    display: block;
    background: url('~assets/images/brand/icon-phone2.png') 0.5rem center no-repeat;
    background-size: .46875rem .5rem;
    padding-left: .25rem;
    width: 1.5625rem;
  }

  .searchtab {
    background: #fff;
    padding: .46875rem 0;
  }

  .searchtab .list li {
    float: left;
    font-size: @ttsize2;
    width: 50%;
    text-align: center;
  }

  .searchtab .list li i {
    margin-left: 5px;
  }

  .searchtab .list li:last-child {
   /* border-right: none;*/
   border-left:1px solid #ccc;
   width:49%;
  }

  .searchtab .panel {
    clear:both;
    padding: .546875rem 0 0px .46875rem;
  }

  .searchtab .panel h2 {
    color: #a7a7a7;
    font-size: @ttsize2;
    margin-bottom: .3125rem;
  }

  .searchtab .panel li {
    float: left;
    width: 28%;
    height: 1.0625rem;
    line-height: 1.0625rem;
    border-radius: @radius;
    border: .015625rem solid #d9d9d9;
    text-align: center;
    margin-right: .4rem;
    vertical-align: middle;
    font-size: @ttsize2;
    margin-bottom: .234375rem;
  }

  .searchtab .panel li:last-child {
    margin-right: 0px;
  }

  .searchtab .panel li.active {
    background: #2b2b2d;
    color: #fff;
  }
.searchtab .list li.active a{
 /*  color:@yellow; */
}
  .vipicon {
    position: absolute;
    right: 0px;
    top: 0px;
  }

  .vipicon img {
    width: 1.03125rem;
    height: 1.03125rem;
  }

  .vipicon2 img {
    width: 1.03125rem;
    height: .359375rem;
    position: absolute;
    right: -3px;
    top: 1.05rem;
  }

</style>
<script>
// 节流函数
  var delay = (function () {
    let timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  import myuser from '../components/public/myuser'
  import shoplist from '../components/public/shoplist'
/*   import {getDatas} from '@/api/api' */
   var api = require('@/api/api')
  var getDatas=api.getDatas
  export default {
    data() {
      return {
        test:3,
        searchtxt: "",
        branddata: [],
        cate1_arr: [],
        cate2_arr: [],
        cate3_arr: [],
        tabs: ["全部分类", ],
        sel_cate:"全部分类",
        num: -1,
        panel_num1: 0,
        panel_num2: 0,
        panel_num3: 0,
        codeShow: false
      }
    },
    created(){
      this.getCateList()
        if(document.getElementById('appLoading'))
         {document.body.removeChild(document.getElementById('appLoading'))}
    },
    mounted() {
      //获取全部分类
    },
    components: {
      myuser,
      shoplist
    }, watch: {
      //watch title change
      searchtxt() {
        delay(() => {
          this.$refs.shoplist.exchange(this.panel_num1,this.searchtxt)
        }, 300);
      },
    },
    methods: {
      gogift(){//跳转到我的礼品
       this.$router.replace({name:'myGift'})
      },
      //切换选项卡
      tab(index) {        
        if (this.num == index) {
          this.num = -1;
        } else {
          this.num = index;
        }
      },
      getCateList(){
      console.log('ex')
      let params = {
        repCode:'REP_001534',
        mall:1
      }
      getDatas(params).then((res)=>{
         this.cate1_arr = res.data;
         this.cate1_arr.unshift({id:0,category:'全部分类'})
         this.vueload=false
        this.eventdata=res.data
      }).catch(function (res) {
          console.log(res.data,'====');
         
        }); 
    },
      //切换分类
      chgpanel_1(id,nme) {
        this.panel_num1 = id;
        this.$refs.shoplist.exchange(id,this.searchtxt)
        this.num=-1
        this.sel_cate=nme
        //记住所选分类
        sessionStorage.setItem('panel_num1', this.panel_num1)
      },
      //确定拔打电话
      opentel(tel) {
        this.opentel1(tel);
      }
      //确定拔打电话 end 
    }
  }

</script>
