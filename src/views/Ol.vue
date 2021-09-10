<template>
    <div>
        <div id="map-container" class="map"></div>
        <div id="popup" class="ol-popup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content" class="popup-content"></div>
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
import { toStringHDMS } from 'ol/coordinate'
import { transform, toLonLat } from 'ol/proj'
// import { defaults as defaultControls } from 'ol/control'
export default {
    data() {
        return {
            map: null,
            overlay: null,
            wsUrl: '/leshan.json',
            markers: {
                error: require('../assets/images/operation/station-abnormal.png'),
                normal: require('../assets/images/operation/station-normal.png'),
                maintain: require('../assets/images/operation/station-maintion.png'),
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
                // controls: defaultControls({ zoom: false }).extend([]),
                view: new View({
                    projection: 'EPSG:4326', //使用这个坐标系
                    center: [103.816837, 29.406186],
                    zoom: 9,
                    minZoom: 6,
                    maxZoom: 15,
                }),
            })
            this.addMaker()
            this.addPopup()

            this.map.on('pointermove', function(evt) {
                _this.map.getTargetElement().style.cursor = _this.map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : ''
            })
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
            this.map.addLayer(layerPoint)
        },
        addPopup() {
            const _this = this
            const container = document.getElementById('popup'),
                closer = document.getElementById('popup-closer'),
                content = document.getElementById('popup-content')
            this.overlay = new Overlay({
                type: 'waring',
                position: [103.07878876, 29.2444706],
                element: container,
                positioning: 'bottom-center',
            })
            this.map.addOverlay(_this.overlay)
            closer.onclick = function() {
                _this.overlay.setPosition(undefined)
                closer.blur()
                return false
            }
            this.map.on('singleclick', function(evt) {
                const feature = _this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
                    return feature
                })
                if (feature.get('type') == 'maker') {
                    let coordinate = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')
                    // 点击尺 （这里是尺(米)，并不是经纬度）;
                    let hdms = toStringHDMS(toLonLat(evt.coordinate)) // 转换为经纬度显示
                    content.innerHTML = `
                <p>你点击了这里：</p>
                <p>经纬度：<p><code> ${hdms}  </code> <p>
                <p>坐标：</p>X：${coordinate[0]} &nbsp;&nbsp; Y: ${coordinate[1]}`
                    _this.overlay.setPosition(evt.coordinate) //把 overlay 显示到指定的 x,y坐标
                }
            })
        },
    },
}
</script>

<style scoped lang="less">
.map {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    // background-color: #04041b;
    background-image: url('~@/assets/images/operation/bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.ol-popup {
    position: absolute;
    background-color: white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
}
.ol-popup:after,
.ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}
.ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}
.ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}
.ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
}
.popup-content {
    width: 400px;
}
.ol-popup-closer:after {
    content: '✖';
}
</style>
