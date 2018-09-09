<template>
  <div class="navbar" style='position: relative'>
  <div style="height:100px;float:left;"><img src="../../assets/1134630311.jpg" style="padding-top:20px;height:60px;" align="left"></div>
  <div style="width:800px; float:right;">
<ul class="menu" id="menu">

  <li style="margin-left:10px">
    <router-link to='/products?tagName=Kh%C3%A1c' class="menulink_1" target="_self">
      <font>
        <font> Khác</font>
      </font>
    </router-link>
  </li>
  <li style="margin-left:10px">
    <router-link to='/products?tagName=%C3%90%C3%A8n%20LED' class="menulink_1" target="_self">
      <font>
        <font> đèn LED</font>
      </font>
    </router-link>
  </li>
  <li style="margin-left:10px">
    <router-link to='/products?tagName=Linh%20Ki%E1%BB%87n' class="menulink_1" target="_self">
      <font>
        <font> linh kiện</font>
      </font>
    </router-link>
  </li>

  <li>
    <router-link to='/products?tagName=Ph%E1%BB%A5%20Ki%E1%BB%87n' class="menulink_1" target="_self">
      <font>
        <font>phụ kiện</font>
      </font>
    </router-link>
  </li>

 

  <li>
    <router-link to='/products?tagName=%C4%90i%E1%BB%87n%20tho%E1%BA%A1i%20%26%20M%C3%A1y%20t%C3%ADnh%20b%E1%BA%A3ng' id="menu4" class="menulink_1" target="_self">
      <font>
        <font @click='queryAll'>Điện thoại&Máy tính bảng</font>
      </font>
    </router-link>
  </li>

  <li>
    <router-link :to="{path:'/'}" id="menu5" class="menulink_1" target="_self">
      <font>
        <font>Trang chủ</font>
      </font>
    </router-link>
  </li>
</ul>
<div style="position:absolute;top:60px;z-index:1000;margin-bottom: 15px;color:#eee;font-size:17px;">Chuyên bán sỉ, cơ hội kinh doanh cho các đối tác!</div>
</div>
<div style="clear:both"></div>

<div style="float:left; width:758px; padding-top:15px;">

<div class="clear"></div>

<!-- 搜索框 -->
<div style="margin:0 auto; width:370px; overflow:hidden; display:flex;">
    <el-input placeholder='Vui lòng nhập nội dung tìm kiếm' icon="search" v-model='title'></el-input>
    <el-button @click='search'>Tìm kiếm</el-button>
</div>
</div>
<!-- 登陆注册跳转 -->
<div id="reg">
<div v-if='!isLoged'>
  <router-link :to="{path:'/signIn'}">
    <font>
      <font class="">Đăng nhập</font>
    </font>
  </router-link>
</div>
<div v-if='isLoged'> 
  <router-link :to="{path:'/user'}">
    <font>
      <font style='display:inline-block; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0; line-height: 1.5'>Xin chào~ {{username}}</font>
    </font>
  </router-link>
</div>
<div v-if='!isLoged'>
  <router-link :to="{path:'/signUp'}">
    <font>
      <font>Đăng ký tài khoản</font>
    </font>
  </router-link>
</div>
<div v-if='isLoged'>
  <a style='cursor:pointer' @click='signOut'>
    <font>
      <font>Đăng xuất</font>
    </font>
  </a>
</div>
<div>
  <router-link :to="{path:'/cart'}">
    <font>
      <font>Giỏ hàng của tôi</font>
    </font>
  </router-link>
</div>
</div>
<div class="clear"></div><div class="clear"></div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import store from 'store'
  export default {
    name: 'navbar',
    computed: {
      ...mapGetters([
        'itemsQuantity',
        'tags'
      ]),
      query() {
        return this.$route.query
      }
    },
    watch: {
      $route(newVal, oldVal) {
        // console.log(newVal, oldVal);
        if(oldVal.path === "/signIn" && newVal.path === "/") {
          if(!store.get('user')) {
            this.isLoged = false
          } else {
            this.username = store.get('user').basic.name;
            this.isLoged = true
          }
        }
      },
    },
    created() {
      if(!store.get('user')) {
        this.isLoged = false
      } else {
        this.username = store.get('user').basic.name;
        this.isLoged = true
      }
      if(this.tags.length > 0) {
        this.getTags = this.tags
      } else {
        this.getTags = store.get('tags');
      }
    },
    data() {
      return {
        activeIndex: '1',
        isLoged: false,
        username: '',
        getTags: [],
        title: '',
      };
    },
    methods: {
      search() {
        // console.log(this.title);
        this.$router.push({path: '/search-pro', query: {title: this.title}})
      },
      signOut() {
        this.username = '';
        store.clearAll();
        this.isLoged = false;
        this.$router.push('/signIn')
      },
      queryAll() {
			this.$emit('lookAll');
		}
    }
  };
</script>
<style scoped>
.x {
  text-overflow: hidden;
  white-space: columns; 
}
/*---menu top-------*/
#s_menu_top{height:94px;}
ul.menu{list-style:none; margin:0; padding:0; z-index:111;}
ul.menu *{margin:0; padding:0; z-index:111; text-transform:uppercase;font-size:15px;}
ul.menu a{display:block; color:#FFF; text-decoration:none;z-index:111;}
ul.menu li{position:relative;float:right; margin-right:2px; font-size:12px; /*text-shadow:#abb9ca -1px 0px;*/ z-index:111;}
ul.menu li a{ line-height:44px;}
ul.menu .menulink_1{padding:0 15px; z-index:1; color:#BEBEBE;}
ul.menu a.menu-active{  background:url(../../assets/images/bg_menu.jpg) repeat-x; padding:0 15px;line-height:44px;  color:#fff;}
ul.menu ul{position:absolute; left:0; background:#E7E7E7;display:none; opacity:0; list-style:none; z-index:999; padding:0 7px 0 7px; margin-top:-2px;}
ul.menu ul li{position:relative; text-align:left; min-width:190px; text-transform:none; font-size:12px; border-bottom:1px solid #FFFFFF; margin:0 5x 0 5px;/* text-shadow:#aab8c9 -1px 0px;*/z-index:111;}
ul.menu ul li a{display:block; padding:0px 7px 0px 15px; background:#E7E7E7;color:#3E3E3E;z-index:111;}
ul.menu ul li a:hover {color:#930000;z-index:111;  padding:0px 7px 0px 15px;border-bottom:solid 1px #FFF; margin:1px 0px 0 0px; background:#FFFFFF;}
ul.menu ul ul{left:148px; top:1px; z-index:111;}

ul.menu .menulink_1:hover, ul.menu .menuhover{background:url(../../assets/images/bg_menu.jpg) repeat-x; padding:0 15px;line-height:44px;  color:#fff;z-index:111;height:94px;}
ul.menu .menulink{padding:0 15px;z-index:111;}
ul.menu .menulink:hover, ul.menu .menuhover {color:#224349;z-index:111;}

ul.menu .su{background:#e7f6fd;}
ul.menu .topline{border:1px solid #b4dae6;}

.catcha{ float:left; height:45px; margin-top:8px;}
.catcha a:hover{ background:url(../../assets/images/bg_cat_cha2.jpg) repeat-x; height:45px;padding:7px 15px; }
.catcha a{ font-size:15px; font-family:Arial, Helvetica, sans-serif; color:#fff; text-transform:uppercase;padding:7px 15px; }
.text_form_se_2{background:none; width:250px; color:#fff; border:none; padding-top:5px; outline: none;}
#reg{position: absolute; right: -15px; bottom: 10px;}
#reg div{float:left; background:url(../../assets/images/bg_reg.jpg) left 11px no-repeat; margin-right:10px; font-size:16px; font-family:Myriad Pro,Arial, Helvetica, sans-serif; padding-top:7px; color:#fff;}
#reg a{ color:#fff;}
#reg span{font-size:12px; font-weight:600; font-family:Arial, Helvetica, sans-serif;}
#reg font{ padding:7px;}
#reg font a{color:#00AFF0;font-size:12px; font-weight:100;}
#reg font a:hover{text-decoration:underline;}
</style>
