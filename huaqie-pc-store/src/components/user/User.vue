<template>
	<div class='user'>
		<div class='user-header'>Thông tin người sử dụng <i class="el-icon-edit el-icon--right" style='color:#20A0FF; cursor:pointer' @click='editUser'></i></div>
		<div class="user-item">
			<div>Tên:</div>
			<span>{{user.basic.name}}</span>
		</div>
		<div class="user-item">
			<div>Điện thoại:</div>
			<span>{{user.basic.phone}}</span>
		</div>
		<div class="user-item">
			<div>Địa chỉ:</div>
			<span>{{user.basic.address}}</span>
		</div>
		<div class="user-item">
			<div>E-mail:</div>
			<span>{{user.extra.email}}</span>
		</div>
		<div class="user-item">
			<div>Ngày đăng ký:</div>
			<span>{{user.created|filterTime}}</span>
		</div>
		<div style='margin-top: 20px;'>
			<el-button type="success" @click='$router.push("/cart")'>GIỎ HÀNG CỦA TÔI</el-button>
			<el-button type="primary" @click='$router.push("/orders")'>Đơn hàng của tôi</el-button>
		</div>
	</div>
</template>
<script>
import store from 'store'
import moment from 'moment'
export default {
	name: 'user',
	created() {
		this.user = store.get('user');
		// console.log(this.user);
	},
	filters: {
		filterTime(val) {
			return moment(val).format('YYYY-MM-DD HH:mm:ss')
		}
	},
	data() {
		return {
			user: null
		}
	},
	methods: {
		editUser() {
			this.$router.push('/editUser');
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
.user-item {
	margin-bottom: 10px;
}
.user-item > span {
	display: inline-block;
	padding-left: 35px;
}
.user-item > span:first-child {
	width: 100px;
	margin-right: 10px;
	font-size: 18px;
}
</style>