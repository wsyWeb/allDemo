<template>
    <div>
        <div id="map"></div>
        <a-button @click="changeMap('hbdz')">地图(电子)</a-button>
        <a-button @click="changeMap('hbwx')">影像（卫星）</a-button>
        <a-button @click="changeMap('hbdx')">地形1（地形）</a-button>
        <a-checkbox-group class="ml20 fsb" v-model:value="mapTulidata" @change="onChangeTuli">
            <a-checkbox v-for="(item, index) in mapTuli" :key="item.deviceTypeId" :value="item.deviceTypeId"
                ><img :src="tuli[index]" class="layer-img" alt="" />{{ item.deviceType + '（' + item.devices.length + '）' }}</a-checkbox
            >
        </a-checkbox-group>
    </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View, Feature, Overlay } from 'ol'
import { Tile as LayerTile, Image as LayerImage, Vector as VectorLayer } from 'ol/layer'
import { TileWMS as SourceTile, ImageWMS as SourceImage, Vector as VectorSource } from 'ol/source'
import { Style, Stroke, Fill } from 'ol/style'
import { Point } from 'ol/geom'
import Icon from 'ol/style/Icon'

import { deviceTypeList } from './data'
export default {
    data() {
        return {
            map: null,
            mapLayers: [
                {
                    code: 'hb_shijie',
                    layerType: 'Image',
                    layerUrl: 'http://11.1.1.199:20256/geoserver/hebei/wms?service=WMS',
                    layers: 'hebei:hb_shijie',
                    mapAppId: 1,
                    mapLayerId: 2,
                    name: 'map',
                    parentId: 1,
                    selectType: 2,
                    zIndex: 2,
                },
                {
                    code: 'hbdz',
                    layerType: 'Image',
                    layerUrl: 'http://11.1.1.199:20256/geoserver/hebei/wms?service=WMS',
                    layers: 'hebei:hbdz',
                    mapAppId: 1,
                    mapLayerId: 3,
                    name: 'dz',
                    parentId: 2,
                    selectType: 3,
                    zIndex: 1,
                },
                {
                    code: 'hbwx',
                    layerType: 'Image',
                    layerUrl: 'http://11.1.1.199:20256/geoserver/hebei/wms?service=WMS',
                    layers: 'hebei:hbwx',
                    mapAppId: 1,
                    mapLayerId: 4,
                    name: 'wx',
                    parentId: 3,
                    selectType: 4,
                    zIndex: 1,
                },
                {
                    code: 'hbdx',
                    layerType: 'Image',
                    layerUrl: 'http://11.1.1.199:20256/geoserver/hebei/wms?service=WMS',
                    layers: 'hebei:hbdx',
                    mapAppId: 1,
                    mapLayerId: 5,
                    name: 'dx',
                    parentId: 4,
                    selectType: 5,
                    zIndex: 1,
                },
            ],
            // 图例
            mapTuli: deviceTypeList,
            mapTulidata: [1, 2, 3, 4, 5, 6],
            tuli: [
                require('../../assets/images/ol/tuli1.png'),
                require('../../assets/images/ol/tuli2.png'),
                require('../../assets/images/ol/tuli3.png'),
                require('../../assets/images/ol/tuli4.png'),
                require('../../assets/images/ol/tuli5.png'),
                require('../../assets/images/ol/tuli6.png'),
                require('../../assets/images/ol/tuli7.png'),
            ],
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            this.map = new Map({
                target: 'map',
                logo: false,
                layers: [],
                view: new View({
                    projection: 'EPSG:4326', //使用这个坐标系
                    center: [118.31226, 39.42444],
                    minZoom: 7,
                    maxZoom: 10,
                    zoom: 7.3,
                }),
            })
            //增加图层
            this.mapLayers.forEach((i) => {
                this.addTileLayer(i)
            })

            //隐藏电子，地形，
            let hbdz = this.findLayerByName('hbdz')
            let hbwx = this.findLayerByName('hbwx')
            let hbdx = this.findLayerByName('hbdx')
            this.showLayer(hbdz, false)
            this.showLayer(hbwx, false)
            this.showLayer(hbdx, false)

            //加载站点 1雨滴谱仪 2微波辐射计 3微雨雷达 4激光云高仪 5Ka波段测云仪 6气象雷达
            this.initStation(1, 'lay-raindrop')
            this.initStation(2, 'lay-microwave')
            this.initStation(3, 'lay-smallrain')
            this.initStation(4, 'lay-lasercloud')
            this.initStation(5, 'lay-kaband')
            this.initStation(6, 'lay-weatherradar')
            const map = this.map
            map.on('pointermove', function(e) {
                let pixel = map.getEventPixel(e.originalEvent)
                let feature = map.forEachFeatureAtPixel(
                    pixel,
                    function(feature) {
                        return feature
                    },
                    { hitTolerance: 10 }
                )
                if (feature === undefined) {
                    map.getTargetElement().style.cursor = 'auto'
                } else {
                    map.getTargetElement().style.cursor = 'pointer'
                }
            })
        })
    },
    methods: {
        changeMap(layerName) {
            let hbdz = this.findLayerByName('hbdz')
            let hbwx = this.findLayerByName('hbwx')
            let hbdx = this.findLayerByName('hbdx')
            if (layerName == 'hbdz') {
                this.showLayer(hbdz, true)
                this.showLayer(hbwx, false)
                this.showLayer(hbdx, false)
            } else if (layerName == 'hbwx') {
                this.showLayer(hbdz, false)
                this.showLayer(hbwx, true)
                this.showLayer(hbdx, false)
            } else {
                this.showLayer(hbdz, false)
                this.showLayer(hbwx, false)
                this.showLayer(hbdx, true)
            }
        },
        addTileLayer(params) {
            let that = this
            let layer = null
            if (params.layerType == 'Image') {
                layer = new LayerImage({
                    code: params.code,
                    zIndex: params.zIndex,
                    source: new SourceImage({
                        url: params.layerUrl,
                        params: { layers: params.layers },
                    }),
                })
            } else {
                layer = new LayerTile({
                    code: params.code,
                    zIndex: params.zIndex,
                    source: new SourceTile({
                        url: params.layerUrl,
                        params: { layers: params.layers },
                    }),
                })
            }
            that.map.addLayer(layer)
        },
        findLayerByName(layname) {
            let lays = this.map.getLayers()
            for (var i = 0; i < lays.getLength(); i++) {
                if (lays.item(i).get('code') == layname) {
                    return lays.item(i)
                }
            }
        },
        /**
         * 显示图层控制
         * lay:图层对象
         * visible：true-显示， false-隐藏
         */
        showLayer(lay, visible) {
            lay.setVisible(visible)
        },
        initStation(deviceTypeId, code) {
            const item = this.mapTuli.find((i) => i.deviceTypeId === deviceTypeId)
            console.log(item)
            const features = []
            for (let j in item.devices) {
                const station = item.devices[j]
                const feature = new Feature({
                    geometry: new Point([station['longitude'], station['latitude']]),
                    data: station,
                })

                feature.setStyle(
                    new Style({
                        image: new Icon({
                            anchor: [0.5, 0.5],
                            crossOrigin: 'anonymous',
                            src: this.tuli[deviceTypeId - 1],
                        }),
                    })
                )

                features.push(feature)
            }
            let layerPoint = new VectorLayer({
                type: 'station',
                name: code,
                code: deviceTypeId,
                source: new VectorSource({
                    features,
                }),
                zIndex: 6,
            })
            this.map.addLayer(layerPoint)
        },
        onChangeTuli() {
            const cloneTuliData = [1, 2, 3, 4, 5, 6]
            cloneTuliData.forEach((i) => {
                const lay = this.findLayerByName(i)
                if (this.mapTulidata.includes(i)) {
                    this.showLayer(lay, true)
                } else {
                    this.showLayer(lay, false)
                }
            })
        },
    },
}
</script>

<style scoped lang="less">
#map {
    width: 800px;
    height: 600px;
}
</style>
