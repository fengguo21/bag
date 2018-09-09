<template>
<div>
<div style="border:1px solid #2C2C2C; margin:10px 0;">
    <div class="textCenter" style='font-size: 0'>
        <!--<img src="../assets/images/eqj1385474362.jpg" alt="新太科技NOMU U1" title="新太科技NOMU U1" border="0">-->
    </div>
</div>

<tab-card v-if='seePro.basic.tags[0]'>{{seePro.basic.tags[0]}}</tab-card>
<div style="background:#F6F6F6; width:1000px; padding-bottom:14px;">
<div id="homeaddress" style='padding-top: 30px;'>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">Trang chủ</el-breadcrumb-item>
      <el-breadcrumb-item>{{seePro.basic.tags[0]}}</el-breadcrumb-item>
    </el-breadcrumb>
</div>
<div style="width:100%; float:left">
    <div id="left_product_detail">
    <!-- 大图 -->
        <div style="border:2px solid #CCCCCC;background:#FFFFFF; margin:20px;" align="center">
            <span class='big-pic' @click='showLarge(1)'>
                <img :src="seePro.basic.avatar" style='width: 100%'>
            </span>
        </div>

        <div id="images_detail_product" align="center">
            <span v-for='(item, key) in seePro.basic.album' @click='showLarge(key+1)'>
                <img :src="item.url" :alt='item.name' height="50" vspace="4" hspace="4">
            </span>
        </div>
    </div>
    <gd-overview 
      :parameters='seePro.basic.parameters' 
      :specs='specs'
      :name='seePro.basic.title'
      :pro='selectPro'
      @select='selectChange'
    ></gd-overview>
</div>
<div class="clear"></div>

<div id="detail_tab_bottom">
    <el-tabs type="border-card">
      <el-tab-pane label="Thông tin chi tiết">
          <tab-overview :desc='seePro.basic.desc'></tab-overview>
      </el-tab-pane>
      <!-- <el-tab-pane label="产品规格">
          <tab-prosize :prosize='seePro.basic.parameters'></tab-prosize>
      </el-tab-pane> -->
      <el-tab-pane label="Liên lạc">
          <tab-service></tab-service>
      </el-tab-pane>
    </el-tabs>
</div>
<div class="clear"></div>
</div>

<!-- 图片轮播 -->
<el-dialog
  :visible.sync="showLargeDialog"
  :show-close='false'
>
  <el-carousel style='height:435px;' trigger='click' :initial-index='openIndex'>
    <el-carousel-item style='height:100%' v-for="(item, index) in seePro.basic.album" :key="index">
      <img :src="item.url" :alt='item.name' style='width: 100%; height: 435px'>
    </el-carousel-item>
  </el-carousel>
</el-dialog>

</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { get, remove } from '@/api/common'
import lazy from '@/router/lazy'; //懒加载工具 需要 babel 并且配置webpack
import tabCard from '@/components/shared/tabCard';
import gdOverview from '@/components/shop/detail/overview';
// tab组件运用懒加载对页面进行优化
let tabOverview = lazy('/shop/detail/tabs/overview');
// let tabProsize = lazy('/shop/detail/tabs/productSize');
let tabService = lazy('/shop/detail/tabs/service');
export default {
    name: 'product',
    components: {
        tabCard,
        gdOverview,
        tabOverview,
        // tabProsize,
        tabService
    },
    computed: {
      ...mapGetters([
          'nowPro'
      ]),
      seePro() {
        if(this.nowPro) {
          return this.nowPro;
        } else {
          return get('seePro');
        }
      },
    },
    created() {
      let sel = Object.assign({}, this.seePro);
      this.seePro.basic.specs.forEach((item, index) => {
        if(index == 0) {
          this.specs.push({
            specs: item,
            isSelect: true
          })
          sel.selectSpecs = item;
        } else {
          this.specs.push({
            specs: item,
            isSelect: false
          })
        }
      });
      this.selectPro = sel;
    },
    destroyed() {
      remove('seePro')
    },
    data() {
        return {
            openIndex: 0,
            showLargeDialog: false,
            specs: [],
            selectPro: {},
        }
    },
    methods: {
        showLarge(index) {
            this.openIndex = index;
            this.showLargeDialog = true
        },
        selectChange(val) {
          // console.log(val);
          let selectPro = JSON.parse(JSON.stringify(this.selectPro))
          let sp = JSON.parse(JSON.stringify(this.specs))
          sp.forEach(item => {
            item.isSelect = false
            if(item.specs == val.specs) {
              item.isSelect = true;
            }
          })
          selectPro.selectSpecs = val.specs;
          // console.log(selectPro);
          this.selectPro = selectPro;
          this.specs = sp;
        }
    }
};
</script>

<style type="text/css" scoped>
.big-pic {
    display: block;
    width: 100%;
    font-size: 0;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}
  
.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}
  
.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

.form{border:1px solid #7F9DB9; height:22px;}
td{
	text-align: left;
}

#detail_tab_bottom{ margin:20px 25px 25px 20px; padding-top:3px;}
#detail_tab_bottom .title_select{ background:url(../assets/images/tab_detail_select.jpg) repeat-x -29px; height:29px; float:left; line-height:29px; margin-right:3px; width:150px; overflow:hidden;}
#detail_tab_bottom .title_select .tab_left{ background:url(../assets/images/tab_detail_select.jpg) no-repeat left top; height:29px; text-align:center; float:left}
#detail_tab_bottom .title_select .tab_right{ background:url(../assets/images/tab_detail_select.jpg) no-repeat right bottom; height:29px; font-weight:bold; color:#3B7EA1; width:150px; cursor:pointer;}
#detail_tab_bottom .title_normal{  height:29px; float:left; line-height:29px; margin-right:3px; width:150px; overflow:hidden;}
#detail_tab_bottom .title_normal .tab_left{ height:29px; text-align:center;}
#detail_tab_bottom .title_normal .tab_right{height:25px; font-weight:bold; color:#000;width:150px; cursor:pointer;}
#detail_tab_bottom .tab_content{ display:none; width:930px; border-top:none; text-align:left; margin:10px}
#sub_showroom #abc{padding:0px 0 10px 10px;}
.thuoctinh_cat{ color:#000; font-size:12px; font-weight:600; padding:10px 0 10px 0; background:#F6F6F6;}

</style>
