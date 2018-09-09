<template>
    <section>
        <el-tabs v-model="activeName">
            <el-tab-pane label="概览" name="p1" v-if='canShow'>
                <div class="chart-container">
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
                         <p>今日充值数量</p>
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
                         <p>总充值数量</p>
                         </el-col>
                     </el-row>
                    <el-row>
                    <el-col :span="12">
                        <div id="chartLine" style="width:100%; height:400px;"></div>
                    </el-col>
                    <el-col :span="12">
                        <div id="chartLine2" style="width:100%; height:400px;"></div>
                    </el-col>
                    </el-row>
                         <!--
                         <el-col :span="12">
                             <div id="chartBar" style="width:100%; height:400px;"></div>
                         </el-col>
                         
                         <el-col :span="12">
                             <div id="chartPie" style="width:100%; height:400px;"></div>
                         </el-col>
                         -->
                         
                </div>
            </el-tab-pane>
            <el-tab-pane label="设备每日使用量排行" name="p2">
                <dev-sort></dev-sort>
            </el-tab-pane>
            <el-tab-pane label="代理商每日收入排行" name="p3">
                <agent-sort></agent-sort>
            </el-tab-pane>
        </el-tabs>
        
    </section>
</template>

<script>
    import echarts from 'echarts'
    import { getAnalyticsBrief, getAnalyticsSeries } from '../../api/api';
    import moment from 'moment'
    import devSort from '@/components/zbcdz/devUseSort'
    import agentSort from '@/components/zbcdz/agentSort'

    export default {
        data() {
            return {
                activeName: 'p1',
                canShow: false,
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
        components: {
            devSort,
            agentSort
        },
        methods: {
            drawLineChart2() {
                this.chartLine = echarts.init(document.getElementById('chartLine2'));
                this.chartLine.setOption({
                    title: {
                        text: '充值数量'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['充值数量']
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
                            name: '充值数量',
                            type: 'line',
                            smooth: true,
                            data: this.tradeVolumes
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
            let user = this.store.get('user');
            if(user&&user.role.level == 1) {
                this.activeName = 'p1';
                this.canShow = true;
            } else {
                this.activeName = 'p2';
                this.canShow = false;
            }
            getAnalyticsBrief({}).then(res => {
                this.brief = res.data
            })
            getAnalyticsSeries({
                startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD')
            }).then(res => {
                this.series = res.data
                let currentDate = res.data[0].date
                let i = 0

                const pData = []
                res.data.forEach( e => {
                    if(e.pageView || e.userView || e.tradeVolume)
                        pData.push(e)
                })   
                while(currentDate <= pData[pData.length-1].date){
                    let exist = false
                    pData.forEach(e => {
                        if(e.date == currentDate && !exist){
                            this.pageViews.push((e.pageView)?e.pageView:0)
                            this.userViews.push((e.userView)?e.userView:0)
                            this.tradeVolumes.push(( e.tradeVolume)?e.tradeVolume:0 )
                            exist = true
                        }  
                    })
                    if(!exist){
                        this.pageViews.push(0)
                        this.userViews.push(0)
                        this.tradeVolumes.push(0)
                    }
                    this.days.push(currentDate)
                    i += 1
                    currentDate = moment(currentDate).add(1, 'days').format('YYYY-MM-DD')
                }
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
