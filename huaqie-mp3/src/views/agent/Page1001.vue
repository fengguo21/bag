<template>
	<el-form ref="form" :model="form" label-width="80px" style="margin:20px;width:70%;min-width:500px;">
		<el-form-item label="应用名称">
			<el-input class="mini" v-model="form.title"></el-input>
		</el-form-item>
		<el-form-item label="应用类型">
		<div :class="item.className" v-for="item in groups" @click="choose(item)"><img :src="item.icon"> {{item.title}}</div>
			
		</el-form-item>
		<el-form-item label="应用简介">
			<el-input class="mini" type="textarea" :rows="5" v-model="form.desc"></el-input>
		</el-form-item>
		<el-form-item label="公司名称">
			<el-input class="mini" v-model="form.company"></el-input>
		</el-form-item>
		<el-form-item label="公司地区">
			<el-select v-model="form.province" placeholder="请选择公司所在省份">
				<el-option label="上海市" value="上海市"></el-option>
				<el-option label="广东省" value="广东省"></el-option>
				<el-option label="江苏省" value="江苏省"></el-option>
			</el-select>
			<el-select v-model="form.city" placeholder="请选择公司所在城市">
				<el-option label="松江区" value="松江区"></el-option>
				<el-option label="徐汇区" value="徐汇区"></el-option>
				<el-option label="淮安市" value="淮安市"></el-option>
			</el-select>
		</el-form-item>
		
		
		<el-form-item>
			<el-button type="primary" @click="submit">立即创建</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import { addApp } from '../../api/api';
	export default {
		data() {
			return {
				form: {
					title: '',
					group: '',
					desc: '',
					company: '',
					province: '',
					city: ''
				},
				group: 'xks',
				groups: [
					{
						title: '移动收款',
						group: 'xks',
						originIcon: 'yidongshoukuan',
						icon: require('../../assets/yidongshoukuan-active.png'),
						className: 'group active'
					},{
						title: '欢乐送',
						group: 'wm',
						originIcon: 'huanlesong',
						icon: require('../../assets/huanlesong.png'),
						className: 'group'
					},{
						title: '分销批发商城',
						group: 'mmd',
						originIcon: 'fenxiaopifa',
						icon: require('../../assets/fenxiaopifa.png'),
						className: 'group'
					},{
						title: '共享充电',
						group: 'zbcdz',
						originIcon: 'gongxiangchongdian',
						icon: require('../../assets/gongxiangchongdian.png'),
						className: 'group'
					},{
						title: '小商铺',
						group: 'common',
						originIcon: 'xiaoshangpu',
						icon: require('../../assets/xiaoshangpu.png'),
						className: 'group'
					},{
						title: '精品商城',
						group: 'common',
						originIcon: 'jinpinshangcheng',
						icon: require('../../assets/jinpinshangcheng.png'),
						className: 'group'
					},{
						title: '客临门',
						group: 'klm',
						originIcon: 'kelinmen',
						icon: require('../../assets/kelinmen.png'),
						className: 'group'
					},{
						title: '收钱宝',
						group: 'cashier',
						originIcon: 'shouqianbao',
						icon: require('../../assets/shouqianbao.png'),
						className: 'group'
					},{
						title: '小程序点餐',
						group: 'diner',
						originIcon: 'xiaochengxudiancan',
						icon: require('../../assets/xiaochengxudiancan.png'),
						className: 'group'
					},{
						title: '公众号二维码推广',
						group: 'qrcodereferee',
						originIcon: 'erweima',
						icon: require('../../assets/erweima.png'),
						className: 'group'
					},{
						title: '会员宝',
						group: 'hyb',
						originIcon: 'huiyuanbao',
						icon: require('../../assets/huiyuanbao.png'),
						className: 'group'
					},{
						title: '婚纱摄影',
						group: 'hssy',
						originIcon: 'hunshasheying',
						icon: require('../../assets/hunshasheying.png'),
						className: 'group'
					},{
						title: '爱英语',
						group: 'ienglish',
						originIcon: 'hunshasheying',
						icon: require('../../assets/hunshasheying.png'),
						className: 'group'
					},{
						title: '中铁物流',
						group: 'ztwl',
						originIcon: 'hunshasheying',
						icon: require('../../assets/hunshasheying.png'),
						className: 'group'
					},{
						title: '学校',
						group: 'college',
						originIcon: 'hunshasheying',
						icon: require('../../assets/hunshasheying.png'),
						className: 'group'
					},{
						title: '美容小程序管理',
						group: 'meirongWeAppManager',
						originIcon: 'hunshasheying',
						icon: require('../../assets/hunshasheying.png'),
						className: 'group'
					},{
						title: '易运动',
						group: 'yyd',
						originIcon: 'hunshasheying',
						icon: require('../../assets/hunshasheying.png'),
						className: 'group'
					},{
						title: '读书会',
						group: 'dsh',
						originIcon: 'hunshasheying',
						icon: require('../../assets/hunshasheying.png'),
						className: 'group'
					}
				]
			}
		},
		methods: {
			choose(item) {
				
				this.group = item.group
				this.groups.forEach(e => {
					if(e.title == item.title){
						e.className = 'group active'
						e.icon = require(`../../assets/${e.originIcon}-active.png`)
					}
					else{
						e.className = 'group'
						e.icon = require(`../../assets/${e.originIcon}.png`)
					}
				})
				console.log(this.group)
			},
			submit() {
				console.log('submit!');
				this.form.group = this.group
				if(!this.form.title){
					this.$message.warning('请输入应用名称')
					return
				}else if(!this.form.company){
					this.$message.warning('请输入公司名称')
					return
				}
				
				addApp(this.form).then((res) => {
					this.addLoading = false;
					if(res.code){
						this.$message({
							message: res.message,
							type: 'error'
						})
						return
					}
					//NProgress.done();
					this.$message({
						message: '提交成功',
						type: 'success'
					});
					this.$refs['form'].resetFields();
				}, err => {});
			}
		}
	}

</script>

<style scoped>
.mini{
	max-width: 50%;
}
	.group{
		border: 1px solid gray;
		display: inline-block;
		margin: 10px;
		cursor: default;
		padding: 5px 20px;
		border-radius: 25px;
	}
	.group img{
		vertical-align: middle;
		with: 24px;
		height: 24px;
		margin-right: 10px;
	}
	.group.active{
		border-color: #20a0ff;
		color: #20a0ff;
	}
</style>