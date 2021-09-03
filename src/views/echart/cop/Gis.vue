<template>
    <div class="gisWrap heightAll widthAll">
        <div class="gisBg heightAll widthAll"></div>
        <div class="totalWrap">
            <div class="font-20">当前累计维修</div>
            <div class="font-20 num">
                <span class="totalNum">1008</span>
                次
            </div>
        </div>
        <div class="tipPannel">
            <div class="normal list flex">
                <img src="@/assets/images/operation/station-normal.png" width="24px" height="24px" alt="" />
                <div class="p-l-xs">
                    <span>正常站点</span>
                    <div class="normalNum num">{{ gisData.normalSiteNum }}</div>
                </div>
            </div>
            <div class="abnormal list flex">
                <img src="@/assets/images/operation/station-abnormal.png" width="24px" height="24px" alt="" />
                <div class="p-l-xs">
                    <span>异常站点</span>
                    <div class="abnormalNum num">{{ gisData.abnormalSiteNum }}</div>
                </div>
            </div>
            <div class="maintion list flex">
                <img src="@/assets/images/operation/station-maintion.png" width="24px" height="24px" alt="" />
                <div class="p-l-xs">
                    <span>维修站点</span>
                    <div class="maintionNum num">{{ gisData.repairSiteNum }}</div>
                </div>
            </div>
        </div>
        <div class="heightAll widthAll mapWrap">
            <div id="map" class="heightAll" ref="map"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import sichuanJson from './leshan.json'

// import 'echarts/map/js/province/sichuan.js'
// import { request } from '@/api/request'

export default {
    data() {
        return {
            gisData: [],
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
            const markPointData = [
                {
                    name: '市中区', //站点名称
                    coord: [103.791477, 29.606768], // 经纬度
                    state: 0, //0正常站点  1异常站点 2维修站点
                    temperature: '37', //温度
                    humidity: 50, //湿度
                    pressure: 1000, // 气压i
                    windSpeed: 245, // 风速
                    windDirection: '东南风', // 风向
                    uv: 1, //紫外线指数
                },
                {
                    name: '沙湾区',
                    coord: [103.587445, 29.343332],
                    state: 1, //1正常站点 2维修站点 3异常站点
                    temperature: 25.3, //温度
                    humidity: 50, //湿度
                    pressure: 1000, // 气压i
                    windSpeed: 45, // 风速
                    windDirection: '西北风', // 风向
                    uv: 1, //紫外线指数
                    abnormal: 'humidity',
                },
                {
                    name: '五通桥区',
                    coord: [103.802151, 29.409682],
                    state: 2,
                    temperature: 25.3, //温度
                    humidity: 50, //湿度
                    pressure: 1000, // 气压i
                    windSpeed: 45, // 风速
                    windDirection: '西北风', // 风向
                    uv: 1, //紫外线指数
                },
            ]
            const myChart = echarts.init(this.$refs.map)
            echarts.registerMap('sichuan', sichuanJson, {})
            myChart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        if (JSON.stringify(markPointData).indexOf(params.name) > -1) {
                            let res = ''
                            for (var j = 0; j < markPointData.length; j++) {
                                if (markPointData[j].name == params.name) {
                                    //图片地址
                                    let imgUrl = require('../../../assets/images/operation/station-normal-pannel.png')
                                    if (markPointData[j].state === 2) {
                                        imgUrl = require('../../../assets/images/operation/station-maintain-pannel.png')
                                    } else if (markPointData[j].state === 1) {
                                        imgUrl = require('../../../assets/images/operation/station-abnormal-pannel.png')
                                    }
                                    res +=
                                        '<div style="width:305px;height:190px;position: relative">' +
                                        '<img style="width:100%;height:100%;" src=" ' +
                                        imgUrl +
                                        '"/>' +
                                        '<div style="position: absolute; left: 0; top: 0; width: 280px; margin: auto">' +
                                        '<p style="font-size: 16px; color: #00CCFF; font-weight: bold; line-height: 40px; padding-left: 48px; padding-top: 10px">' +
                                        params.name +
                                        '<p/>' +
                                        '<ul style="height: 120px; width:280px; padding-top: 20px; padding-left: 25px">' +
                                        '<li style="display: flex; color: #00CCFF; line-height: 30px"><div style="width: 140px">气温 ' +
                                        markPointData[j].temperature +
                                        '℃</div><div style="width: 140px">湿度 ' +
                                        markPointData[j].humidity +
                                        '%</div></li><li style="display: flex; color: #00CCFF; line-height: 30px"><div style="width: 140px">风速 ' +
                                        markPointData[j].windSpeed +
                                        'm/s</div><div style="width: 140px">风向 ' +
                                        markPointData[j].windDirection +
                                        '</div></li><li style="display: flex; color: #00CCFF; line-height: 30px"><div style="width: 140px">紫外线指数 ' +
                                        markPointData[j].uv +
                                        '</div><div style="width: 140px">气压 ' +
                                        markPointData[j].pressure +
                                        'hpa</div></li></ul>'
                                    '</div>' + '</div>'
                                }
                            }
                            return res
                        }
                    },
                    backgroundColor: 'transparent',
                    borderWidth: '0px',
                    borderRadius: '0px',
                    borderColor: 'transparent',
                    textStyle: {
                        color: 'rgba(94,194,222,1)',
                    },
                },
                series: [
                    {
                        name: '四川省',
                        type: 'map',
                        map: 'sichuan',
                        zoom: 1.5, //缩放比例能控制echart图形在dom中的大小
                        roam: true,
                        emphasis: {
                            label: {
                                show: true,
                            },
                        },
                        label: {
                            normal: {
                                show: false,
                                formatter: (params) => {
                                    console.log(params)
                                },
                            },
                            emphasis: {
                                show: true,
                            },
                        },
                        itemStyle: {
                            areaColor: 'rgba(0, 102, 153, 0.1)',
                            borderColor: '#66ccff',
                            borderWidth: 2,
                            shadowColor: 'rgba(0, 102, 153, 1)', //阴影描边
                            shadowBlur: 10,
                        },
                        markPoint: {
                            symbol: (value, params) => {
                                if (params.data.state === 1) {
                                    return 'image://' + require('../../../assets/images/operation/station-abnormal.png')
                                } else if (params.data.state === 2) {
                                    return 'image://' + require('../../../assets/images/operation/station-maintion.png')
                                } else {
                                    return 'image://' + require('../../../assets/images/operation/station-normal.png')
                                }
                            },
                            symbolSize: [24, 24],
                            label: {
                                normal: {
                                    show: false,
                                },
                                emphasis: {
                                    show: false,
                                },
                            },
                            itemStyle: {
                                normal: {
                                    color: 'red',
                                },
                            },
                            data: markPointData,
                            effect: {
                                show: true,
                                shadowBlur: 0,
                            },
                        },

                        // emphasis: {
                        //     //鼠标移入动态的时候显示的默认样式
                        //     itemStyle: {
                        //         areaColor: '#FFD181',
                        //         borderColor: '#404a59',
                        //         borderWidth: 1,
                        //     },
                        // },
                        // 文本位置修正
                        textFixed: {
                            Alaska: [20, -20],
                        },
                        data: [],
                    },
                ],
            })
            myChart.on('click', function(params) {
                if (params.componentType === 'markPoint') {
                    console.log(params, 'click markPoint')
                }
            })
        },
    },
}
</script>

<style scoped lang="less" scoped>
.gisWrap {
    position: relative;
    .gisBg {
        background-image: url('@/assets/images/operation/gis-bg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
    }
    .tipPannel {
        z-index: 99;
        width: 148px;
        height: 208px;
        background-image: url('@/assets/images/operation/tooltip.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        right: 35px;
        bottom: 35px;
        padding: 24px;
    }
    .normal,
    .abnormal {
        padding-bottom: 8px;
    }
    .tipPannel .num {
        font-size: 18px;
        font-weight: bold;
    }
    .totalWrap {
        position: absolute;
        left: 10%;
        top: 2%;
        font-weight: bold;
    }
    .totalWrap .num {
        position: relative;
        top: -10px;
    }
    .totalNum {
        font-size: 36px;
        color: #ffcc33;
    }
    .mapWrap {
        padding: 20px;
    }
    #map {
        overflow: hidden;
        border-radius: 40px;
    }
}
</style>
