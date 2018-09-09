<template>
	<section>
		<el-tabs v-model="activeName" @tab-click="handleClick">
		  <el-tab-pane label="资金概览" name="p1">
				<overview></overview>
		  </el-tab-pane>
		  <el-tab-pane label="收入明细" name="p2" v-if="level==1">
		  		<income></income>
		  </el-tab-pane>
		  <el-tab-pane label="向我提现" name="p3" v-if="agentLevel!=3">
		  		<withdrawal></withdrawal>
		  </el-tab-pane>
		  <el-tab-pane label="我的提现" name="p4">
		  		<my-withdraw v-if='show'></my-withdraw>
		  </el-tab-pane>
		  <el-tab-pane label="日收入明细" name="p6" v-if="level==1">
		  		<day-count></day-count>
		  </el-tab-pane>
		  <el-tab-pane label="周收入明细" name="p7" v-if="level==1">
		  		<week-count></week-count>
		  </el-tab-pane>
		  <el-tab-pane label="月收入明细" name="p8" v-if="level==1">		  		
		  		<month-count></month-count>
		  </el-tab-pane>
		   <!-- v-if='level != 1' -->
		  <el-tab-pane label="我的银行卡" name='p5' v-if='level != 1'>
		  		<set-bank></set-bank>	
		  </el-tab-pane>
		</el-tabs>
	</section>
</template>

<script>
	import overview from '@/components/zbcdz/management/overview'
	import income from '@/components/zbcdz/management/income'
	import withdrawal from '@/components/zbcdz/management/withdrawal'
	import myWithdraw from '@/components/zbcdz/management/myWithdraw'
	import setBank from '@/components/zbcdz/management/setBank'
	import dayCount from '@/components/zbcdz/management/dayCount'
	import weekCount from '@/components/zbcdz/management/weekCount'
	import monthCount from '@/components/zbcdz/management/monthCount'
	import { getCurrentAgent } from '@/api/api'
	export default {
		name: 'management',
		components: {
			overview,
			income,
			withdrawal,
			myWithdraw,
			setBank,
			dayCount,
			weekCount,
			monthCount
		},
		data() {
			return {
				activeName: 'p1',
				newWithdraw: null,
				show: false,
				agentLevel: ''
			}
		},
		computed: {
			level() {
				return this.store.get('user').role.level
			}
		},
		methods: {
			handleClick(tab, event) {
				// console.log(tab);
				if(tab.index == 3 && this.$store.getters.getWithdraw) {
					this.show = true;
				} else if(!this.$store.getters.getWithdraw) {
					this.show = true;
				} else {
					this.show = false;
				}
			}
		},
		created() {
			getCurrentAgent({
				peopleId: this.store.get('user').peopleId
			}).then(res => {
				if(res && res.data)
					this.agentLevel = res.data.extra.level
			})
		}
	}

</script>

<style scoped>

</style>