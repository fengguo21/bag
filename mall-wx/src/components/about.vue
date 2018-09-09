<template>
<div>
<div class="articlebox" >
<vueLoading v-show="vueload"></vueLoading>
<div class="cont" v-html="phtml">
</div>
</div>
 </div>
</template>
<script>
import vueLoading from '../components/vueload'
//var vueLoading=require('@/components/vueload.vue').default
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
    created() {
       if(document.getElementById('appLoading'))       {document.body.removeChild(document.getElementById('appLoading'))}
    },
   mounted(){
       this.$http.get(
          this.global_config.datapost.data_url+'/saas-api/api/portal/custom', {
            params: {
              dataSourceCode: this.global_config.datapost.dataSourceCode,
              repCode:'REP_001521', 
              wechator_id:this.$store.state.id,
              mall:1,  
              categoryname:"关于我们"
            }
          })
        .then(res => {
       this.vueload=false
         this.phtml =decodeURI(res.data.data[0].content)
        }).catch(function (res) {
          console.log(res);
        }); 
   },
    methods: {
    }
  }
</script>
<style lang="less" rel="stylesheet/less" >
  @import '../../static/css/main.less';
   .articlebox img{width:100%;margin-bottom:.3125rem;}
   .articlebox p{font-size:@ttsize2;margin-bottom:.3125rem;line-height:150%;color:#555555;}
   /* .articlebox section{padding-top:.78125rem;} */
   .articlebox .bnr img{border-bottom:2px solid #f3f5f9;margin-bottom:0px;}
   .articlebox h1{width:100%;height:.625rem;line-height:.625rem;
   background-size:100% .625rem;text-align:center;font-size:@ttsize2;font-weight:normal;margin-bottom:.3125rem;color:#000;}
  .articlebox .cont{padding:.3rem;color:#555555;font-size:@ttsize2;}
  .articlebox .vue-loading{padding-top:40%;}
</style>