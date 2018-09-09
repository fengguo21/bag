<template>
<div class="mybanner">
<div class="mytxbox">
  <img v-bind:src="mytx" class="imgtx">
  <div class="txinfo">我的积分： {{mypoint}}分<br><span> {{mylevel}}</span></div>
  </div>
</div>

</template>
<style lang="less" rel="stylesheet/less" scoped>
@import '../../../static/css/main.less'; 
    .mybanner{
    background:url('~assets/images/mc/event/bnr.jpg') no-repeat;background-size:100% auto;width:100%;height:2.34375rem;
  }
  .mytxbox{padding:0.5625rem 0 0 0.71875rem;}
 .imgtx{width:1.40625rem;height:1.40625rem;border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%;float:left;}
 .txinfo{margin:0.234375rem 0 0 0.46875rem;float:left;color:#fff;font-size:@ttsize;line-height:160%;}
 .txinfo span{color:#caa056;}
</style>
<script>
  export default {
    data(){
      return{
        mytx: "",
        mypoint:"",
        mylevel:""
      } 
    },
    mounted() {
     //console.log("myusr"+this.$store.state.headimgurl)
      this.mypoint=this.$store.state.member.memberpoint
      this.mylevel=this.$store.state.member.gradenme
      this.$nextTick(function () {
      this.mytx=this.$store.state.headimgurl
      })
    }
  }
</script>