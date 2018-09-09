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
              categoryname:"租借服务"
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
  @import '../../static/css/article.less';
</style>