<template>
    <div class="gisWrap heightAll widthAll">
        <div class="gisBg heightAll widthAll"></div>
        <div class="totalWrap">
            <div class="font-20">当前累计维修</div>
            <div class="font-20 num">
                <span class="totalNum">{{ gisData.taskSumNum }}</span>
                次
            </div>
        </div>
        <div class="tipPannel">
            <div class="normal list flex">
                <img src="@/assets/images/operation/station-normal.png" style="width:24px; height:24px" alt="" />
                <div class="p-l-xs">
                    <span>正常站点</span>
                    <div class="normalNum num">{{ gisData.normalSiteNum || 0 }}</div>
                </div>
            </div>
            <div class="abnormal list flex">
                <img src="@/assets/images/operation/station-abnormal.png" style="width:24px; height:24px" alt="" />
                <div class="p-l-xs">
                    <span>异常站点</span>
                    <div class="abnormalNum num">{{ gisData.abnormalSiteNum || 0 }}</div>
                </div>
            </div>
            <div class="maintion list flex">
                <img src="@/assets/images/operation/station-maintion.png" style="width:24px; height:24px" alt="" />
                <div class="p-l-xs">
                    <span>维修站点</span>
                    <div class="maintionNum num">{{ gisData.repairSiteNum || 0 }}</div>
                </div>
            </div>
        </div>
        <div class="heightAll widthAll mapWrap">
            <div id="map" class="heightAll" ref="map"></div>
            <!-- 自定义站点显示样式 -->
            <div class="gisTooltip" ref="gisTooltip">
                <div class="stationName">{{ currentPoint.name }}</div>
                <div :class="['stationContent ', currentPoint.state === 3 ? 'error' : '', currentPoint.state === 2 ? 'maintain' : '']">
                    <ul class="heightAll">
                        <li v-for="(value, key) in currentPoint" :key="key" :class="[currentPoint.abnormal === key ? 'error' : '']">
                            <template v-if="icons[key]">
                                <img :src="currentPoint.abnormal === key ? icons[key]['icon-e'] : icons[key].icon" alt="" width="26px" />
                                {{ icons[key].name }} {{ value }}{{ icons[key].company }}
                            </template>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import sichuanJson from './leshan.json'
// import sichuanJson from 'echarts/map/json/province/sichuan.json'

// import 'echarts/map/js/province/sichuan.js'
// import { request } from '@/api/request'

export default {
    data() {
        return {
            icons: {
                temperature: {
                    name: '气温',
                    icon: require('../../../assets/images/operation/normal/qiwen.png'),
                    'icon-e': require('../../../assets/images/operation/error/qiwen.png'),
                    company: '℃',
                }, //温度
                humidity: {
                    name: '湿度',
                    icon: require('../../../assets/images/operation/normal/shidu.png'),
                    'icon-e': require('../../../assets/images/operation/error/shidu.png'),
                    company: '%',
                }, //湿度
                pressure: {
                    name: '气压',
                    icon: require('../../../assets/images/operation/normal/qiya.png'),
                    'icon-e': require('../../../assets/images/operation/error/qiya.png'),
                    company: 'hpa',
                }, //湿度
                windSpeed: {
                    name: '风速',
                    icon: require('../../../assets/images/operation/normal/fengsu.png'),
                    'icon-e': require('../../../assets/images/operation/error/fengsu.png'),
                    company: 'm/s',
                }, //风速
                windDirection: {
                    name: '风向',
                    icon: require('../../../assets/images/operation/normal/fengxiang.png'),
                    'icon-e': require('../../../assets/images/operation/error/fengxiang.png'),
                }, //风向
                uv: {
                    name: '紫外线指数',
                    icon: require('../../../assets/images/operation/normal/uv.png'),
                    'icon-e': require('../../../assets/images/operation/error/uv.png'),
                }, //紫外线
                chaoxi: {
                    name: '潮汐',
                    icon: require('../../../assets/images/operation/normal/chaoxi.png'),
                    'icon-e': require('../../../assets/images/operation/error/chaoxi.png'),
                }, //潮汐
                dianya: {
                    name: '电压',
                    icon: require('../../../assets/images/operation/normal/dianya.png'),
                    'icon-e': require('../../../assets/images/operation/error/dianya.png'),
                }, //电压
                fengxiangfengshu: {
                    name: '风向风速',
                    icon: require('../../../assets/images/operation/normal/fengxiangfengsu.png'),
                    'icon-e': require('../../../assets/images/operation/error/fengxiangfengsu.png'),
                }, //风向风速
                jiangyu: {
                    name: '降雨',
                    icon: require('../../../assets/images/operation/normal/jiangyu.png'),
                    'icon-e': require('../../../assets/images/operation/error/jiangyu.png'),
                }, //降雨
                langgao: {
                    name: '浪高',
                    icon: require('../../../assets/images/operation/normal/langgao.png'),
                    'icon-e': require('../../../assets/images/operation/error/langgao.png'),
                }, //浪高
                monifengxiang: {
                    name: '模拟风向',
                    icon: require('../../../assets/images/operation/normal/monifengxiang.png'),
                    'icon-e': require('../../../assets/images/operation/error/monifengxiang.png'),
                }, //模拟风向
                rongyangdu: {
                    name: '溶氧度',
                    icon: require('../../../assets/images/operation/normal/rongyangdu.png'),
                    'icon-e': require('../../../assets/images/operation/error/rongyangdu.png'),
                }, //溶氧度
                taiyangfushe: {
                    name: '太阳辐射',
                    icon: require('../../../assets/images/operation/normal/taiyangfushe.png'),
                    'icon-e': require('../../../assets/images/operation/error/taiyangfushe.png'),
                }, //太阳辐射
                turangshidu: {
                    name: '',
                    icon: require('../../../assets/images/operation/normal/turangshidu.png'),
                    'icon-e': require('../../../assets/images/operation/error/turangshidu.png'),
                }, //土壤湿度
                zhengfa: {
                    name: '蒸发量',
                    icon: require('../../../assets/images/operation/normal/zhengfa.png'),
                    'icon-e': require('../../../assets/images/operation/error/zhengfa.png'),
                }, //蒸发量
            },
            currentPoint: {},
            gisData: {
                listSiteStatVo: [],
            },
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            this.init()

            let dom = document.querySelector('#operationGuaranteeManage')
            dom.addEventListener('click', () => {
                this.$refs.gisTooltip.style.display = 'none'
            })
        })
    },
    methods: {
        init() {
            let markPointData = []

            markPointData = [
                {
                    name: '市中区', //站点名称
                    coord: [103.07878876, 29.2444706], // 经纬度
                    state: 0, //0正常站点  1异常站点 2维修站点
                    temperature: '37', //温度
                    humidity: 50, //湿度
                    pressure: 1000, // 气压i
                    windSpeed: 245, // 风速
                    windDirection: '东南风', // 风向
                    uv: 1, //紫外线指数
                    zhengfa: 100,
                    jiangyu: 300,
                },
                {
                    name: '沙湾区',
                    coord: [103.587445, 29.343332],
                    state: 1,
                    temperature: 25.3, //温度
                    humidity: 50, //湿度
                    pressure: 1000, // 气压i
                    windSpeed: 45, // 风速
                    windDirection: '西北风', // 风向
                    uv: 1, //紫外线指数
                    abnormal: 'humidity', //异常点
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
            const _this = this
            const myChart = echarts.init(this.$refs.map)
            echarts.registerMap('sichuan', sichuanJson, {})
            myChart.setOption({
                // tooltip: {
                //     trigger: 'item',
                //     formatter: function(params) {
                //         if (JSON.stringify(markPointData).indexOf(params.name) > -1) {
                //             let res = ''
                //             for (var j = 0; j < markPointData.length; j++) {
                //                 if (markPointData[j].name == params.name) {
                //                     //图片地址
                //                     let imgUrl = require('../../../assets/images/operation/station-normal-pannel.png')
                //                     if (markPointData[j].state === 2) {
                //                         imgUrl = require('../../../assets/images/operation/station-maintain-pannel.png')
                //                     } else if (markPointData[j].state === 1) {
                //                         imgUrl = require('../../../assets/images/operation/station-abnormal-pannel.png')
                //                     }
                //                     res +=
                //                         '<div style="width:305px;height:190px;position: relative">' +
                //                         '<img style="width:100%;height:100%;" src=" ' +
                //                         imgUrl +
                //                         '"/>' +
                //                         '<div style="position: absolute; left: 0; top: 0; width: 280px; margin: auto">' +
                //                         '<p style="font-size: 16px; color: #00CCFF; font-weight: bold; line-height: 40px; padding-left: 48px; padding-top: 10px">' +
                //                         params.name +
                //                         '<p/><div style="height: 120px; width:280px; overflow: hidden">' +
                //                         '<ul style="height: 100%; width:100%; padding-top: 20px; padding-left: 25px; overflow-y: scorll ">' +
                //                         '<li style="display: flex; color: #00CCFF; line-height: 30px"><div style="width: 140px">气温 ' +
                //                         markPointData[j].temperature +
                //                         '℃</div><div style="width: 140px">湿度 ' +
                //                         markPointData[j].humidity +
                //                         '%</div></li><li style="display: flex; color: #00CCFF; line-height: 30px"><div style="width: 140px">风速 ' +
                //                         markPointData[j].windSpeed +
                //                         'm/s</div><div style="width: 140px">风向 ' +
                //                         markPointData[j].windDirection +
                //                         '</div></li><li style="display: flex; color: #00CCFF; line-height: 30px"><div style="width: 140px">紫外线指数 ' +
                //                         markPointData[j].uv +
                //                         '</div><div style="width: 140px">气压 ' +
                //                         markPointData[j].pressure +
                //                         'hpa</div></li></ul></div>'
                //                     '</div>' + '</div>'
                //                 }
                //             }
                //             return res
                //         }
                //     },
                //     backgroundColor: 'transparent',
                //     borderWidth: '0px',
                //     borderRadius: '0px',
                //     borderColor: 'transparent',
                //     textStyle: {
                //         color: 'rgba(94,194,222,1)',
                //     },
                // },
                series: [
                    {
                        name: '四川省',
                        type: 'map',
                        map: 'sichuan',
                        zoom: 1, //缩放比例能控制echart图形在dom中的大小
                        roam: true,
                        layoutCenter: ['50%', '50%'],
                        emphasis: {
                            label: {
                                show: true,
                            },
                        },
                        label: {
                            normal: {
                                show: false,
                                // formatter: (params) => {
                                //     console.log(params)
                                // },
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
                console.log(params, 'clikc')
                if (params.componentType === 'markPoint') {
                    params.event.event.stopPropagation()
                    _this.currentPoint = params.data
                    let imgUrl = require('../../../assets/images/operation/station-normal-pannel.png')
                    if (params.data.state === 2) {
                        imgUrl = require('../../../assets/images/operation/station-maintain-pannel.png')
                    } else if (params.data.state === 1) {
                        imgUrl = require('../../../assets/images/operation/station-abnormal-pannel.png')
                    }
                    const x = params.event.offsetX,
                        y = params.event.offsetY,
                        elem = _this.$refs.gisTooltip
                    elem.style['background-image'] = ` url(${imgUrl})`
                    elem.style.left = x + 70 + 'px'
                    elem.style.top = y + 'px'
                    elem.style.display = 'block'
                }
            })
            // myChart.on('mouseout', function(params) {
            //     const surx = params.event.offsetX,
            //         curY = params.event.offsetY
            // })
            // myChart.on('globalout', (params) => {
            //     let mouseEvent = document.createEvent('MouseEvents')
            //     mouseEvent.initEvent('mouseup', true, true)
            //     console.log(params)
            //     _this.$refs.map.getElementsByTagName('canvas')[0].dispatchEvent(mouseEvent)
            // })
        },
    },
}
</script>

<style scoped lang="less">
.gisWrap {
    position: relative;
    .gisBg {
        background-image: url('~@/assets/images/operation/gis-bg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
    }
    .tipPannel {
        z-index: 99;
        width: 148px;
        height: 208px;
        background-image: url('~@/assets/images/operation/tooltip.png');
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
    .gisTooltip {
        position: absolute;
        height: 190px;
        width: 305px;
        z-index: 99;
        display: none;
        color: #00ccff;
        .stationName {
            line-height: 60px;
            padding-left: 50px;
            font-size: 16px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 220px;
            white-space: nowrap;
        }
        .stationContent {
            height: 100px;
            position: absolute;
            top: 70px;
            overflow: hidden;
            padding: 0 28px;
            ul {
                overflow-y: scroll;
            }
            li {
                float: left;
                width: 50%;
                line-height: 32px;
            }
            .error {
                color: red;
            }
        }
    }
}
</style>
