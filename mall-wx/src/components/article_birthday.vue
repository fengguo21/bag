<template>
<div class="birthdaybox" >
<vueLoading v-show="vueload"></vueLoading>
<div class="cont" v-html="phtml">
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
              categoryname:"生日权益"
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
   .birthdaybox img{width:100%;margin-bottom:.3125rem;}
   .birthdaybox p{font-size:@ttsize2;margin-bottom:.3125rem;line-height:150%;color:#555555;}
  .birthdaybox .cont{color:#555555;font-size:@ttsize2;}
  .birthdaybox .vue-loading{padding-top:40%;}
</style>