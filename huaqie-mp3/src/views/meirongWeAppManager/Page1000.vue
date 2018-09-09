<template>
    <section class="chart-container">
    	<el-row>
    		<el-col :span="4">
    		<h3>{{ (brief.series && brief.series.pageView) || '0' }}</h3>
    		<p>今日点击量</p>
    		</el-col>
    		<el-col :span="4">
    		<h3>{{ (brief.series && brief.series.userView) || '0' }}</h3>
    		<p>今日访问量</p>
    		</el-col>
    		<el-col :span="4">
    		<h3>{{ (brief.series && brief.series.tradeVolume) || '0' }}</h3>
    		<p>今日交易量</p>
    		</el-col>
    		<el-col :span="4">
    		<h3>{{ (brief.series && brief.series.user) || '0' }}</h3>
    		<p>今日新增用户</p>
    		</el-col>
    		<el-col :span="4">
    		<h3>{{ (brief.cumulant && brief.cumulant.user) || '0' }}</h3>
    		<p>总用户</p>
    		</el-col>
    		<el-col :span="4">
    		<h3>{{ (brief.cumulant && brief.cumulant.tradeVolume) || '0' }}</h3>
    		<p>总交易量</p>
    		</el-col>
    	</el-row>
       <el-row>
        <el-col :span="12">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartLine2" style="width:100%; height:400px;"></div>
            </el-col>
         	<!--
            <el-col :span="12">
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col>
            
            <el-col :span="12">
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
            -->
            
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import { getAnalyticsBrief, getAnalyticsSeries } from '../../api/api';
    import moment from 'moment'

    export default {
        data() {
            return {
                brief: {},
                series: [],
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                tradeVolumes: [],
                pageViews: [],
                userViews: [],
                days: []
            }
        },

        methods: {
            drawLineChart2() {
                this.chartLine = echarts.init(document.getElementById('chartLine2'));
                this.chartLine.setOption({
                    title: {
                        text: '交易量'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['交易量']
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
                    series: [{
                            name: '交易量',
                            type: 'line',
                            smooth: true,
                            data: this.tradeVolumes
                        }
                    ]
                });
            },
            drawBarChart() {
                this.chartBar = echarts.init(document.getElementById('chartBar'));
                this.chartBar.setOption({
                    title: {
                        text: '销售员',
                        subtext: '数据来自网络'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['2011年', '2012年']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
                    },
                    series: [
                        {
                            name: '2011年',
                            type: 'bar',
                            data: [18203, 23489, 29034, 104970, 131744, 630230]
                        },
                        {
                            name: '2012年',
                            type: 'bar',
                            data: [19325, 23438, 31000, 121594, 134141, 681807]
                        }
                    ]
                });
            },
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: '流量'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['用户点击量', '用户访问量', '交易额']
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
                            name: '用户点击量',
                            type: 'line',
                            smooth: true,
                            data: this.pageViews
                        },
                        {
                            name: '用户访问量',
                            type: 'line',
                            smooth: true,
                            data: this.userViews
                        }
                    ]
                });
            },
            drawCharts() {
                this.drawLineChart()
                this.drawLineChart2()
            },
        },

        mounted: function () {
            
            getAnalyticsBrief({}).then(res => {
                this.brief = res.data
            })
            getAnalyticsSeries({
                startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD')
            }).then(res => {
                this.series = res.data
                res.data.forEach( e => {
                    this.pageViews.push( e.pageView )
                    this.userViews.push( e.userView )
                    this.tradeVolumes.push( e.tradeVolume )
                    this.days.push( e.date )
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
