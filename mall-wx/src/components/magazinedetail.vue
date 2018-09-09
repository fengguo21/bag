<template>
    <div class="eventdetail mainbox">
     <div class="cont" v-html="phtml">

    </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        mgzname:"",
        phtml: ''
      }
    },
    created() {
       if(document.getElementById('appLoading'))       {document.body.removeChild(document.getElementById('appLoading'))}
    },
    mounted(){
      let eventid=this.$route.params.id;
       this.$http.get(
          this.global_config.datapost.data_url+'/saas-api/api/portal/custom', {
            params: {
              dataSourceCode: this.global_config.datapost.dataSourceCode,
              repCode:'REP_001227',
              mgz:eventid
            }
          })
        .then(res => {
          this.mgzname=res.data.data[0].mgz_name
          document.title = "成都IFS" + this.mgzname
          this.phtml = decodeURI(res.data.data[0].mgz_content)
        }).catch(function (res) {
          console.log(res);
        });
   },
    methods: {

    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less';
  .eventdetail img {
    max-width: 100%;
    margin-bottom: .3125rem;
  }
  .eventdetail .cont{padding:0.3125rem;}
  .eventdetail .cont li{list-style:disc; margin-left:20px; margin-bottom: 0.3125rem;}
  .eventdetail p {
    margin-bottom:0.3125rem;
    line-height: 150%;
    color: #555555;
  }

  /*.eventdetail section {
    border-top: .3125rem solid #f1f3f7;
    padding-top: .78125rem;
  }*/

  .eventdetail .bnr img {
    border-bottom: 2px solid #f3f5f9;
  }

  .eventdetail h1 {
    color: #000;
    font-weight: bold;
    font-size: @ttsize2;
    margin-bottom:.3125rem;
    text-align:center;
  }

</style>
