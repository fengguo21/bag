<template>
<div class="eventnewbox">
<vueLoading v-show="vueload"></vueLoading>
<magazin :eventdata="eventdata"></magazin>
</div>
</template>
<style>
.eventnewbox .vue-loading{position:fixed;left:50%;margin-left:-25px;top:40%;z-index:2;}
</style>
<script>
import vueLoading from '../components/vueload'
import magazin from '../components/public/magazin'
  export default {
    data(){
      return {
        eventdata:[],
        vueload:true
      }
    },
    components: {
        magazin,
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
              repCode:'REP_001550',   
              wechator_id:this.$store.state.id, 
              mall:1
            }
          })
        .then(res => {
          this.vueload=false
           this.eventdata=res.data.data;
        }).catch(function (res) {
          console.log(res);
        }); 
   }
  }
</script>