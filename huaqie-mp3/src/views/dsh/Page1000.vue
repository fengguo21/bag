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
       <div class="date-picker-box">
       <span style="margin-right: 20px">{{ startDate }} ~ {{ endDate }}</span>
             <el-date-picker
              v-model="reportDate"
              type="daterange"
              align="right"
              placeholder="选择日期范围"
              @change="changeDate"
              :picker-options="pickerOptions">
            </el-date-picker>
            </div>
        <el-col :span="12">
            
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartLine2" style="width:100%; height:400px;"></div>
            </el-col>
         	           <el-col :span="12">
                <div id="chartLine3" style="width:100%; height:400px;"></div>
            </el-col>
            
            <el-col :span="12">
                <div id="chartLine4" style="width:100%; height:400px;"></div>
            </el-col>
   
            
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
                comments: [],
                reads: [],
                days: [],
                pickerOptions: {
                  shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近一个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近三个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                      picker.$emit('pick', [start, end]);
                    }
                  }]
                },
                reportDate: '',
                startDate: '',
                endDate: ''
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
                            data: this.tradeVolumes,
                            symbol: 'circle',
                            symbolSize: 9,
                            itemStyle: {
                                normal: {
                                    color: '#ef4227'
                                }
                            }
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
                            data: this.pageViews,
                            symbol: 'circle',
                            symbolSize: 9,
                            itemStyle: {
                                normal: {
                                    color: '#ef4227'
                                }
                            }
                        },
                        {
                            name: '用户访问量',
                            type: 'line',
                            smooth: true,
                            data: this.userViews,
                            symbol: 'circle',
                            symbolSize: 9,
                            itemStyle: {
                                normal: {
                                    color: '#39a213'
                                }
                            }
                        }
                    ]
                });
            },
            drawLineChart3() {
                this.chartLine = echarts.init(document.getElementById('chartLine3'));
                this.chartLine.setOption({
                    title: {
                        text: '评论量'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['评论量']
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
                            name: '评论量',
                            type: 'line',
                            smooth: true,
                            data: this.comments,
                            symbol: 'circle',
                            symbolSize: 9,
                            itemStyle: {
                                normal: {
                                    color: '#ef4227'
                                }
                            }
                        }
                    ]
                });
            },
            drawLineChart4() {
                this.chartLine = echarts.init(document.getElementById('chartLine4'));
                this.chartLine.setOption({
                    title: {
                        text: '阅读量'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['阅读量']
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
                            name: '阅读量',
                            type: 'line',
                            smooth: true,
                            data: this.reads,
                            symbol: 'circle',
                            symbolSize: 9,
                            itemStyle: {
                                normal: {
                                    color: '#ef4227'
                                }
                            }
                        }
                    ]
                });
            },
            drawCharts() {
                this.drawLineChart()
                this.drawLineChart2()
                this.drawLineChart3()
                this.drawLineChart4()
            },
            updateSeries() {
                getAnalyticsSeries({
                    startDate: this.startDate,
                    endDate: this.endDate
                }).then(res => {
                    this.series = res.data
                    this.days = []
                    this.pageViews = []
                    this.userViews = []
                    this.tradeVolumes = []
                    this.comments = []
                    this.reads = []
                    res.data.forEach( e => {
                        this.pageViews.push( e.pageView )
                        this.userViews.push( e.userView )
                        this.tradeVolumes.push( e.tradeVolume )
                        this.comments.push( e.comment )
                        this.reads.push( e.read )
                        this.days.push( e.date )
                    })
                    this.drawCharts()
                })
            },
            changeDate() {
                if(this.reportDate.length == 2 && this.reportDate[0] && this.reportDate[1]){
                    this.startDate = moment(this.reportDate[0]).format('YYYY-MM-DD')
                    this.endDate = moment(this.reportDate[1]).format('YYYY-MM-DD')
                    this.updateSeries()
                }else{
                    this.startDate = moment().subtract(30, 'days').format('YYYY-MM-DD')
                    this.endDate = moment().format('YYYY-MM-DD')
                    this.updateSeries()
                }
            }
        },

        mounted: function () {
            getAnalyticsBrief({}).then(res => {
                this.brief = res.data
            })
            this.startDate =  moment().subtract(30, 'days').format('YYYY-MM-DD')
            this.endDate = moment().format('YYYY-MM-DD')
            this.updateSeries()
        }
    }
</script>

<style scoped>
.date-picker-box{
    border-top: 1px solid #e3e3e3;
    padding-top: 20px;
    margin-top: 20px;
    margin-bottom: 0px;
    text-align: right;
}
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
