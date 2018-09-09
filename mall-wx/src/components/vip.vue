<template>
<div>
<div class="vipbox" >
<vueLoading v-show="vueload"></vueLoading>
<div class="cont"  v-html="phtml">

</div>
</div>
 </div>

</template>
<script>
import vueLoading from '../components/vueload'
 export default {
    data() {
      return {
          phtml:'',
        vueload:true
        }
    },
    components: {
        vueLoading
    },
    created(){
        if(document.getElementById('appLoading'))       {document.body.removeChild(document.getElementById('appLoading'))}
    },
   mounted(){
         //获取折扣详情 start
       this.$http.get(
          this.global_config.datapost.data_url+'/saas-api/api/portal/custom', {
            params: {
              dataSourceCode: this.global_config.datapost.dataSourceCode,
              repCode:'REP_001218',     
              mall_id:1
            }
          })
        .then(res => {
         this.vueload=false
         this.phtml = decodeURI(res.data.data[0].content)
        }).catch(function (res) {
          console.log(res);
        });
      //获取折扣详情 end   
   },
    methods: {
    }
  }
</script>
<style lang="less" rel="stylesheet/less" >
  @import '../../static/css/main.less';
   .vipbox img{width:100%;margin-bottom:.3125rem;}
   .vipbox p{font-size:@ttsize2;margin-bottom:.3125rem;line-height:150%;color:#555555;}
   .vipbox section{padding-top:.78125rem;}
   .vipbox .bnr img{border-bottom:2px solid #f3f5f9;margin-bottom:0px;}
   .vipbox h1{color: #000;font-weight: bold;font-size: @ttsize2;margin-bottom:.3125rem;}
    .vipbox .cont{padding:.3rem;color:#555555;font-size:@ttsize2;}
    .vipbox li{list-style:disc;margin-bottom:.3125rem;margin-left:0.45rem;}
     .vipbox .vue-loading{padding-top:40%;}
</style>