<template>
	<el-row>
	 <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="公众号设置" name="first">
    			<el-form ref="form" :model="form" label-width="150px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="商城名称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="公司名称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="微信服务号AppID">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="微信服务号AppSecret">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="微信商户ID">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="微信支付密钥">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="微信支付证书certFile">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="微信支付证书keyFile">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="微信支付证书pfxFile">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary">保存</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
	</el-form>
    </el-tab-pane>
    <el-tab-pane label="公司信息设置" name="second">
    	<el-form ref="form" :model="form2" label-width="150px" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="商城名称">
			<el-input v-model="form2.name"></el-input>
		</el-form-item>
		<el-form-item label="公司名称">
			<el-input v-model="form2.company"></el-input>
		</el-form-item>
		
		<el-form-item label="联系电话">
			<el-input v-model="form2.phone"></el-input>
		</el-form-item>
		<el-form-item label="地址">
			<el-input v-model="form2.address"></el-input>
		</el-form-item>
		<el-form-item label="简介">
			<el-input type="textarea" v-model="form2.text"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button @click.native="onSubmit2" type="primary">保存</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
	</el-form>
    </el-tab-pane>
  </el-tabs>
	</el-row>
</template>

<script>
import { setupAbout } from '../../api/api';
	export default {
		data() {
			return {
				activeName: 'first',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				form2: {
					name: '',
					company: '',
					phone: '',
					address: '',
					text: ''
				}
			}
		},
		methods: {
			handleClick() {

			},
			onSubmit() {
				console.log('submit!');
			},
			onSubmit2() {
				console.log('submit...', this.form2)
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							setupAbout(this.form2).then((res) => {
								
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								//this.$refs['form'].resetFields();
								this.editFormVisible = false;
								
							});
						});
			}
		}
	}

</script>