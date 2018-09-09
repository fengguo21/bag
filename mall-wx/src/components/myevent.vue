<template>
  <div id="myevent_box">

    <transition>
      <div class="eventpnewbox">
       <div class="eventpanel" v-if="this.num==0">
          <myevent1 ></myevent1>
        </div>
        <div class="eventpanel" v-if="this.num==1">
          <myevent2></myevent2>
        </div>   
         <div class="eventpanel" v-if="this.num==2">
          <myevent3></myevent3>
        </div>    
      </div>
    </transition> 
   <div class="fixedtop">
    <myuser></myuser>
     <div class="tab" >
       <a v-for="(item,index) in tabs" :class="{active:index == num}" @click="tab(index)">
        <span>{{item}}</span>
      </a>
      <div class="clear"></div>
    </div>
    </div>
 
  </div>
</template>
<script>
  import myuser from '../components/public/myuser'
  import myevent1 from '../components/myevent1'
  import myevent2 from '../components/myevent2'
  import myevent3 from '../components/myevent3'
  export default {
    name: 'event',
    data() {
      return {
        num:0,
        tabs: ["已报名", "已确认", "已过期"]
      }
    },
    methods: {
      //切换选项卡
      tab(index) {
        this.num = index    
        this.eventnum=index 
        this.$router.replace({query:{ listnum:index}})        
      }
    },
    created() {
       if(document.getElementById('appLoading'))       {document.body.removeChild(document.getElementById('appLoading'))}
    },
    mounted: function () {
      
      if(this.$router.history.current.query.listnum) 
      {let listnum = this.$router.history.current.query.listnum
      this.num=listnum}
      console.log("userid"+this.$store.state.userid)
    },
    components: {
      myuser,
      myevent1,
      myevent2,
      myevent3
    },
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less'; 
  @import '../../static/css/event.less'; 
  #myevent_box{background:none;}
 .eventpnewbox{background:none;width:100%;padding-top:4rem;}

.el-dialog__body .vueqr img{width:150px;height:150px;}

</style>
