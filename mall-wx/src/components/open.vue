<template>
  <div class="openbox">
    <center>
      <p style="margin-bottom:20px">您的微信二维码</p>
      <div id="qrcode" ref="qrcode"></div>
    </center>
  </div>
</template>
<script>
  import QRCode from 'qrcodejs2' //生成二维码
  //import $ from 'jquery'
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
    mounted() {
      this.qrcode() //生成二维码
    },
    methods: {
      qrcode() { //生成二维码
        let qrcode = new QRCode('qrcode', {
          width: 180,
          height: 180,
          text: this.$store.state.openid
        })
        console.log(qrcode)
      },
    },
    components: {
     // VueQr,
      //VueQArt
    },
  }

</script>
<style>
  .openbox {
    font-size: 14px;
    padding-top: 20%;
  }

  .open_code img {
    width: 65%;
  }

</style>
