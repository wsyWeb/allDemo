<template>
    <div>
        <div id="Map" ref="map" />
    </div>
</template>
<script>
import 'ol/ol.css'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import OSM from 'ol/source/OSM'
import GeoJSON from 'ol/format/GeoJSON'
import { Map, View, Feature } from 'ol'
import { Style, Icon, Fill, Text, Stroke } from 'ol/style'
import { Point, Polygon, MultiPolygon } from 'ol/geom'
import { defaults as defaultControls } from 'ol/control'
import { fromLonLat, transform } from 'ol/proj'
import areaGeo from 'components/openlayers/geoJSON/leshan.json'
// 边界json数据
export default {
    data() {
        return {
            map: null,
            pointLayer: null,
        }
    },
    mounted() {
        this.initMap()
        this.addArea()
        // this.addArea1(areaGeo)
    },
    methods: {
        /**
         * 初始化地图
         */
        initMap() {
            this.map = new Map({
                controls: defaultControls().extend([]),
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                target: 'Map',
                view: new View({
                    projection: 'EPSG:4326',
                    center: [103.816837, 29.406186],
                    zoom: 9,
                }),
            })
        },
        addArea() {
            const _this = this
            const styles = new Style({
                //设置样式
                fill: new Fill({
                    color: '#4e98f444',
                }),
                stroke: new Stroke({
                    width: 3,
                    color: [71, 137, 227, 1],
                }),
            })
            const source = new VectorSource({
                format: new GeoJSON(),
                url: '/leshan.json',
            })
            const baseLayer = new VectorLayer({
                source: source,
                style: styles,
                zIndex: 1,
            })
            this.map.addLayer(baseLayer)
        },
        addArea1(geo = []) {
            if (geo.length == 0) return false
            let areaFeature = null
            // 设置图层
            this.areaLayer = new VectorLayer({
                source: new VectorSource({
                    features: [],
                }),
            })

            // 添加图层
            this.map.addLayer(this.areaLayer)
            geo.forEach((g) => {
                let lineData = g.features[0]
                if (lineData.geometry.type == 'MultiPolygon') {
                    areaFeature = new Feature({
                        geometry: new MultiPolygon(lineData.geometry.coordinates).transform('EPSG:4326', 'EPSG:3857'),
                    })
                } else if (lineData.geometry.type == 'Polygon') {
                    areaFeature = new Feature({
                        geometry: new Polygon(lineData.geometry.coordinates).transform('EPSG:4326', 'EPSG:3857'),
                    })
                }
            })
            areaFeature.setStyle(
                new Style({
                    fill: new Fill({ color: '#4e98f444' }),
                    stroke: new Stroke({
                        width: 3,
                        color: [71, 137, 227, 1],
                    }),
                })
            )
            this.areaLayer.getSource().addFeatures([areaFeature])
        },
    },
}
</script>
<style lang="less" scoped>
#Map {
    width: 800px;
    height: 600px;
    border: 1px solid;
}
// 此处非核心内容，已删除
</style>
