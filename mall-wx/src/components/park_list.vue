<template>
  <div class="park_list">
    <div class="nodata" style="margin-top:50%">
      <img src="~assets/images/mc/icon-index5.png">
      <br>敬请期待</div>
  </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  .park_list .tab {
    width: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    background: #fff;
    display: flex;
    align-items: center;
    height: 1.25rem;
    font-size: @ttsize2;
    z-index: 10;
    border-bottom: .3125rem solid #eceff5;
  }

  .shopbox {
    background: #eceff5;
  }

  .park_list .tab li {
    flex: 1;
    text-align: center;
    line-height: 1.25rem;
    background: url('~assets/images/icon-line.jpg') right center no-repeat;
    background-size: 1px .375rem;
  }

  .park_list .tab li:last-child {
    background: none;
  }

  .park_list .cont {
    padding-top: 1.7rem;
  }

  .park_list .tab a {

    color: #000;
    text-decoration: none;
    display: inline-block;
  }

  .park_list .tab a.router-link-active {
    border-bottom: 1px solid @yellow;
    color: @yellow;
  }

  .park_list .mainbox {
    padding-top: 0.2rem;
  }

</style>
<script>
  export default {
    data() {
      return {

      }
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {

    }
  }

</script>
