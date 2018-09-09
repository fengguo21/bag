<template>
	<div class='user'>
		<div style='width: 50%; margin:0 auto'>
			<div class='user-header'>Chỉnh sửa UserMssage</div>
			<el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
			  <el-form-item label="Tên：" prop="name">
			    <el-input v-model="editForm.name"></el-input>
			  </el-form-item>
			  <el-form-item label="Điện thoại：" prop="phone">
			    <el-input v-model="editForm.phone"></el-input>
			  </el-form-item>
			  <el-form-item label="Địa chỉ：" prop="address">
			    <el-input v-model="editForm.address"></el-input>
			  </el-form-item>
			</el-form>
			<div style='margin-top: 20px;'>
				<el-button type="danger" @click='$router.push("/user")'>Hủy bản sửa đổi</el-button>
				<el-button type="primary" @click='saveEdit'>TIẾT KIỆM</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { updateUser } from '@/api/api'
import store from 'store'
export default {
	name: 'editUser',
	created() {
		const user = store.get('user').basic;
		this.editForm = Object.assign({}, user)
	},
	data() {
		return {
			editForm: {
				name: '',
		        address: '',
		        phone: '',
			},
			rules: {
		        name: [
				  { required: true, message: 'Vui lòng nhập tên người dùng', tigger: 'blur' }
				],
				phone: [
				  { required: true, message: 'Vui lòng nhập số điện thoại của bạn', tigger: 'blur' },
				],
			}
		}
	},
	methods: {
		saveEdit() {
			this.$refs.editForm.validate((valid) => {
	          if (valid) {
	            this.updateUser()
	          } else {
	            this.$message.error('Không được để trống thông tin')
	            return false;
	          }
	        });
		},
		updateUser() {
			updateUser({
				peopleId: store.get('user').peopleId,
				name: this.editForm.name,
		        address: this.editForm.address,
		        phone: this.editForm.phone,
			}).then(res => {
				if(res.code) {
					this.$message.error(res.message)
					return
				}
				store.set('user', res.data);
				this.$router.push('/user')
				// console.log(res.data);
			})
		}
	}
}
</script>
<style scoped>
.user {
  overflow: hidden;
  margin-top: 20px;
  min-height: 200px;
  background: #fff;
  box-sizing: border-box;
  padding: 30px 25px;
}	
.user-item, .user-header {
	width: 80%;
	margin: 5px auto;
	box-sizing: border-box;
	text-align: left;
	font-size: 20px;
	/* padding: 0 20px; */
	/* margin: 5px 0; */
}
.user-header {
	width: auto;
	margin-bottom: 20px;
}
.user-item > span {
	display: inline-block;
}
.user-item > span:first-child {
	width: 100px;
	margin-right: 10px;
	font-size: 18px;
}
</style>