<template>
    <section class="chart-container">
    	
       <el-row>
        <el-col :span="24">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            
            
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import { getAudienceCount } from '../../api/api';
    import moment from 'moment'

    export default {
        data() {
            return {
                days: [],
                values: []
            }
        },

        methods: {
            
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: '新增人数'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['新用户关注']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.days
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '新用户关注',
                            type: 'line',
                            smooth: true,
                            data: this.values
                        }
                    ]
                });
            },
            drawCharts() {
                this.drawLineChart()
            },
        },

        mounted: function () {
            getAudienceCount({
                startTime: moment().subtract(60, 'days').valueOf(),
                endTime: moment().valueOf()
            }).then(res => {
                console.log(res)
                res.data.forEach( e => {
                    this.days.push(e.day)
                    this.values.push(e.count)
                })
                this.drawCharts()
            })
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
