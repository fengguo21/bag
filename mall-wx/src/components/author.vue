<template>
</template>
<script>
  export default {
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
      if (window.location.href.indexOf('code') >= 0) { //判断有没有微信code 
        //发请求，用code换token  start
        let code = window.location.href.split("?")[1]
        var wxcode = code.substring(5, code.indexOf('&'))
        this.$http.get(
            this.global_config.datapost.codeurl + '/wechat/ifs/code', {
              params: {
                code: wxcode
              }
            })
          .then(res => {
            if (res.data.code != 0) {
              alert(res.data.msg)
              return false
            }
            let data = res.data.data[0]
            this.$store.state.headimgurl = data.wechator.headimgurl
            this.$store.state.nickname = data.wechator.nickname
            this.$store.state.id = data.wechator.id
            this.$store.state.openid = data.wechator.openid
            /*===保存授权信息 start===*/
            sessionStorage.setItem('headimgurl', this.$store.state.headimgurl)
            sessionStorage.setItem('usrid', this.$store.state.id)
            sessionStorage.setItem('openid', this.$store.state.openid)
            /*===保存授权信息 end===*/
            //登陆跳转 start
            this.gologin()
            //登陆跳转 end
            //if (document.getElementById('appLoading')) { document.body.removeChild(document.getElementById('appLoading')) }
          }).catch(function (res) {
            alert("授权失败，请退出重新进入")
          });




      } else {
        var appid = "wx0c3c6dbf68c7831b"
        window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' +
          encodeURIComponent(document.URL) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect')
        // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(document.URL) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
      }
      /*===第一次进入项目 end===*/
    },
    methods: {
      gologin() {
          var topath=sessionStorage.getItem('beforeLoginUrl')
        //登陆跳转 start
        var nextRoute = ['/mc']
        this.$http.get(
            this.global_config.datapost.codeurl + '/wechat/ifs/wechator/' + this.$store.state.id + '/membinfo', {
              params: {}
            })
          .then(res => {
            // store.state.code = res.data.code
            if (res.data.code == 0) {
              //成功获取用户信息
              let memberdata = res.data.data[0]
              this.$store.state.islogin = true
              this.$store.state.member.memberid = memberdata.member_id
              this.$store.state.member.cardnum = memberdata.card_num
              this.$store.state.member.pastpoint = memberdata.member_past_point
              this.$store.state.member.memberpoint = memberdata.member_point
              this.$store.state.member.gradenme = memberdata.grade_name
              this.$store.state.member.gradecode = memberdata.grade_code
              this.$store.state.member.phone = memberdata.phone
              this.$store.state.member.membername = memberdata.member_name
            }
            /*========判断登陆 跳转页面 start========*/
            if (topath.indexOf(nextRoute) >= 0) {
              /*====判断是否登陆 start===*/
              if (this.$store.state.islogin) {
                //  console.log(topath)
                this.$router.replace(topath)
                //    next()
              } else {
                this.$router.replace({
                  name: 'login',
                  query: {
                    "redirect": topath
                  }
                })
              }
              /*====判断是否登陆 end===*/
            } else {
              // next()
              this.$router.replace(topath)
            }
            /*========判断登陆 跳转页面 end========*/
          }).catch(function (res) {
            console.log(res);
          });
        //登陆跳转 end
      }
    }
  }
</script>
