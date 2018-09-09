<template>
  <div class="eventnewbox">
    <vueLoading v-show="vueload"></vueLoading>
    <eventlist :eventdata="eventdata" :eventtypye="2"></eventlist>
  </div>
</template>
<script>
  import vueLoading from '../components/vueload'
  import eventlist from '../components/public/eventlist'
/*   import {
    getDatas
  } from '@/api/api' */
   var api = require('@/api/api')
  var getDatas=api.getDatas
  export default {
    data() {
      return {
        eventdata: [],
        vueload: true
      }
    },
    created() {

      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    components: {
      eventlist,
      vueLoading
    },
    methods: {
      getHisEvent() {
        this.vueload = true
        console.log('ex')
        let params = {
          repCode: 'REP_001525',
          wechat_id: this.$store.state.id,
          mall_id: 1
        }
        getDatas(params).then((res) => {
          this.vueload = false
          console.log(res)
          this.vueload = false
          this.eventdata = res.data
        }).catch(function (res) {
          console.log(res);
        });
      }
    },
    mounted() {
      this.getHisEvent()
    }
  }

</script>
