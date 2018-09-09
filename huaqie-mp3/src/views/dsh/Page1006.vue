<template>
<section>
 <el-tabs v-model="activeName">
 <el-tab-pane label="基本信息" name="pane1">
    	<app-basic-set></app-basic-set>
	</el-tab-pane>
    <el-tab-pane label="微信小程序设置" name="pane2">
    	<wx-app-set></wx-app-set>
	</el-tab-pane>
	<el-tab-pane label="VIP卡设置" name="pane6">
		<el-row>
		<el-col :span="24">
	<el-form ref="form" :inline="true" :model="form" label-width="80px">
    		<div v-for="(row, index) in form.vips">
		  <el-form-item label="标题">
		    <el-input v-model="row.title"></el-input>
		  </el-form-item>
		  <el-form-item label="价格">
		    <el-input-number v-model="row.price" :min="0" :max="10000" :debounce="2000"></el-input-number>
		  </el-form-item>
		  <el-form-item label="时长">
		    <el-input-number v-model="row.period" :min="0" :max="10000" :debounce="2000"></el-input-number> 月
		  </el-form-item>
		  <el-form-item label="说明">
		    <el-input v-model="row.text"></el-input>
		  </el-form-item>
		  <el-form-item label="推荐">
		  <el-switch
			  v-model="row.recommend"
			  on-color="#13ce66"
			  off-color="#ff4949">
			</el-switch>
			</el-form-item>
		  <el-form-item label=" ">
		    <el-button type="danger" icon="minus" v-if="form.vips.length>1" size="small" @click="removeVip(index)"></el-button>
		    <el-button type="success" icon="plus" v-if="index == form.vips.length-1" size="small" @click="addVip"></el-button>
		  </el-form-item>
		  </div>
		  <el-form-item>
		  
	  	</el-form-item>
		  <el-form-item>
	    <el-button type="primary" @click="saveVip">保存</el-button>
	  	</el-form-item>
	</el-form>
	</el-col>
	</el-row>
	</el-tab-pane>
	
  </el-tabs>
	
	</section>
</template>

<script>
	import appBasicSet from '@/components/system/appBasicSet'
	import wxAppSet from '@/components/system/wxAppSet'
	import { editApp } from '../../api/api'
	export default {
		components: {
			appBasicSet,
			wxAppSet
		},
		data() {
			return {
				activeName: 'pane1',
				form: {
					vips: [
						{marketPrice: 0, price: 0, period: 0}
					]
				}
			}
		},
		methods: {
			addVip() {
				this.form.vips.push({
					price: 0,
					title: ''
				})
			},
			removeVip( index ) {
				this.form.vips.splice(index, 1)
			},
			saveVip() {
				const app = this.store.get('app')
				editApp({
					clientAppId: app.appId,
					title: app.basic.title,
					vips: this.form.vips
				}).then(res => {
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '保存成功'
						});
						this.store.set('app', res.data);
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			}
		},
		mounted() {
			const app = this.store.get('app')
			this.form = {
				vips: app.extra.vips || [
					{
						title: '',
						price: 0
					}
				]
			}
		}
	}

</script>