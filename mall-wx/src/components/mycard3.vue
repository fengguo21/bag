<template>
  <div>
    <vueLoading v-show="vueload"></vueLoading>
    <cardlist :carddata="carddata" cardtype="1"></cardlist>
    <div v-if="nodata" class="nodata"><img src="~assets/images/mc/icon-index3.png">
                <br>您还没有已过期的券哦</div>
  </div>
</template>
<script>
import vueLoading from '../components/vueload'
  import cardlist from '../components/public/cardlist'
  export default {
    data() {
      return {
        carddata: [],
        vueload: true,
        nodata:false,
        itemtext:"已过期"
      }
    },
    components: {
      cardlist,
      vueLoading
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {
      
      this.$http.get(
          this.global_config.datapost.data_url+'/saas-api/api/portal/custom', {
            params: {
              dataSourceCode: this.global_config.datapost.dataSourceCode,
              repCode: 'REP_001532',
              wechator_id: this.$store.state.id,
              mall: 1,
              usestatus: 1
            }
          })
        .then(res => {
          this.vueload = false
          if (res.data.code == 0) {
            this.carddata = res.data.data
          }
           if(this.carddata.length<=0)
          {this.nodata=true}
        }).catch(function (res) {
          console.log(res);           
        });
        
    }
  }

</script>
<style scoped>
  .vue-loading {
    margin-top: 2rem;
  }

</style>
