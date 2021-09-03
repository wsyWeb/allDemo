<template>
    <div id="charts1" style="width: 1000px; height: 420px"></div>
    <div id="charts2" style="width: 1000px; height: 420px"></div>
    <div id="charts0" style="width: 1000px; height: 420px"></div>
</template>

<script>
import * as echarts from 'echarts'
import { ydpBackData, ldAndSdData, xData, xData1, xData2, yData, yData1, yData2 } from './cop/ydp.js'
export default {
    data() {
        return {
            dv1_xData: [],
            dv2_xData: [],
            main1Data: [],
            main2Data: [],
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            this.initYdpChart()

            // format 粒径和粒速
            for (var i = 1; i <= 32; i++) {
                if (i < 29) {
                    //dv1_xData.push(xData[i-1]);
                    this.main1Data.push([xData[i - 1], ldAndSdData[0][i - 1]])
                    //dv2_xData.push(yData[i-1]);
                    this.main2Data.push([yData[i - 1], ldAndSdData[1][i - 1]])
                }
            }
            this.dispSum_D()
            this.dispSum_V()
        })
    },
    methods: {
        initYdpChart() {
            const drawData = []

            /**
             * 第一种展示方式,x y 轴 看起来不连续，
             */
            // var sum_dv32_data = ydpBackData.sum_dv32_data;
            //     for(var i = 0; i < sum_dv32_data.length; i++){
            //     var x = sum_dv32_data[i];
            //     for (var j = 0; j < x.length; j++) {
            //         if(x[j] != 0){
            //             if(i<24 && j<28){
            //                 data.push([i, j, x[j]]);
            //                 //data.push([xData2[i], j, x[j]]);
            //             }

            //         }
            //     }
            // }
            /**
             * 第二种展示方式,x y 轴 展示整刻度，
             */
            var sum_dv32_data = ydpBackData.ndv32 //ydpBackData.sum_dv32_data;
            for (var i = 0; i < xData1.length; i++) {
                //粒径量级值扩展版  循环
                //用扩展板对应的数组，取真实的值
                var x = sum_dv32_data[xData2[i]]
                for (var j = 0; j < yData2.length; j++) {
                    //速度量级值扩展版  循环
                    if (x && x[yData2[j]] != 0) {
                        //只画大于零的部分
                        //用扩展板对应的数组，取真实的值
                        drawData.push([i, j, x[yData2[j]]])
                    }
                }
            }
            var myChart = echarts.init(document.getElementById('charts0'))
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        //console.log(params);
                        return '粒径：' + params.name + '<br>粒速：' + yData1[params.value[1]] + '<br>粒子数浓度：' + params.value[2].toFixed(6)
                    },
                    //islandFormatter: "{b} : {c}"
                },
                title: {
                    text: '雨滴谱图',
                    left: 60,
                },
                grid: {
                    right: 10,
                    left: 60,
                },
                xAxis: {
                    name: '粒径 D(mm)',
                    nameLocation: 'middle',
                    type: 'category',
                    nameGap: '25',
                    data: xData1,
                    axisLabel: {
                        //X轴刻度配置
                        interval: 8, //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                    },
                },
                yAxis: {
                    name: '粒速 V(m/s)',
                    nameLocation: 'middle',
                    nameGap: '45',
                    type: 'category',
                    data: yData1,
                    axisLabel: {
                        //y轴刻度配置
                        interval: 10, //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                    },
                },
                visualMap: {
                    type: 'piecewise',
                    // pieces: [
                    // 	{min: 10000}, // 不指定 max，表示 max 为无限大（Infinity）。
                    // 	{min: 5000, max: 10000},
                    // 	{min: 1000, max: 5000},
                    // 	{min: 100, max: 1000},
                    // 	{min: 1, max: 100},
                    // ],
                    pieces: [
                        { min: 300 }, // 不指定 max，表示 max 为无限大（Infinity）。
                        { min: 200, max: 300, label: '200 - 300' },
                        { min: 100, max: 200, label: '100 - 200' },
                        { min: 50, max: 100, label: '50 - 100' },
                        { min: 0, max: 50, label: '0 - 50' },
                    ],
                    //min: 1,
                    //max: 10000,
                    calculable: true,
                    realtime: false,
                    // splitNumber: 5,
                    inRange: {
                        color: ['#00009C', '#037CFA', '#00835F', '#FC7F03', '#FE0003'],
                        //color: ['#00009C', '#037CFA', '#00835F', '#FC7F03', '#FE0003']
                    },
                    bottom: 60,
                    right: 5,
                    text: ['粒子数浓度（mm-1 m-3）', ''],
                    showLabel: true,
                },
                series: [
                    {
                        //name: 'Gaussian',
                        type: 'heatmap',
                        data: drawData,
                        itemStyle: {
                            emphasis: {
                                borderColor: '#333',
                                borderWidth: 1,
                            },
                        },
                        progressive: 1000,
                        animation: false,
                    },
                ],
            }
            //使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
        },
        dispSum_D() {
            const main1Chart = echarts.init(document.getElementById('charts1'))
            const _this = this
            const main1Option = {
                title: {
                    text: '粒径分布图',
                    left: 70,
                },
                grid: {
                    right: 10,
                    left: 70,
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        //console.log(params[0]);
                        return '粒径：' + params[0].value[0] + '<br>粒子数浓度：' + params[0].value[1].toFixed(6)
                    },
                },
                /*  xAxis: {
	    	name: "粒径",
	    	nameLocation: 'middle',
	        type: 'category',
	        nameGap : '25',
	        data: dv1_xData,
	        axisLabel:{
	            //X轴刻度配置
	            interval:3 //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
	       }
	    },*/
                xAxis: {
                    name: '粒径',
                    nameLocation: 'middle',
                    nameGap: '25',
                    min: 0,
                    max: 8,
                    type: 'value',
                    splitLine: {
                        show: false,
                    },
                },
                yAxis: {
                    name: '粒子数浓度/m-3',
                    nameLocation: 'middle',
                    nameGap: '50',
                    type: 'value',
                    //boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false,
                    },
                },
                series: [
                    {
                        name: '数据',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: _this.main1Data,
                    },
                ],
            }
            //使用刚指定的配置项和数据显示图表。
            main1Chart.setOption(main1Option)
        },
        dispSum_V() {
            const main2Chart = echarts.init(document.getElementById('charts2'))
            const _this = this
            const main2Option = {
                title: {
                    text: '速度分布图',
                    left: 70,
                },
                grid: {
                    right: 10,
                    left: 70,
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        //console.log(params[0]);
                        return '粒速：' + params[0].value[0] + '<br>粒子数浓度：' + params[0].value[1].toFixed(6)
                    },
                },
                /* xAxis: {
	  	name: "速度",
	  	nameLocation: 'middle',
	      type: 'category',
	      nameGap : '25',
	      data: dv2_xData,
	      axisLabel:{
	          //X轴刻度配置
	          interval:3 //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
	     }
	  },*/
                xAxis: {
                    name: '速度',
                    nameLocation: 'middle',
                    nameGap: '25',
                    min: 0,
                    max: 12,
                    type: 'value',
                    splitLine: {
                        show: false,
                    },
                },
                yAxis: {
                    name: '粒子数浓度/m-3',
                    nameLocation: 'middle',
                    nameGap: '50',
                    type: 'value',
                    //boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false,
                    },
                },
                series: [
                    {
                        name: '数据',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: _this.main2Data,
                    },
                ],
            }
            //使用刚指定的配置项和数据显示图表。
            main2Chart.setOption(main2Option)
        },
    },
}
</script>

<style scoped lang="less"></style>
