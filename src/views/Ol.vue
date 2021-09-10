<template>
    <div id="map" class="map"></div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Tile'
import VectorSource from 'ol/source/Vector'
// import { defaults as defaultControls } from 'ol/control'
export default {
    data() {
        return {
            map: null,
            wsUrl: 'http://11.1.1.127:9999/globalmap.json',
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
            const source = new VectorSource({
                format: new GeoJSON(),
                url: this.wsUrl,
            })
            // console.log(source)

            const baseLayer = new VectorLayer({
                source: source,
            })
            this.map = new Map({
                target: 'map',
                // layers: [baseLayer],
                // controls: defaultControls({ zoom: false }).extend([]),
                view: new View({
                    projection: 'EPSG:4326', //使用这个坐标系
                    center: [103.816837, 29.406186],
                    zoom: 9,
                    minZoom: 6,
                    maxZoom: 15,
                }),
            })
            this.map.addLayer(baseLayer)
        },
    },
}
</script>

<style scoped lang="less">
.map {
    height: 600px;
    width: 100%;
    border: 1px solid;
    background-color: #04041b;
}
</style>
