<template>
  <div class="regbox">
    <div class="ttbox">
      <el-row>
        <el-col :span="12">验证手机
          <span>1</span>
        </el-col>
        <el-col :span="12" class="active">成为会员
          <span>2</span>
        </el-col>
      </el-row>
    </div>
    <div class="loginbox">
      <h3>请填写以下信息，完成开卡</h3>
      <div class="inputbox inputbox3">
        <input type="text" value="" placeholder="请输入身份证后四位(必填)" v-model="txtCard">
      </div>
      <input type="button" value="确定" class="btn_step" @click="validatereg" :disabled="disabled"></input>
    </div>
  </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  @import '../../static/css/register.less';
 
</style>
<script>
  export default {
    data() {
      return {
        txtCard: "",
        member: "",
        disabled:false
      }
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    methods: {
      popwarn(message, title) {
        this.$alert(message, title, {
          confirmButtonText: '确定',
          type: 'warning',
          confirmButtonClass: "confirmbtn_1",
          center: true,
          callback: action => {}
        });
      },
      validatereg() {
        var that = this
        if (that.txtCard == "") {
          that.popwarn("请输入身份证号", "提示")
          return
        }
        that.member = that.$route.query.member
        that.disabled=true
        //注册 start
        that.$http.get(
            that.global_config.datapost.codeurl + '/wechat/ifs/wechator/' + that.$store.state.id + "/bind", {
              params: {
                tail: that.txtCard,
                member: that.member
              }
            })
          .then(res => {
            let rescode = res.data.code
            let resmsg = res.data.msg
            if (rescode == 0) {
              let data = res.data.data[0]
              that.$store.state.member.memberid = data.member_id
              that.$store.state.member.cardnum = data.card_num
              that.$store.state.member.pastpoint = data.member_past_point
              that.$store.state.member.memberpoint = data.member_point
              that.$store.state.member.gradenme = data.grade_code
              var redirect=""
              if (that.$route.query.redirect) {
                redirect = that.$route.query.redirect
              }
              if (redirect != "") {
                that.$router.replace(redirect)
              } else {
                that.$router.replace({
                  name: 'mc'
                })
              }
            } else {
              that.popwarn(resmsg, "提示")
            }
          }).catch(function (res) {
          //  console.log(that.global_config.datapost.codeurl + '/wechat/ifs/wechator/' + that.$store.state.id + "/bind")
          //  console.log("params-tail"+that.txtCard)
             console.log("params-member"+that.member)
             console.log("redirect"+that.member)
            that.popwarn("接口调用失败", "提示")
          });
          that.disabled=false
        //注册 end
      }

    }
  }

</script>
