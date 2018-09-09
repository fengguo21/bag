<template>
  <div class="openbox">
    <center>
      <p>您的微信二维码</p>
      <vue-qr :text="openid" height="800" width="800" class="vueqr"></vue-qr>
     <!-- <VueQArt :config="config"></VueQArt>-->
    </center>
  </div>
</template>
<script>
 import VueQr from 'vue-qr'
 //import VueQArt from 'vue-qart'
  export default {
    data() {
      return {
        openid: this.$store.state.openid
      }
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    components: {
      VueQr,
      //VueQArt
    },
  }

</script>
<style>
  .openbox {
    font-size: 14px;
    padding-top: 20%;
  }
.open_code img{ width:65%;}
</style>
