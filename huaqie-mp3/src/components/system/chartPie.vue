<template>
<div style="width:400px;height:400px;">
	{{temp}}
	    <IEcharts :option="chartOption"></IEcharts>
	</div>

</template>
<script>
	import IEcharts from 'vue-echarts-v3/src/full.vue';

	export default {
		name: 'chartPie',
		props: ['option'],
		components: {
			IEcharts
		},
		data() {
			return {
				temp: '',
				 chartOption : {
					    title : {
					        text: '资金分布',
					        subtext: '资金分布比例',
					        x:'center'
					    },
					    tooltip : {
					        trigger: 'item',
					        formatter: "{a} <br/>{b} : {c} ({d}%)"
					    },
					    legend: {
					        orient : 'vertical',
					        x : 'left',
					        data:[]
					    },
					    toolbox: {
					        show : true,
					        feature : {
					            mark : {show: true},
					            dataView : {show: true, readOnly: false},
					            magicType : {
					                show: true, 
					                type: ['pie', 'funnel'],
					                option: {
					                    funnel: {
					                        x: '25%',
					                        width: '50%',
					                        funnelAlign: 'left',
					                        max: 1548
					                    }
					                }
					            },
					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
					    },
					    calculable : true,
					    series : [
					        {
					            name:'资金分布',
					            type:'pie',
					            radius : '55%',
					            center: ['50%', '60%'],
					            data: []
					        }
					    ]
					}
			}
		},
		watch: {
	        'option':function(n, o) {
	            this.chartOption.legend.data = n.map(e => e.name)
				this.chartOption.series[0].data = n
	        }
        }
	}
</script>
<style scoped>

</style>