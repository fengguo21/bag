<template>
<div style='overflow: hidden'>
  <div><div class="clear"></div>
  <div style="border:1px solid #2C2C2C; margin:10px 0;">
    <div class="textCenter">
      <img src="../assets/images/aoj1405941100.jpg" border="0">
    </div>
  </div>
  <div class="clear"></div>
    <tab-card title='Đăng nhập'></tab-card>
  </div>

  <div id="type" style=" background:#F6F6F6;">

    <div id="right_type" style='float: none; margin: 0 auto; overflow:hidden;'>
      <div class="form-wrap" style='margin-top: 40px;'>
        <el-form :model="signInForm" :rules="rules" ref="signInForm" label-width="100px" >
          <el-form-item label="E-mail" prop="email">
            <el-input v-model="signInForm.email" placeholder='Vui lòng nhập địa chỉ email'></el-input>
          </el-form-item>
          <el-form-item label="Mật khẩu" prop="password">
            <el-input type='password' v-model="signInForm.password" placeholder='Xin nhập mật khẩu'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Đăng nhập</el-button>
            <el-button @click="onReset">Đặt lại</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import tabCard from './shared/tabCard'
import { signIn, getSessionId ,getApp} from '@/api/api'
import store from 'store'
export default {
  name: 'signIn',
  components: {
    tabCard,
  },
  data() {
    return {
      signInForm: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: 'Vui lòng nhập hộp thư', tigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Vui lòng nhập mật khẩu của bạn', tigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    sigIn() {
      signIn(this.signInForm).then(res => {
        if(res.code === 0) {
          this.$message.success({
            message: 'Đăng nhập thành công'
          })
          getApp({}).then(res=>{
          	store.set('app', res.data);
          })
          store.set('user', res.data.people);
          this.$router.push('/')
        } else {
          this.$message.error({
            message: res.message
          })
        }
      })
    },
    onSubmit() {
      this.$refs.signInForm.validate((valid) => {
        if (valid) {
          if(!store.get('sessionId')) {
            getSessionId({}).then(res => {
              // console.log(res);
              if(res.code === 0) {
                store.set('sessionId', res.data);
                this.sigIn();
              } else {
                this.$message.error({
                  message: res.message
                })
              }
            })
          } else {
            this.sigIn();
          }
          
          // console.log(this.signInForm);
        } else {
          this.$message.error({
            message: 'Điền vào tin nhắn'
          })
          return false;
        }
      });
    },
    onReset() {
      this.$refs.signInForm.resetFields();
    }
  }
};
</script>

<style type="text/css" scoped>
.form-wrap {

}
</style>
