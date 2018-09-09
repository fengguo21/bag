<template>

			<el-select v-model="myCompany" placeholder="请选择">
		    <el-option
		      v-for="item in shipments"
		      :key="item"
		      :label="item"
		      :value="item">
		    </el-option>
		  </el-select>
		

</template>
<script>
	import { chargeSet } from '@/api/api'
	export default {
		name: 'chargeSet',
		props: ['company'],
		watch: {
			company(val) {
				this.myCompany = val
			},
			myCompany(val) {
				this.$emit('on-company-change', val)
			}
		},
		data() {
			return {
		        shipments: ["顺丰快递", "德邦", "大田物流", "EMS", "FEDEX联邦(国内件）","广东邮政","国通快递","高铁速递","汇丰物流","天天快递","百世快递","佳吉快运","民航快递","申通快递","万家物流","新邦物流","韵达快递","圆通速递","邮政平邮/小包","宅急送","中铁快运","中铁物流","中邮物流","DHL","安捷快递","安能物流","安信达快递","北青小红帽","百福东方","CCES快递","城市100","COE东方快递","长沙创一","成都善途速运","D速物流","快捷速递","飞康达","共速达","国通快递","恒路物流","华强物流", "嘉里物流", "捷特快递", "急先达", "全日通快递", "全峰快递", "速通物流", "全一快递", "速必达物流"],
		        myCompany: this.company
			}
		}
	}
</script>
<style scoped></style>