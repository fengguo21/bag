<template>
  <div class="brand_box" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" ref="itembox1">
    <div class="topbar">
      <div class="searchbox">
        <input type="text" value="" placeholder="请输入品牌名" v-model.trim="searchtxt"></input>
      </div>
      <div class="searchtab">
        <ul class="list">
          <li v-for="(item,index) in tabs" :class="{active:index == num}" @click="tab(index)">
            <a href="#">{{item}}
              <i :class="[index==num?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
            </a>
          </li>
        </ul>
        <div class="clear"></div>
        <!--panel start-->
        <div class="panel" v-show="num==0">
          <h2>请选择类别</h2>
          <ul>
            <li :class="{active:-1 == panel_num1}" @click="chgpanel_1('-1','')">全部</li>
            <li v-for="(item,index) in cate1_arr" :class="{active:index == panel_num1}" @click="chgpanel_1(index,item)">{{item.category_name}}</li>
          </ul>
          <div class="clear"></div>
        </div>
        <div class="panel" v-show="num==1">
          <h2>请选择楼层</h2>
          <ul>
            <li :class="{active:-1 == panel_num2}" @click="chgpanel_2('-1','')">全部</li>
            <li v-for="(item,index) in cate2_arr" :class="{active:index == panel_num2}" @click="chgpanel_2(index,item)">{{item.floor_name}}</li>
          </ul>
          <div class="clear"></div>
        </div>
        <!--panel start-->
        <div class="panel" v-show="num==2">
          <h2>请选择字母</h2>
          <ul>
            <li :class="{active:-1 == panel_num3}" @click="chgpanel_3('-1','')">全部</li>
            <li v-for="(item,index) in cate3_arr" :class="{active:index == panel_num3}" @click="chgpanel_3(index,item.nme)">{{item.nme}}</li>
          </ul>
          <div class="clear"></div>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <div class="itembox">
      <!--<vueLoading v-show="vueload"></vueLoading>-->
      <div class="itemlist" v-for="item in branddata">
        <div class="img" @click="godetail(item.id)">
          <img :src="(item.store_logo=='' || item.store_logo==null)?defaultlogo:item.store_logo">
        </div>
        <div class="itemtext" @click="godetail(item.id)">
          <h1>{{item.store_display_name}}</h1>
          <div class="floor">位置： {{item.store_location}}</div>
        </div>
        <a class="phone" href="javascript:void(0)" @click="opentel(item.store_phone)"></a>
        <div class="vipicon" v-if="item.discounts?true:false">
          <img src="~assets/images/mc/icon-vip.png">
        </div>
        <div class="vipicon2" v-if="item.shopping_card_accepted==1?true:false">
          <img src="~assets/images/mc/icon-vip2.png">
        </div>
        <div class="clear"></div>
      </div>
      <!--itemlist end-->
      <div class="loadingstate">
        <svg class="icon" :class="{'icon-loading': moredata}" aria-hidden="true">
          <use :xlink:href="iconLink"></use>
        </svg>&nbsp;{{stateText}}</div>
    </div>
    <div class="mask" v-show="num!=-1" @click="num=-1"></div>
    <el-dialog title="一键拔打" class="smallDialog" :visible.sync="dialog_phone" width="65%" :modal-append-to-body="false" center
      top="25vh">
      <center>
        <div v-for="item in phone_arr">
          <a :href="'tel:'+item" class="tel">{{item}}</a>
        </div>
      </center>

    </el-dialog>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less';
  /*加载更多样式 start*/

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .icon-arrow {
    transition: .2s;
    transform: rotate(180deg);
  }

  .icon-loading {
    transform: rotate(0deg);
    animation-name: loading;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /*加载更多样式 end*/

  .topbar {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    z-index: 99;
    background: #fff;
  }

  .mask {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 2;
    background: rgba(0, 0, 0, 0.5);
  }

  .brand_box {
    background: #eceff5;
    /*min-height:100%;
    position:absolute;
   */
    height: 100%;
    width: 100%;
    overflow-y: scroll;
  }

  .brand_box .itemlist {
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

  .brand_box h1 {
    font-size: @ttsize;
    margin-bottom: .15rem;
  }

  .brand_box .itemlist .floor {
    margin-bottom: .3125rem;
    color: rgba(48, 48, 48, 0.5);
  }

  .brand_box h2 i {
    color: #000;
    margin-right: 5px;
  }

  .brand_box .itemlist .img img {
    width: 1.875rem;
    height: auto;
  }

  .brand_box .itemlist .img {
    float: left;
    padding: 0 .3125rem 0 .3125rem;
  }

  .brand_box .itemlist a {
    color: #b97b00;
  }

  .brand_box .itemlist .itemtext {
    width: 4.5rem;
  }

  .brand_box .searchbox {
    padding: .3125rem 0;
    background: #fff;
    border-bottom: 1px solid #c3c3c3;
    box-shadow: 0px 5px 5px #eeeeee;
  }

  .brand_box .searchbox input {
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

  .brand_box .itembox {
    background: url('~assets/images/brand/brand-bg.jpg') left top no-repeat;
    background-size: 10rem .890625rem;
    padding-top: 3.5rem;
    position: relative;
    z-index: 1;
  }

  .brand_box .phone {
    border-left: 1px solid #d4d4d5;
    height: .625rem;
    display: block;
    background: url('~assets/images/brand/icon-phone2.png') 0.5rem center no-repeat;
    background-size: .46875rem .5rem;
    padding-left: .25rem;
    width: 1.5625rem;
  }

  .brand_box .searchtab {
    background: #fff;
    padding: .46875rem 0;
    height: 100%;
  }

  .brand_box .searchtab .list li {
    float: left;
    font-size: @ttsize2;
    border-right: 1px solid #2a292c;
    width: 33%;
    text-align: center;
  }

  .brand_box .searchtab .list li i {
    margin-left: 5px;
  }

  .brand_box .searchtab .list li:last-child {
    border-right: none;
  }

  .brand_box .searchtab .panel {
    padding: .4rem 0 0px .46875rem;
    max-height: 14rem;
    overflow-y: scroll;
  }

  .brand_box .searchtab .panel h2 {
    color: #a7a7a7;
    font-size: @ttsize2;
    margin-bottom: .3125rem;
  }

  .brand_box .searchtab .panel li {
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

  .brand_box .searchtab .panel li:last-child {
    margin-right: 0px;
  }

  .brand_box .searchtab .panel li.active {
    background: #2b2b2d;
    color: #fff;
  }

  .brand_box .vipicon {
    position: absolute;
    right: 0px;
    top: 0px;
  }

  .brand_box .vipicon img {
    width: 1.03125rem;
    height: 1.03125rem;
  }

  .brand_box .vipicon2 img {
    width: 1.03125rem;
    height: .359375rem;
    position: absolute;
    right: -3px;
    top: 1.05rem;
  }

  .loadingstate {
    height: 30px;
    font-size: @ttsize;
    text-align: center;
    line-height: 30px;
  }

  .vipicon2 {
    position: absolute;
    right: 0px;
    bottom: 2.0rem;
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
  require('assets/icon/iconfont')
  export default {
    data() {
      return {
        panel_num1: -1,
        panel_num2: -1,
        panel_num3: -1,
        searchtxt: "",
        branddata: [],
        cate1_arr: [],
        cate2_arr: [],
        cate3_arr: [],
        cateid: "",
        floorid: "",
        pinyin: "",
        tabs: ["全部分类", "楼层", "按字母"],
        num: -1,
        moredata: true,
        busy: false,
        pagenum: 1,
        pagesize: 10,
        iconLink: '#icon-loading',
        stateText: '努力加载中',
        popup: false,
        defaultlogo: 'https://shengyiplus.idata.mobi/saas_images/ifs/store/defaultlogo.jpg',
        offtop: 0,
        shoptop: 0,
        dialog_phone: false,
        phone_arr: [],
        totalPage: 0
      }
    },
    components: {},
    watch: {
      searchtxt() {
        delay(() => {
         // this.branddata=[]
          this.search()
        }, 800);
      },
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    //缓存组件加载页面执行事件
    activated: function () {
      if (sessionStorage.getItem("shoptop")) {
        this.$refs.itembox1.scrollTop = sessionStorage.getItem("shoptop")
      }
    },
    mounted() {
      //获取全部分类
      this.$http.get(
          this.global_config.datapost.data_url + '/saas-api/api/portal/custom', {
            params: {
              dataSourceCode: this.global_config.datapost.dataSourceCode,
              repCode: 'REP_001396',
              wechator_id: this.$store.state.id,
              mall: 1
            }
          })
        .then(res => {
          this.cate1_arr = res.data.data;
        }).catch(function (res) {
          console.log(res);
        });
      //获取楼层
      this.$http.get(
          this.global_config.datapost.data_url + '/saas-api/api/portal/custom', {
            params: {
              dataSourceCode: this.global_config.datapost.dataSourceCode,
              wechator_id: this.$store.state.id,
              repCode: 'REP_001397',
              mall: 1
            }
          })
        .then(res => {
          this.cate2_arr = res.data.data;
        }).catch(function (res) {
          // console.log(res);
        });
      //按字母
      this.$http.get(this.global_config.datapost.url + '/static/cate3.json').then(res => {
        this.cate3_arr = res.data;
      })
    },
    methods: {
      aa() {
        // console.log(this.offtop)
        return this.offtop
      },
      //跳转到详情
      godetail(id) {
        var that = this;
        that.shoptop = that.$refs.itembox1.scrollTop
        sessionStorage.setItem("shoptop", that.shoptop)
        /*    that.$router.replace({
             query: {
               shoptop: that.shoptop
             }
           }) */
        that.$router.push("/branddetail/" + id)
      },
      //切换选项卡
      tab(index) {
        if (this.num == index) {
          this.num = -1;
        } else {
          this.num = index;
        }
      },
      //切换分类 start
      chgpanel_1(index, item) {
        this.panel_num1 = index
        this.cateid = item.id
        this.num = -1
        if (index == -1) {
          this.tabs[0] = "全部"
        } else {
          this.tabs[0] = item.category_name
        }
        // this.offtop=this.$refs.leftmenu.scrollTop
        this.init()
        // this.loadbrand()
      },
      //切换楼层
      chgpanel_2(index, item) {
        this.panel_num2 = index
        this.floorid = item.id
        this.num = -1
        if (index == -1) {
          this.tabs[1] = "全部"
        } else {
          this.tabs[1] = item.floor_name
        }
        this.init()
        // this.loadbrand()
      },
      //切换字母
      chgpanel_3(index, pinyin) {
        this.panel_num3 = index
        this.pinyin = pinyin
        this.num = -1
        if (index == -1) {
          this.tabs[2] = "全部"
        } else {
          this.tabs[2] = pinyin
        }
        this.init()
        // this.loadbrand()
      },
      //搜索
      search() {
        this.init()
        //this.loadbrand()
      },
      //确定拔打电话
      opentel(tel) {
        //this.opentel1(tel);
        this.phone_arr = tel.split(' ')
        this.dialog_phone = true
      },
      //加载更多
      loadMore() {
        var that = this
        that.busy = true
        setTimeout(() => {
          that.loaddata()
        }, 10);
      },
      async loaddata() {
        var that = this
        let res = await this.loadbrand()
        /*==处理数据 start===*/
         try {
        var resdata = res.data.data;
        var temparr= that.branddata;
        if (resdata.length > 0) { //如果有返回数据  
          that.totalsize = resdata[0].totalSize //总记录数
          that.totalPage = resdata[0].totalPage //总页数
          that.loadcomp = true
          if (that.branddata != resdata) {
            temparr = that.branddata.concat(resdata)
          }
          //  temparr=temparr.concat(resdata)
         //   console.log(temparr)
          that.branddata = Array.from(new Set(temparr))
          // console.log("branddata"+that.branddata)
          that.pagenum = this.pagenum + 1 //页数累加
          if (that.pagenum <= that.totalPage && resdata.length >= that.pagesize) {
            that.moredata = true;
            that.busy = false
          } else {
            that.nodata()
          }
        } else { //没有返回数据
          that.nodata()
        }
          } catch (err) { //异常处理
         console.log(err)
        }
      },
      //加载品牌
      loadbrand() {
        var source = this.$route.query.source
        if (!source) {
          source = 0
        }
        if (source == 1) //不分页
        {
          this.pagesize = 400
        }
        let that = this;
        let searchnme = that.searchtxt;
        var pagenum = this.pagenum
        let url = this.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: this.global_config.datapost.dataSourceCode,
          repCode: 'REP_001394',
          wechator_id: this.$store.state.id,
          mall: 1,
          index: pagenum,
          size: that.pagesize,
          category: that.cateid,
          name: searchnme,
          floor: that.floorid,
          pinyin: that.pinyin,
          source: source
        }
        return this.$http.get(url, {
          params: params
        }) //获取品牌列表
      },
      //确定拔打电话 end
      //初始化
      init() {
        this.branddata = []
        this.busy = false
        //  this.pagesize =100
        this.pagenum = 1
        this.moredata = true
        this.iconLink = '#icon-loading'
        this.stateText = '努力加载中'
        this.loadMore()
      },
      nodata() {
        this.moredata = false
        this.busy = true
        this.stateText = "没有更多"
        this.iconLink = "#icon-finish"
        return false
      }
    }
  }

</script>
