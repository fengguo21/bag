<template>
  <div>
    <div class="ttbox">
      <el-row>
        <el-col :span="12" class="active">验证手机
          <span>1</span>
        </el-col>
        <el-col :span="12">成为会员
          <span>2</span>
        </el-col>
      </el-row>
    </div>
    <div class="loginbox regbox">
      <h3>注册需要验证您的手机号码</h3>
      <div class="inputbox inputbox1">
        <input type="text" value="" placeholder="手机号" v-model="txtphone" @input="chkstep1">
      </div>
      <div class="inputbox inputbox2">
        <input type="text" value="" placeholder="手机验证码" v-model="txtcode" @input="chkstep1">
        <input type="button" value="" class="btn_code" :disabled="codedisabled" v-model="btnContent" @click="sendSmsCode">
      </div>
      <div class="chk_list">
        <label for="chk_xy">
          <input type="checkbox" value="1" name="chk_xy" id="chk_xy" v-model="txtxy">
          <span>同意
            <a class="a_agree" href="javascript:void(0)" @click="go_rule">用户注册协议</a>
          </span>
        </label>
      </div>
      <div class="btbnbox" v-if="login">
        <input type="button" value="" class="btn_login" :disabled="logindisable" @click.stop="handle_login()" v-model="loginstatus">
        <!-- <input type="button" value="立即注册" class="btn_reg" @click="goreg()">-->
      </div>

      <el-dialog title="" :visible.sync="dialogVisible_reg" width="90%" center>
        <center>
          <p class="mrgbt10">此手机号尚未注册！</p>
          <p class="mrgbt10">
            <input type="button" class="btn_middle" value="马上去注册" @click="goreg()">
          </p>
        </center>
        <p class="mrgbt10 small">友情提示：原商场线下会员，首次线上登录仍需重新注册哦</p>
      </el-dialog>
    </div>
    <input type="button" value="下一步" class="btn_step" :disabled="logindisable" @click="handle_login()" v-if="!login"></input>
  </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  @import '../../static/css/login.less';
  @btnheight: 1.171875rem;
  .btbnbox {
    padding-top: 1rem;
    input[type="button"] {
      width: 100%;
      height: @btnheight;
      line-height: @btnheight;
      font-size: @btnbigsize;
      text-align: center;
      border: none;
      border-radius: .078125rem;
    }
    .btn_login {
      background: @iconcolor;
      color: #fff;
    }
    input[type="button"].btn_reg {
      background: #fff;
      color: @yellow;
      border: .015625rem solid @iconcolor;
      margin-top: .28125rem;
    }
    input[type="button"]:disabled {
      background: #ccc;
    }
  }

  .regbox {
    padding: 0 .3125rem;
  }

  .loginbox {
    /*  padding: 0 .3125rem;*/
    h3 {
      text-align: center;
      font-size: @ttsize;
      font-weight: normal;
      padding: .625rem 0 .390625rem 0;
    }
    input[type="checkbox"] {
      margin-right: .078125rem;
    }
    .a_agree {
      color: #ffa13a;
      text-decoration: underline;
      font-weight: bold;
    }
    .chk_list {
      margin-top: .15625rem;
      clear: both;
    }
  }

  .ttbox {
    background: #f4f4f4;
    padding: .3125rem 0 .625rem 0;
    font-size: @ttsize;
    .el-col {
      text-align: center;
      border-bottom: .046875rem solid #ccc;
      padding-bottom: .546875rem;
      position: relative;
    }
    .el-col span {
      position: absolute;
      left: 50%;
      margin-left: -.3125rem;
      bottom: -.3125rem;
      border-radius: 50%;
      width: .625rem;
      height: .625rem;
      line-height: .625rem;
      background: #ccc;
      color: #fff;
    }
    .el-col.active span {
      background: @iconcolor;
    }
    .el-col.active {
      border-color: @iconcolor;
    }
  }

  .btn_step {
    background: @iconcolor;
    color: #fff;
    width: 100%;
    position: fixed;
    left: 0rem;
    bottom: 0rem;
    text-align: center;
    font-size: @btnbigsize;
    height: 1.21875rem;
    line-height: 1.21875rem;
    border: none;
    border-radius: 0rem;
  }

  input:disabled {
    background: #ccc;
  }

  .chk_list {
    span {
      display: block;
      float: left;
    }
    input[type="checkbox"] {
      -webkit-appearance: none;
      /*去除input默认样式*/
      float: left;
      background: url(~assets/images/mc/icon-chk.png) center center no-repeat;
      width: .46875rem;
      height: .5rem;
      background-size: .46875rem auto;
      border: none;
      display: inline-block;
    }
    input[type="checkbox"]:checked {
      background: url(~assets/images/mc/icon-chk-on.png) center center no-repeat;
      background-size: .46875rem auto;
    }
  }

</style>
<script>
  export default {
    data() {
      return {
        txtphone: '',
        txtcode: '',
        logindisable: true,
        codedisabled: false,
        dialogVisible_reg: false,
        btnContent: "获取验证码",
        loginstatus: "注册/绑定",
        loginsuc: false,
        txtxy: '',
        action: "",
        login: true,
        member_id: "",
        gologin: false
      }
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    activated: function () {
      var chk_xy = sessionStorage.getItem("register_xy")
      if (chk_xy) {
        this.txtxy = chk_xy
      }
    },
    mounted() {
      /*   window.addEventListener('popstate', function (e) {
          window.WeixinJSBridge.call('closeWindow')
        }, false) */
      /*==退出重新进入 60s以内倒计时===*/
      var local_time
      if (localStorage.getItem("time1")) {
        local_time = localStorage.getItem("time1")
        var sep_time = (Date.parse(new Date()) - Date.parse(local_time)) / 1000
        if (sep_time <= 60) {
          this.time = sep_time
          this.timer()
        }
      }
      /*==退出重新进入 60s以内倒计时===*/
    },
    methods: {
      go_rule() {
        this.$router.push({
          name: 'article-rule'
        })
      },
      popwarn(message, title) {
        this.$alert(message, title, {
          confirmButtonText: '确定',
          type: 'warning',
          confirmButtonClass: "confirmbtn_1",
          center: true,
          callback: action => {
            if (this.gologin) {
              this.login = true
            }
          }
        });
      },
      goreg() {
        this.login = false
        this.dialogVisible_reg = false
        this.action = 1
        this.logindisable = false
      },
      /*  chkphone() {
         if (this.txtphone.length > 0) {
           this.regphone = true
         } else {
           this.regphone = false
         }
       }, */
      chkstep1() {
        if (this.txtcode.length > 0 && this.txtphone > 0) {
          this.logindisable = false
        } else {
          this.logindisable = true
        }
      },
      handle_login() {
        if (!this.verticphone(this.txtphone)) {
          return
        }
        if (this.txtxy != 1) {
          this.popwarn("请同意用户注册协议", "提示")
          return
        }
        /* this.logindisable = true
          if (this.login) {
           this.loginstatus = "登陆中"
         } */
        this.verificationCode()
      },
      // 验证手机号码
      verticphone() {
        let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/; //手机号正则验证
        let phoneNum = this.txtphone
        if (!phoneNum) { //未输入手机号
          this.popwarn("请输入正确的手机号", "提示")
          return false
        }
        if (!reg.test(phoneNum)) { //手机号不合法
          this.popwarn("您输入的手机号码不合法", "提示")
          return false
        }
        return true
      },
      // 获取验证码
      sendSmsCode() {
        var that = this
        /*  if (that.txtxy != 1) {
           that.popwarn("请同意用户注册协议", "提示")
           return
         } */

        if (!that.verticphone(that.txtphone)) {
          return
        }
        that.time = 60
        // 发送短信 start
        this.codedisabled = true;
        let url = that.global_config.datapost.codeurl + '/wechat/ifs/wechator/' + that.$store.state.id + '/smsend'
        let phoneNum = that.txtphone
        that.$http.get(url, {
          params: {
            phone: phoneNum
          }
        }).then(res => {
          let resmsg = res.data.msg
          let memberdata= res.data.data[0]           
          if (res.data.code != 0) 
          { that.popwarn(resmsg, "提示")}
          else
          {
             that.timer()
          }
         if (res.data.code == 9901 || res.data.code == 9902) {//已经是会员
              that.$store.state.islogin = true
              that.$store.state.member.memberid = memberdata.id
              that.$store.state.member.cardnum = memberdata.card_num
              that.$store.state.member.pastpoint = memberdata.member_past_point
              that.$store.state.member.memberpoint = memberdata.member_point
              that.$store.state.member.gradenme = memberdata.grade_name
              that.$store.state.member.gradecode = memberdata.grade_code
              that.member_id = memberdata.id
              //跳转到相应页面
              that.$alert(resmsg, '提示', {
                confirmButtonText: '确定',
                center: true,
                callback: action => {
                  that.gonext()
                }
              });
              return false
            }   
        }).catch(function (res) {
          that.codedisabled = false;
          console.log(res)
          // that.popwarn(resmsg, "提示")
        });
      },
      chkaction() {
        if (this.action == 1 && this.login == true) {
          this.dialogVisible_reg = true
          return false
        }
        return true
      },
      timer() {
        if (this.time > 0) {
          this.time--;
          this.btnContent = this.time + "s后重新获取";
          this.codedisabled = true;
          var timer = setTimeout(this.timer, 1000);
        } else if (this.time == 0) {
          this.btnContent = "获取验证码";
          clearTimeout(timer);
          this.codedisabled = false;
        }
        localStorage.setItem("time1", new Date())
      },
      // 验证验证码
      verificationCode() {
        var that = this
        let phoneNum = this.txtphone //手机号       
        //登陆接口
        let url = that.global_config.datapost.codeurl + '/wechat/ifs/wechator/' + that.$store.state.id + '/login'
        that.$http.get(url, {
          params: {
            phone: phoneNum,
            code: this.txtcode,
            action: this.action
          }
        }).then(res => {
          var rescode = res.data.code
          var data
          let resmsg = res.data.msg
          let memberdata = res.data.data[0] 
           if (res.data.data[0]) {//保存action
            that.action = res.data.data[0].action
          }
          if (rescode == 0) { //code为0
            if (that.action == 2) {//绑定的时候获得他的action
              data = res.data.data[0]
              that.member_id = memberdata.member.id
            }
            that.gonext()
          } else {
            let resmsg = res.data.msg    
            that.logininit()            
            that.popwarn(resmsg, "提示")
          }
        }).catch(function (res) {
          let resmsg = res
          console.log(res)
          that.popwarn("请稍后再试", "提示")
          that.logininit()
        });
      }, //verificationCode end
      gonext() {
        var that = this
        var redirect = ""
        if (that.$route.query.redirect) {
          redirect = that.$route.query.redirect
        }
        if (that.$store.state.islogin) //0 登陆
        {
          if (redirect != "") {
            that.$router.replace(redirect)
          } else {
            that.$router.replace({
              name: 'mc'
            })
          }
          return false
        }
        if (that.action == 1) //1 注册
        {
          that.$router.push({
            name: 'register2',
            query: {
              phone: that.txtphone,
              redirect: redirect
            }
          });
        } else if (that.action == 2) //2为绑定
        {
          that.$router.push({
            name: 'register_bind',
            query: {
              member: that.member_id,
              redirect: redirect
            }
          });
        }
      },
      logininit() {
        this.logindisable = false
        if (this.login) {
          this.loginstatus = "注册/绑定"
        }
      }

    }
    //methods
  }

</script>
