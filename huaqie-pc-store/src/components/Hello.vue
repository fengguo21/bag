<template>
<div id="page">
<div id="header">


<div style="float:left; border:1px solid #474747;width:756px; overflow:hidden; height:336px;">
<!-- 轮播图 -->
	<el-carousel :interval="3000" arrow="hover">
		<el-carousel-item v-for="(item, index) in bannerImgs" :key="index">
			<img :src="item">
		</el-carousel-item>
	</el-carousel>

</div>

<div style="float:left; width:225px; margin-left:15px; margin-bottom:17px;">
	<right-nav v-for='(item, index) in rightNav' :content='item' :key='index'></right-nav>
</div>
    
<div class="clear"></div>
<h2 class="hot" v-if='hotSales.length > 0'>HOT SELL</h2>
<!-- 热门销售商品 -->
<div style='width: 100%; height: 172px;'  v-if='hotSales.length > 0'>
    <hot-sale :detail='item.basic' :prodata='item' v-for='(item, key) in hotSales' :key='key'></hot-sale>
</div>

<div class="clear"></div>
<!--<div class="borSDA" align="left">
<!-- 热门产品 -->
	
	<div class="clear"></div>
</div>
<div class="categoryhome" v-for='item in tagList'>
	<tab-card :more='true' @lookAll='queryAll(item.basic.title)'>{{item.basic.title}}</tab-card>   
	<div class="producthomenew">    
		<product v-for='(item, index) in proSes[item.basic.title]' :key='index' :prodata='item'></product>
	    <div class="clear"></div>
	</div>
</div>

</div>

</div>
</template>

<script>
  import { mapActions } from 'vuex'
  import Slideshow from './homepage/Slideshow';
  import hotSale from './shared/hotSale';
  import tabCard from './shared/tabCard';
  
  import hotProduct from './shared/hotProduct';
  import product from './shared/product';
  import rightNav from './shared/bannerRight'
  import { getSessionId, getProductList, getTagList } from '@/api/api'
  import store from 'store'
  export default {
    name: 'hello',
    created() {
      if(!store.get('sessionId')) {
        getSessionId({}).then(res => {
          // console.log(res);
          if(res.code === 0) {
            store.set('sessionId', res.data);
            this.getTags();
          } else {
            this.$message.error({
              message: res.message
            })
          }
        })
      } else {
        this.getTags();
        this.getHotSell()
      }
    },
    data() {
      return { 
      	ulLength: 0,
        left: 0,
        productList: [],
        proListByTag: {},
        proSes: {},
        tagList: [],
      	bannerImgs: [
      		'http://dn-huaqie.qbox.me/mmexport1506941920550.jpg',
      		'http://dn-huaqie.qbox.me/mmexport1506942129629.jpg',
      		'http://dn-huaqie.qbox.me/mmexport1506942138451.jpg',
      		'http://dn-huaqie.qbox.me/mmexport1506942146856.jpg',
      		'http://dn-huaqie.qbox.me/mmexport1506942153471.jpg',
      		'http://dn-huaqie.qbox.me/mmexport1506942161224.jpg'
      	],
      	rightNav: [
      		{
      			imgUrl: require('../assets/images/right_1.png'),
      			title: ' Hướng dẫn mua',
      			path: '/advantage/guide'
      		},
      		{
      			imgUrl: require('../assets/images/right_2.png'),
      			title: 'Chính sách bảo hành',
      			path: '/advantage/product'
      		},
      		{
      			imgUrl: require('../assets/images/right_3.png'),
      			title: 'Phương thức giao hàng',
      			path: '/advantage/delivery'
      		},
      		{
      			imgUrl: require('../assets/images/right_4.png'),
      			title: 'Đổi mới trong 15 ',
      			path: '/advantage/replace'
      		},
      		{
      			imgUrl: require('../assets/images/right_5.png'),
      			title: ' Chính sách bảo mật',
      			path: '/advantage/service'
      		},
      	],
      	hotSales: []  
      };
    },
    computed: {
    },
    methods: {
      ...mapActions([
          'getTag'
      ]),
      queryAll(val) {
        // console.log(val);
        this.$router.push({path: '/products', query: {tagName: val}});
      },
      getHotSell() {
        // console.log(tagId, tag);
        getProductList({
          hot: 1,
          page: 1,
          size: 6
        }).then(res => {
          if(res.code === 0) {
             this.hotSales = res.data.list;
             // console.log(res.data);
          } else {
            this.$message.error({
              message: res.message
            })
          }
        })
      },
      getProList(tag) {
        // console.log(tagId, tag);
        getProductList({
          tagName: tag,
          page: 1,
          size: 4
        }).then(res => {
          if(res.code === 0) {
            this.proListByTag[tag] = res.data.list;
            this.proSes = Object.assign({}, this.proListByTag);  
          } else {
            this.$message.error({
              message: res.message
            })
          }
        })
      },
      getTags() {
        getTagList({
          page: 1,
          size: 30
        }).then(res => {
          if(res.code === 0) {
            // console.log(res)
            this.tagList = res.data.list;
            // console.log(res.data.list);
            this.getTag(res.data.list);
            store.set('tags', res.data.list);
            this.tagList.map(item => {
              this.proListByTag[item.basic.title] = [];
              this.getProList(item.basic.title);
            });
          } else {
            this.$message.error({
              message: res.message
            })
          }
        })
      }
    },
    components: {
      Slideshow,
      hotSale,
      tabCard,
      hotProduct,
      product,
      rightNav
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hot{
  	text-align:left;
  	color: red;
  	font-size: 25px;
  	margin-bottom: 20px;
  }
</style>
