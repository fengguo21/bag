<template>
<div style='overflow: hidden'>
	<div>
		<div class="clear"></div>
		<div style="border:1px solid #2C2C2C; margin:10px 0;">
			<div class="textCenter">
				<img src="../assets/images/aoj1405941100.jpg" alt="" title="" border="0">
			</div>
		</div>
		<div class="clear"></div>
		<tab-card title='Đăng ký tài khoản'></tab-card>
	</div>

	<div id="type" style=" background:#F6F6F6;">

		<div id="right_type" style='float: none; margin: 0 auto; overflow:hidden'>
			<div class="form-wrap" style='margin-top: 40px;'>
			  <el-form :model="signUpForm" :rules="rules" ref="signUpForm" label-width="100px">
			    <el-form-item prop="name">
			      <div style='text-align: left'>Tên người dùng</div>
			      <el-input v-model="signUpForm.name" placeholder='Vui lòng nhập tên người dùng'></el-input>
			    </el-form-item>
			    <el-form-item prop="password">
			      <div style='text-align: left'>Mật khẩu</div>
			      <el-input type='password' v-model="signUpForm.password" placeholder='Xin nhập mật khẩu'></el-input>
			    </el-form-item>
			    <el-form-item prop="repassword">
			      <div style='text-align: left'>Xác nhận mật khẩu</div>
			      <el-input type='password' v-model="signUpForm.repassword" placeholder='Vui lòng nhập lại mật khẩu'></el-input>
			    </el-form-item>
			    <el-form-item prop="email">
			      <div style='text-align: left'>E-mail</div>
			      <el-input v-model="signUpForm.email" placeholder='Vui lòng nhập địa chỉ email'></el-input>
			    </el-form-item>
			    <el-form-item prop='phone'>
			      <div style='text-align: left'>Số điện thoại di động</div>
			      <el-input v-model="signUpForm.phone" placeholder='Vui lòng nhập số điện thoại di động'></el-input>
			    </el-form-item>
			    <el-form-item prop='address'>
			      <div style='text-align: left'>Địa chỉ</div>
			      <el-input v-model="signUpForm.address" placeholder='Xin vui lòng nhập địa chỉ'></el-input>
			    </el-form-item>
			   <!--  <el-form-item label="联系电话" prop='tel'>
			      <el-input v-model="signUpForm.tel" placeholder='请输入联系电话'></el-input>
			    </el-form-item> -->
			    <el-form-item>
			      <el-button type="primary" @click="onSubmit">Đăng ký</el-button>
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
import leftListItem from './shared/leftListItem'
import { signUp, getSessionId } from '@/api/api'
import store from 'store'
export default {
	name: 'signUp',
	components: {
		tabCard,
		leftListItem
	},
	data() {
		// 自定义的确认密码验证
		var validateRePass = (rule, value, callback) => {
			if (value !== this.signUpForm.password) {
			  callback(new Error('hai lần nhập mật khẩu khác nhau!'));
			} else {
			  callback();
			}
		};
	    return {	 
	      signUpForm: {
	        name: '',
	        password: '',
	        repassword: '',
	        email: '',
	        address: '',
	        // tel: '',
	        phone: '',
	      },
	      rules: {
	        name: [
	          { required: true, message: ' xin mời nhập tên người dùng', tigger: 'blur' }
	        ],
	        password: [
	          { required: true, message: ' xin mời nhập mật khẩu', tigger: 'blur' }
	        ],
	        repassword: [
	          { required: true, message: ' xin mời nhập mật khẩu', tigger: 'blur' },
			  { validator: validateRePass, trigger: 'blur' }
	        ],
	        email: [
	          { required: true, message: 'xin mời nhập địa chỉ email', tigger: 'blur' },
	        ],
	        phone: [
	          { required: true, message: ' xin mời nhập số điện thoại', tigger: 'blur' },
	        ],
	      }
	    }
	},
	
	

	methods: {
		onSubmit() {
		  this.$refs.signUpForm.validate((valid) => {
		    if (valid) {
		    	if(!store.get('sessionId')) {
		            getSessionId({}).then(res => {
		              // console.log(res);
		              if(res.code === 0) {
		                store.set('sessionId', res.data);
		                this.signUp();
		              } else {
		                this.$message.error({
		                  message: res.message
		                })
		              }
		            })
		        } else {
		            this.signUp();
		        }
		      // console.log(this.signUpForm);
		    } else {
		      this.$message.error({
		        message: 'Điền thông tin sai.'
		      })
		      return false;
		    }
		  });
		},
		signUp() {
	    	signUp({
	    		email: this.signUpForm.email,
				password: this.signUpForm.password,
				name: this.signUpForm.name,
				phone: this.signUpForm.phone,
				address: this.signUpForm.address,
				// tel: this.signUpForm.tel,
	    	}).then(res => {
	    		if(res.code === 0) {
	    			// console.log(res);
	    			this.$message.success({
	    				message: 'Đăng ký thành công.'
	    			})
	    			this.$router.push('/signIn');
	    		} else {
	    			this.$message.error({
	    				message: res.message
	    			})
	    		}
	    	})
		},
		onReset() {
		  this.$refs.signUpForm.resetFields();
		}
	}
};
</script>

<style type="text/css" scoped>
.checkCode {
	width: 100px; 
	height: 100%; 
	background: #eee; 
	position:absolute; 
	top: 0; 
	right: 0; 
	border-radius: 4px; 
	border: 1px solid #bfcbd9; 
	box-sizing: border-box;
}	
</style>
