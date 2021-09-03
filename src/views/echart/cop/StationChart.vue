<template>
    <div id="chartMain"></div>
</template>

<script>
import * as echarts from 'echarts'

var myChart = null
export default {
    data() {
        return {
            datas: [120, 200, 150, 80, 70, 110, 130],
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            this.init()
        })
    },
    methods: {
        init() {
            if (myChart) myChart.clear()

            const chartDom = document.getElementById('chartMain')
            myChart = echarts.init(chartDom)
            const option = {
                xAxis: {
                    type: 'category',
                    data: ['市中区', '金口河区', '夹江区', '犍为县', '高新区', '井研县', '沐川县'],
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#99ccff',
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        interval: 0,
                        rotate: 60,
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '次',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#99ccff',
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#6076AD',
                            opacity: 0.3,
                        },
                    },
                },
                series: [
                    {
                        data: this.datas,
                        type: 'bar',
                        barMaxWidth: 20,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#63b5ed' },
                                { offset: 1, color: '#7077e7' },
                            ]),
                        },
                    },
                ],
            }
            option && myChart.setOption(option)
            window.onresize = () => {
                myChart.resize()
            }
        },
    },
}
</script>

<style scoped lang="less"></style>
