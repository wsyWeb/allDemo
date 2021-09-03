<template>
    <div class="personChart heightAll widthAll">
        <div class=" flex-between" style="height: 40%">
            <div id="pieChartMain" class="heightAll"></div>
            <a-row class="text-center completionRate ">
                <img src="~@/assets/images/operation/chart.png" style="width: 70%" alt="" />
                <div class="numWrap">
                    <div class="num">{{ peopleStateData.avgTaskRate }}</div>
                    <div class="tip">平均完成率</div>
                </div>
            </a-row>
        </div>
        <div id="barChartMain" style="height: 60%"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'

let peiChart = null,
    barChart = null
export default {
    data() {
        return {
            peopleStateData: {},
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            this.initPieChart()
            this.initBarChart()
        })
    },
    methods: {
        initPieChart() {
            if (peiChart) peiChart.clear()
            const chartDom = document.getElementById('pieChartMain'),
                total = '20'

            peiChart = echarts.init(chartDom)
            const option = {
                title: {
                    zlevel: 0,
                    text: '{a|共计}\n{b|' + total + '}',
                    // subtext: '123',// 副标题
                    // subtextStyle: {
                    //     color: '#66ccff',
                    //     fontWeight: 'bold',
                    //     fontSize: 14,
                    // },
                    textStyle: {
                        rich: {
                            a: {
                                fontSize: 14,
                                color: '#66ccff',
                                fontWeight: '600',
                            },
                            b: {
                                fontSize: 24,
                                color: '#99CCFF',
                                fontWeight: 'bold',
                                padding: [0, 0, 5, 0],
                            },
                        },
                    },
                    x: 'center', //文字位置
                    y: 'center', //文字位置
                },
                tooltip: {
                    show: false,
                    trigger: 'item',
                },
                legend: {
                    show: false,
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['35%', '55%'],
                        // startAngle: 270,
                        hoverAnimation: false,
                        data: [
                            { value: 20, name: `无任务20人` },
                            { value: 40, name: `工作中${40}人` },
                        ],
                        label: {
                            color: '#99CCFF',
                            align: 'center',
                            alignTo: 'labelLine',
                        },
                        labelLine: {
                            lineStyle: {
                                color: '#99CCFF',
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: (params) => {
                                    const colorList = [
                                        {
                                            c1: '#2FB383', //实践
                                            c2: '#18A86B',
                                        },
                                        {
                                            c1: '#00C0FA', //管理
                                            c2: '#015EEA',
                                        },
                                    ]
                                    return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                                        {
                                            //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                            offset: 0,
                                            color: colorList[params.dataIndex].c1,
                                        },
                                        {
                                            offset: 1,
                                            color: colorList[params.dataIndex].c2,
                                        },
                                    ])
                                },
                            },
                        },
                        emphasis: {
                            show: false,
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    },
                ],
            }
            option && peiChart.setOption(option)
            window.onresize = () => {
                peiChart.resize()
            }
        },
        initBarChart() {
            if (barChart) barChart.clear()
            const chartDom = document.getElementById('barChartMain'),
                data2 = [150, 212, 201, 154],
                data1 = [820, 832, 301, 934]
            barChart = echarts.init(chartDom)

            const option = {
                tooltip: {
                    show: false,
                    trigger: 'axis',
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                legend: {
                    data: ['待执行检修次数', '已完成检修次数'],
                    top: 20,
                    textStyle: {
                        color: '#66CCFF',
                    },
                },
                grid: {
                    left: '0',
                    right: '10%',
                    bottom: '15%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'value',
                    name: '次',
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#99ccff',
                        },
                    },
                },
                yAxis: {
                    type: 'category',
                    data: ['检修员1', '检修员2', '检修员3', '检修员4'],
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#99ccff',
                        },
                    },
                },
                series: [
                    {
                        name: '待执行检修次数',
                        type: 'bar',
                        barWidth: 16,
                        stack: '总量',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(0,63,119,0)',
                        },
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {
                                        offset: 0,
                                        color: '#89F7FE', //渐变1
                                    },
                                    {
                                        offset: 1,
                                        // color: '#4693EC',//渐变2
                                        color: '#66A6FF', //渐变2
                                    },
                                ]),
                            },
                        },
                        data: data1,
                        z: 1,
                    },
                    {
                        name: '已完成检修次数',
                        type: 'bar',
                        barWidth: 16,
                        stack: '总量',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(0,63,119,0)',
                        },
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {
                                        offset: 0,
                                        // color: '#00FFE3',//渐变1
                                        color: '#F28E26', //渐变1
                                    },
                                    {
                                        offset: 1,
                                        // color: '#4693EC',//渐变2
                                        color: '#FD644F', //渐变2
                                    },
                                ]),
                            },
                        },
                        data: data2,
                        z: 0,
                    },
                    {
                        type: 'pictorialBar',
                        barWidth: 16,
                        itemStyle: {
                            normal: {
                                color: '#152749', //数据的间隔颜色
                            },
                        },
                        symbolRepeat: 'fixed',
                        symbolMargin: 4,
                        symbol: 'rect',
                        symbolSize: [5, 16],
                        symbolPosition: 'end',
                        symbolOffset: [8, 0],
                        data: [1, 1, 1, 1],
                        z: 2,
                        zlevel: 0,
                    },
                ],
            }
            option && barChart.setOption(option)
            window.onresize = () => {
                barChart.resize()
            }
        },
    },
}
</script>

<style scoped lang="less">
#pieChartMain {
    width: 60%;
}
.completionRate {
    width: 40%;
    padding-top: 15%;
    .numWrap {
        position: relative;
        top: -20px;
    }
    .num {
        color: #00ffff;
        font-size: 20px;
    }
    .tip {
        color: #99ccff;
    }
}
</style>
