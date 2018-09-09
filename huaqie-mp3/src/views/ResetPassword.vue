<template>
<div class="full-screen">
 <c-waves>
      <div slot="center">
      <img class="logo" src="../assets/logo@2x.png" />
        <div style="font-size: 46px;">花茄管理系统</div>
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">重置密码</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-button style="" type="text" @click.native.prevent="sendCode">获取验证码</el-button>
    <el-form-item prop="code">
      <el-input type="text" v-model="ruleForm2.code" auto-complete="off" placeholder="验证码"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="新密码"></el-input>
    </el-form-item>
    <!--
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">确认重置</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      <el-button style="margin-top:20px;" type="text" @click.native.prevent="handleLogin">登录</el-button>
    </el-form-item>
  </el-form>
      </div>
    </c-waves>
    </div>
</template>

<script>
  import { getSessionId, requestResetPassword, getMasterApp, sendCode } from '../api/api';
  import CWaves from '../components/CWaves.vue'
  import session from 'store'
  import md5 from 'md5'
  //import NProgress from 'nprogress'
  export default {
    name:'ad',
     components: {
      CWaves
    },
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          code: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
    	sendCode() {
        	if(!this.ruleForm2.account){
        		this.$message.warning({
        			message: '请输入账号'
        		})
        		return
        	}

          sendCode({
            phone: this.ruleForm2.account
          }).then(res => {
            if(res.code){
              this.$message.error({
                message: res.message
              })
              return
            }
            this.$message.success({
              message: '验证码已发送，请注意查收'
            })
          })
          
      },
      handleLogin() {
        this.$router.push({path: '/login'})
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();



            var loginParams = { phone: this.ruleForm2.account, code: this.ruleForm2.code, password: this.ruleForm2.checkPass };
            requestResetPassword(loginParams).then(ret => {
              this.logining = false;
              if(ret.code){
                this.$message.error({
                  message: ret.message
                })
                return
              }
                this.$router.push({path: '/login'})
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted() {
      getSessionId({}).then( data => {
              if(data.code == 0)
                session.set('sessionId', data.data)
              // console.log(data)
            })
            
    }
  }

</script>

<style lang="scss" scoped>
.logo{
  height: 77px;
  margin: 10px 0;
}
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 40px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }


   .full-screen {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .grid-content {
    border-radius: 4px;
    text-align: center;
    height: 36px;
    line-height: 36px;
  }
  .el-menu--horizontal .el-menu-item {
    float: right !important;
  }
  .el-menu{
    padding-right: 60px;
  }
</style>