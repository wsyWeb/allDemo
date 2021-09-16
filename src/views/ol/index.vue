<template>
    <div>
        <div id="map-container" class="map"></div>

        <div>
            <input type="checkbox" id="jack" value="Jack" v-model="checkedmaker" />
        </div>
        <div id="popup" :class="['gisTooltip', currentPoint.state === 1 ? 'error' : '', currentPoint.state === 0 ? 'maintain' : '']" ref="gisTooltip">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
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
</template>

<script>
import 'ol/ol.css'
import { Map, View, Feature, Overlay } from 'ol'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style, Stroke, Fill } from 'ol/style'
import { Point } from 'ol/geom'
import Icon from 'ol/style/Icon'
import { toStringHDMS } from 'ol/coordinate' //转换为经纬度显示
// import { transform, toLonLat } from 'ol/proj'
import { ScaleLine, FullScreen, defaults as defaultControls } from 'ol/control'
import icons from '../echart/cop/icons'
export default {
    data() {
        return {
            icons: icons,
            checkedmaker: true,
            map: null,
            layerPoint: null,
            overlay: null,
            wsUrl: '/leshan.json',
            markers: {
                error: require('../../assets/images/operation/error.png'),
                normal: require('../../assets/images/operation/normal.png'),
                maintain: require('../../assets/images/operation/warn.png'),
            },
            markPointData: [
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
            ],
            currentPoint: {},
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            this.initMap()
        })
    },
    methods: {
        initMap() {
            const _this = this
            const styles = new Style({
                //设置样式
                stroke: new Stroke({
                    color: 'rgba(0, 102, 153, 1)',
                    // box-shodow: rgba(0, 102, 153, 1),
                    // color: "rgba(30,144,255)",
                    width: 2,
                }),
                fill: new Fill({
                    color: 'rgba(0, 102, 153, 0.1)',
                }),
            })
            const source = new VectorSource({
                format: new GeoJSON(),
                url: this.wsUrl,
            })
            const baseLayer = new VectorLayer({
                source: source,
                style: styles,
                zIndex: 1,
            })
            this.map = new Map({
                target: 'map-container',
                layers: [baseLayer],
                logo: false,
                controls: defaultControls({ zoom: false }).extend([]),
                view: new View({
                    projection: 'EPSG:4326', //使用这个坐标系
                    center: [103.816837, 29.406186],
                    zoom: 9,
                    minZoom: 6,
                    maxZoom: 15,
                }),
            })
            this.addMaker() //绘制标记点
            this.addPopup() // 绘制覆盖物
            this.addControl() //增加控件
            this.setMapEvent()

            // this.map.addLayer(baseLayer)
        },
        addMaker() {
            const features = []
            for (let i in this.markPointData) {
                const station = this.markPointData[i]
                let feature = new Feature({
                    geometry: new Point([station.coord[0], station.coord[1]]),
                    type: 'maker',
                    data: station,
                })

                feature.setStyle(
                    new Style({
                        image: new Icon({
                            // anchor: [0.5, 0.5],
                            scale: 0.6,
                            crossOrigin: 'anonymous',
                            src: station.state === 1 ? this.markers.error : station.state === 2 ? this.markers.normal : this.markers.maintain,
                        }),
                    })
                )
                features.push(feature)
            }

            const source = new VectorSource({
                features,
            })
            const layerPoint = new VectorLayer({
                type: 'station',
                name: 'lay-raindrop',
                code: 'lay-raindrop',
                source: source,
                zIndex: 2,
            })
            this.layerPoint = layerPoint
            this.map.addLayer(layerPoint)
        },
        addPopup() {
            const _this = this
            const container = document.getElementById('popup'),
                closer = document.getElementById('popup-closer')
            this.overlay = new Overlay({
                type: 'popup',
                element: container,
                // position: [103.07878876, 29.2444706],
                // positioning: 'bottom-right',
                offset: [20, -30],
                autoPan: false, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
                autoPanAnimation: {
                    duration: 250, //自动平移效果的动画时间 9毫秒）
                },
            })
            this.map.addOverlay(_this.overlay)
            closer.onclick = function() {
                _this.overlay.setPosition(undefined)
                closer.blur()
                return false
            }
        },
        addControl() {
            //比例尺
            const scaleControl = new ScaleLine({
                units: 'metric',
            })
            //全屏
            const fullScreen = new FullScreen({
                className: 'ol-controls-fullscreen',
            })
            this.map.addControl(scaleControl)
            this.map.addControl(fullScreen)
        },
        setMapEvent() {
            const _this = this
            this.map.on('singleclick', function(evt) {
                const feature = _this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
                    return feature
                })
                if (feature.get('type') == 'maker') {
                    _this.currentPoint = feature.get('data')
                    //     let coordinate = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')
                    //     // 点击尺 （这里是尺(米)，并不是经纬度）;
                    //     let hdms = toStringHDMS(toLonLat(evt.coordinate)) // 转换为经纬度显示
                    // content.innerHTML = `
                    // <p>你点击了这里：</p>
                    // <p>经纬度：<p><code> ${JSON.stringify(this.currentPoint)}  </code> <p>`
                    _this.overlay.setPosition(evt.coordinate) //把 overlay 显示到指定的 x,y坐标
                }
            })
            //鼠标移入显示手形
            this.map.on('pointermove', function(evt) {
                _this.map.getTargetElement().style.cursor = _this.map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : 'auto'
            })
        },
    },
    watch: {
        checkedmaker(v) {
            // if (!v) {
            //     this.map.removeLayer(this.layerPoint)
            // } else {
            //     this.addMaker()
            // }
            this.layerPoint.setVisible(v) //是否显示标记物
        },
    },
}
</script>

<style scoped lang="less">
.map {
    // position: absolute;
    // left: 0;
    // right: 0;
    // top: 0;
    // bottom: 0;
    width: 800px;
    height: 600px;
    background-image: url('~@/assets/images/operation/bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.heightAll {
    height: 100%;
}
.widthAll {
    width: 100%;
}
.ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #fff;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    text-align: center;
}
.ol-popup-closer:after {
    content: '✖';
}
.gisTooltip {
    position: absolute;
    height: 190px;
    width: 305px;
    color: #00ccff;
    background-image: url('~@/assets/images/operation/station-normal-pannel.png');
    &.error {
        background-image: url('~@/assets/images/operation/station-abnormal-pannel.png');
    }
    &.maintain {
        background-image: url('~@/assets/images/operation/station-maintain-pannel.png');
    }
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
        width: 305px;
        ul {
            overflow-y: scroll;
            width: 300px;
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
</style>
