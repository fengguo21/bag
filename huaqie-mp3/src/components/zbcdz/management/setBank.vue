<template>
	<el-form ref="setForm" :model="setForm" label-width="165px" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="银行名称">
			<el-select v-model="setForm.bank" placeholder="请选择银行">
		        <el-option :label="item.label" :value="item.label" v-for='item in options' :key='item.label'></el-option>
		      </el-select>
		</el-form-item>
		<el-form-item label="银行卡号">
			<el-input v-model="setForm.account"></el-input>
		</el-form-item>
		<el-form-item label="账户名">
			<el-input v-model="setForm.name"></el-input>
		</el-form-item>
		<el-form-item label="联系手机">
			<el-input v-model="setForm.phone"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click='saveSet'>保存</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
import { setupBank, getBank } from '@/api/api'
export default {
	data() {
		return {
			setForm: {
				account: '',
				bank: '',
				name: '',
				phone: ''
			},
			options: [
				{ label: '中国银行' },
				{ label: '工商银行' },
				{ label: '建设银行' },
				{ label: '招商银行' },
				{ label: '农业银行' },
				{ label: '其他' },
			],
		}
	},
	computed: {
		level() {
			return this.store.get('user').role.level
		}
	},
	mounted() {
		if(this.level != 1) {
			this.getBank();
		}
	},
	methods: {
		getBank() {
			getBank({}).then(res => {
				if(res.code > 0) {
					this.$message.error({
						message: res.message
					})
				}
				if(res.data) {
					this.setForm = {
						account: res.data.basic.account,
						bank: res.data.basic.bank,
						name: res.data.basic.name,
						phone: res.data.basic.phone
					}
				}
				// console.log(res.data);
			})
		},
		// 保存当前设置
		saveSet() {
			// 数据返回值保持深复制
			// console.log('save ok!');
			setupBank(this.setForm).then(res => {
				if(res.code > 0) {
					this.$message.error({
						message: res.message
					})
				}
				this.$message.success({
					message: '设置成功'
				})
				this.getBank();
			})
		},
	}
}
</script>
<style scoped></style>
