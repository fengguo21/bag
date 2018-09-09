<template>
<section>
 <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="Basic" name="pane1">
    <el-form ref="form" :model="form" label-width="150px" style="margin:20px;width:60%;min-width:600px;">
    <el-form-item label="Mall ID">
			{{app.appId}}
		</el-form-item>
		
		<el-form-item label="Freight">
			<el-input v-model="freight"></el-input>
		</el-form-item>
		<!--
		<el-form-item label="公司名称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		-->
		<el-form-item>
			<el-button type="primary" @click="onFreightSubmit">Save</el-button>
			<el-button @click.native.prevent>Cancel</el-button>
		</el-form-item>

	</el-form>
	</el-tab-pane>
	<el-tab-pane label="Bank Settings" name="pane2">
    <el-form ref="form" :model="form" label-width="150px" style="margin:20px;width:60%;min-width:600px;">
    
		<el-form-item label="Bank Name">
			<el-input v-model="form.bank"></el-input>
		</el-form-item>
		<el-form-item label="Bank Address">
			<el-input v-model="form.address"></el-input>
		</el-form-item>
		<el-form-item label="Payee Account">
			<el-input v-model="form.account"></el-input>
		</el-form-item>
		<el-form-item label="Payee Name">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		
		<el-form-item>
			<el-button type="primary" @click="onSubmit">Save</el-button>
			<el-button @click.native.prevent>Cannel</el-button>
		</el-form-item>
	</el-form>
	</el-tab-pane>
	

	</el-form></el-tab-pane>
  </el-tabs>
	
	</section>
</template>

<script>
import session from 'store'
import { editApp } from '../../api/api';

	export default {
		data() {
			return {
				content: '',
				activeName: 'pane1',
				freight: 0,
				form: {
					name: '',
					bank: '',
					address: '',
					account: ''
				}
			}
		},
		computed: {
			app() {
				return session.get('app')
			}
		},
		methods: {
			onFreightSubmit() {
				editApp({
					title: session.get('app').basic.title,
					clientAppId: session.get('app').appId,
					freight: this.freight
				}).then(res => {
					console.log(res)
					if(!res.code){
						session.set('app', res.data)
						this.$message.success('Save success')
					}
				})
			},
			onSubmit() {
				editApp({
					title: session.get('app').basic.title,
					clientAppId: session.get('app').appId,
					bank: this.form
				}).then(res => {
					console.log(res)
					if(!res.code)
						session.set('app', res.data)
				})
			},
			handleClick() {


			},
			updateData(val) {
				console.log(val)
				this.content = val
			}
		},
		mounted() {
			Object.assign(this.form, session.get('app').extra.bank)
			this.freight = session.get('app').extra.freight
		}
	}

</script>