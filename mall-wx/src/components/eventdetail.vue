<template>
  <div class="eventdetail_box">
    <div class="eventdetail mainbox" v-if="detail.description">
      <div class="cont" v-html="decodeURI(detail.description)">
      </div>
    </div>
    <input type="button" class="btn_bm" :value="bm_text" @click="checkin" :disabled='disabled' v-if="detail.subscribe_needed==1">

  </div>
</template>


<script>
 /*  import {
    getDatas
  } from '@/api/api' */
  export default {
    data() {
      return {
        detail: [],
        eventtt: '',
        dialogVisible1: false,
        camp_id: "",
        bm_text: "立即报名",
        disabled: false,
        member_only: ""
      }
    },
    created() {
      var that = this
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    methods: {
      checkin() {
        if (this.member_only == 1) {//会员
          if (this.$store.state.islogin) {
            this.$router.push({
              name: 'eventbm',
              query: {
                camp_id: this.camp_id
              }
            })
          } else {
            this.chklogin(this.$route.path)
          }
        } else {//非会员
          this.$router.push({
            name: 'eventbm',
            query: {
              camp_id: this.camp_id
            }
          })
        }

      },
      ismember() { //判断是否是会员活动
        var that = this
        that.camp_id = that.$route.params.id; //获取活动信息
        that.$http.get(
            this.global_config.datapost.data_url + '/saas-api/api/portal/custom', {
              params: {
                dataSourceCode: this.global_config.datapost.dataSourceCode,
                repCode: 'REP_001780',
                campaign_id: that.camp_id
              }
            })
          .then(res => {
            that.member_only = res.data.data[0].member_only
          }).catch(function (res) {
            console.log(res);
          });
      }
    },
    mounted() {
      var that = this
      that.ismember()
      that.camp_id = that.$route.params.id; //获取活动信息
      this.$http.get(
          this.global_config.datapost.data_url + '/saas-api/api/portal/custom', {
            params: {
              dataSourceCode: this.global_config.datapost.dataSourceCode,
              repCode: 'REP_001526',
              id: that.camp_id,
              wechat_id: this.$store.state.id
            }
          })
        .then(res => {
          this.detail = res.data.data[0]
          document.title = "成都IFS" + res.data.data[0].camp_name
          var msg = res.data.data[0].msg
          sessionStorage.setItem("audit_type", res.data.data[0].audit_type)
          if (msg) {
            this.disabled = true
          }
        }).catch(function (res) {
          console.log(res);
        });
      var type = this.$route.query.type
      if (type == "2") {
        this.disabled = true
        this.bm_text = '报名已过期'
      }
    },


  }

</script>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less';
  .eventdetail_box {
    .eventdetail img {
      max-width: 100%;
      margin-bottom: .3125rem;
    }
    .eventdetail .cont {
      padding: 0.3125rem;
    }
    .eventdetail .cont p{

    }
    .eventdetail .cont li {
      list-style: disc;
      margin-left: 20px;
      margin-bottom: 0.3125rem;
    }
    .eventdetail p {
      margin-bottom: 0.3125rem;
      line-height: 150%;
      color: #555555;
    }
    .eventdetail h1 {
      color: #000;
      font-weight: bold;
      font-size: @ttsize2;
      margin-bottom: .3125rem;
      text-align: center;
    }
    .btn_bm {
      position: fixed;
      left: 0px;
      bottom: 0px;
      .btn_bigyellow(@width: 100%, @mrglf: 0, @mrgbt: 0)
    }

  }

</style>
