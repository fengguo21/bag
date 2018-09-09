<template>
  <div id="myevent_box" ref="event">
    <div class="fixedtop">
      <myuser v-show="this.scroll<=100"></myuser>
      <!--活动列表
    <div class="tab">
      <router-link to="/eventNew">最新活动</router-link>
      <router-link to="/eventHis">往期回顾</router-link>
      <router-link to="/myevent">我的活动</router-link>
      <div class="clear"></div>
    </div>
    <transition>
    <div class="box">
      <router-view></router-view>
    </div>
    </transition>-->
      <div class="tab">
        <a v-for="(item,index) in tabs" :class="{active:index == num}" @click="tab(index)">
          <span>{{item}}</span>
        </a>
        <div class="clear"></div>
      </div>
    </div>
    <transition>
      <div class="eventpnewbox" >
        <div class="eventpanel" v-if="this.num==0">
          <eventNew></eventNew>
        </div>
        <div class="eventpanel" v-if="this.num==1">
          <eventHis></eventHis>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import myuser from '../components/public/myuser'
  import eventNew from '../components/eventNew'
  import eventHis from '../components/eventHis'
  import myevent from '../components/myevent'
  export default {
    name: 'event',
    data() {
      return {
        num: 0,
        tabs: ["最新活动", "往期回顾", "我的活动"],
        scroll: ""
      }
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    methods: {
      onscroll() {
      this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
      },
      //切换选项卡
      tab(index) {
        this.num = index
        this.eventnum = index
        if (index == 2) {
          this.$router.push({
            name: 'myevent'
          })
        } else {
          this.$router.replace({
            query: {
              listnum: index
            }
          })
        }
      },

    },
    mounted: function () {
      window.addEventListener('scroll', this.onscroll)
      if (this.$router.history.current.query.listnum) {
        let listnum = this.$router.history.current.query.listnum
        this.num = listnum
      }
    },
    components: {
      myuser,
      eventNew,
      eventHis,
      myevent
    },
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  @import '../../static/css/event.less';
  .eventpnewbox{margin:0px auto;  padding-top:4.5rem;}
</style>
