<template>
    <div id="operationGuaranteeManage">
        <a-row class="header widthAll">
            <div class="back flex" @click="back">
                <img src="@/assets/images/operation/back.png" style="width: 45px;height:40px" alt="" />
                <strong>返回首页</strong>
            </div>
            气象装备运行监管保障中心
        </a-row>
        <div class="content widthAll heightAll">
            <a-row class="top" style="height:calc(100% - 276px)">
                <a-col :span="6" class="top-left heightAll">
                    <div class="title">检修任务统计</div>
                    <SearchDiv class="p-t-md" @changeTime="handleChangeTime"></SearchDiv>
                    <StationChart class="StationChart"></StationChart>
                    <div class="stationTable">
                        <Table :data="c_tableData" :columns="columns" :hasPag="false" />
                    </div>
                </a-col>
                <a-col :span="12" class="top-center heightAll">
                    <GisDemo></GisDemo>
                </a-col>
                <a-col :span="6" class="heightAll">
                    <div class="title">
                        <div class="label">检修人员统计</div>
                        <div class="border"></div>
                    </div>
                    <PersonChart class="heightAll widthAll"></PersonChart>
                </a-col>
            </a-row>
            <div class="bottom">
                <div class="bottomSplitLine widthAll"></div>
                <div class="title">
                    <span class="label">站点检修故障统计</span>
                    <SearchDiv @changeTime="handleChangeTime"></SearchDiv>
                </div>
                <a-row class="faultStatisticsTable" style="height: calc(100% - 60px);">
                    <ul class=" stationName widthAll">
                        <li class="fixed-width">站点名</li>
                        <li style="width: calc(100% - 180px);">
                            <ul class="flex-around widthAll">
                                <li class="widthAll text-center" v-for="(item, idx) in stationNames" :key="idx">{{ item }}</li>
                            </ul>
                        </li>
                    </ul>
                    <ul v-if="formatList.length > 0" class="stationContent widthAll" style="height: calc(100% - 30px);">
                        <li class="fixed-width setBg">
                            <ul>
                                <li v-for="(item, idx) in formatList" :key="idx">{{ item.name }}</li>
                            </ul>
                        </li>
                        <li style="width: calc(100% - 180px);" class="linear-gradient">
                            <template v-for="(typeItem, typeIdx) in formatList" :key="typeIdx">
                                <ul class="flex-around widthAll">
                                    <li class="widthAll text-center" v-for="(list, listIdx) in typeItem.data" :key="listIdx">{{ list }}</li>
                                </ul>
                            </template>
                        </li>
                    </ul>
                    <!-- <Table :data="c_stationFaulttableData" :columns="stationFaultColumns" :hasPag="false" /> -->
                </a-row>
            </div>
        </div>
    </div>
</template>

<script>
import Table from 'components/table'
import SearchDiv from './cop/SearchDiv'
import StationChart from './cop/StationChart'
import PersonChart from './cop/PersonChart'
import GisDemo from './cop/GisDemo'
import { defineComponent } from 'vue'

export default defineComponent({
    components: {
        Table,
        SearchDiv,
        StationChart,
        PersonChart,
        GisDemo,
    },
    setup() {
        const columns = [
            {
                title: '站点名',
                dataIndex: 'name',
                // customRender: (text) => <div>{text}</div>,
            },
            {
                title: '所属区县',
                dataIndex: 'modelNumber',
                // customRender: (text) => <div>{text}</div>,
            },
            {
                title: '维修次数',
                dataIndex: 'num',
                // customRender: (text) => <div>{text}</div>,
            },
            {
                title: '管理层级',
                dataIndex: 'purchaseDate',
                // customRender: (text) => <div>{text}</div>,
            },
        ]
        return {
            columns,
            c_tableData: [
                {
                    name: '牟子镇1',
                    modelNumber: '市中区',
                    num: 108,
                    purchaseDate: '国家站',
                    key: 1,
                },
                {
                    name: '牟子镇2',
                    modelNumber: '市中区',
                    num: 108,
                    purchaseDate: '国家站',
                    id: 2,
                },
                {
                    name: '牟子镇3',
                    modelNumber: '市中区',
                    num: 108,
                    purchaseDate: '国家站',
                    id: 3,
                },
                {
                    name: '牟子镇4',
                    modelNumber: '市中区',
                    num: 108,
                    purchaseDate: '国家站',
                    id: 4,
                },
            ],
        }
    },
    data() {
        return {
            c_stationFaulttableData: [
                {
                    name: '牟子镇',
                    wendu: 32,
                    shidu: 108,
                    yuliang: 200,
                    id: 1,
                    qiya: 300,
                    fengxiang: 800,
                    fengsu: 20,
                },
                {
                    name: '市中区',
                    wendu: 0,
                    shidu: 0,
                    yuliang: 0,
                    id: 2,
                    qiya: 0,
                    fengxiang: 0,
                    fengsu: 3,
                },
                {
                    name: '沙湾区',
                    wendu: 1,
                    shidu: 45,
                    yuliang: 78,
                    id: 3,
                    qiya: 1,
                    fengxiang: 800,
                    fengsu: 20,
                },
                {
                    name: '苏稽镇',
                    wendu: 8,
                    shidu: 8,
                    yuliang: 8,
                    id: 3,
                    qiya: 8,
                    fengxiang: 8,
                    fengsu: 8,
                },
                {
                    name: '沐川县',
                    wendu: 9,
                    shidu: 9,
                    yuliang: 9,
                    id: 3,
                    qiya: 9,
                    fengxiang: 9,
                    fengsu: 20,
                },
                {
                    name: '平兴乡',
                    wendu: 5,
                    shidu: 5,
                    yuliang: 5,
                    id: 1,
                    qiya: 5,
                    fengxiang: 5,
                    fengsu: 5,
                },
            ],
            formatTypeObj: {
                wendu: '温度',
                shidu: '湿度',
                yuliang: '雨量',
                qiya: '气压',
                fengxiang: '风向',
                fengsu: '风速',
            },
        }
    },
    computed: {
        stationNames() {
            return this.c_stationFaulttableData.map((i) => {
                return i.name
            })
        },
        formatList() {
            let arr = [],
                objItem = {}
            const _this = this
            if (this.c_stationFaulttableData.length > 0) {
                objItem = this.c_stationFaulttableData[0]
            }
            Object.keys(objItem).forEach((key) => {
                if (_this.formatTypeObj[key]) {
                    arr.push({ name: _this.formatTypeObj[key], key: key, data: [] })
                }
            })
            for (let i in arr) {
                for (let j in _this.c_stationFaulttableData) {
                    const data = _this.c_stationFaulttableData[j]
                    arr[i].data.push(data[arr[i].key])
                }
            }
            return arr
        },
    },
    created() {},
    mounted() {},
    methods: {
        back() {
            this.$router.replace('/home')
        },
        handleChangeTime(v) {
            console.log(v)
        },
    },
})
</script>

<style lang="less">
.heightAll {
    height: 100%;
}
.widthAll {
    width: 100%;
}
.bg-setting {
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.content {
    color: #66ccff;
}
#operationGuaranteeManage {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 99;
    background-image: url('~@/assets/images/operation/bg.png');
    &:extend(.bg-setting);
    min-height: 700px;
    min-width: 1200px;
    font-family: 'PangMenZhengDao', '微软雅黑';
    .content {
        padding: 100px 20px 20px 20px;
    }
    .header {
        height: 100px;
        background-image: url('~@/assets/images/operation/title.png');
        &:extend(.bg-setting);
        text-align: center;
        font-size: 36px;
        font-weight: 400;
        padding-top: 7px;
        font-family: 'PangMenZhengDao';
        letter-spacing: 10px;
        position: absolute;
        top: 0;
        color: #66ccff;
        display: block;
        .back {
            position: absolute;
            top: 30px;
            left: 20px;
            cursor: pointer;
            z-index: 99;
            strong {
                letter-spacing: normal;
                display: inline-block;
                width: 40px;
                position: relative;
                font-size: 14px;
                font-weight: bold;
            }
        }
    }
    .top {
        min-height: 500px;
        padding: 0px 0 10px 0;
        .title {
            text-align: center;
            background-image: url('~@/assets/images/operation/title-top.png');
            &:extend(.bg-setting);
            position: absolute;
            top: -50px;
            width: 100%;
            line-height: 60px;
        }
    }
    .top-center {
        padding-top: 13px;
    }
    .bottom {
        height: 276px;
        position: relative;
        .title {
            height: 60px;
            background-image: url('~@/assets/images/operation/title-bottom.png');
            &:extend(.bg-setting);
            margin-left: -10px;
            .label {
                position: absolute;
                top: 21px;
                left: 1.5%;
            }
        }
        .search-condition {
            position: absolute;
            right: 0;
            bottom: 13px;
        }
    }
    .bottomSplitLine {
        height: 28px;
        background-image: url('~@/assets/images/operation/split.png');
        &:extend(.bg-setting);
        position: absolute;
        top: -15px;
    }
    // 标题样式设置
    .title {
        height: 60px;
        letter-spacing: 4px;
        font-weight: bold;
        position: relative;
    }
    .StationChart {
        height: 45%;
    }
    .stationTable {
        height: 40%;
    }
    .faultStatisticsTable {
        margin-top: -8px;
        .stationName {
            height: 30px;
            background: #050e25;
            box-shadow: inset 0 0 5px 1px #66ccff;
            margin-top: 8px;
        }
        .fixed-width {
            width: 180px;
            text-align: center;
        }
        .stationContent > li,
        .stationName > li {
            float: left;
            line-height: 30px;
        }
        .stationContent {
            // overflow-y: scroll;
            .linear-gradient > ul:nth-child(2n) {
                background: -webkit-linear-gradient(left, #0e1d44, #253d7a, #0e1d44);
                /* Safari 5.1 - 6.0 */
                background: -o-linear-gradient(right, #0e1d44, #253d7a, #0e1d44);
                /* Opera 11.1 - 12.0 */
                background: -moz-linear-gradient(right, #0e1d44, #253d7a, #0e1d44);
                /* Firefox 3.6 - 15 */
                background: linear-gradient(to right, #0e1d44, #253d7a, #0e1d44);
            }
        }
        .stationContent .setBg {
            background-color: #050e25;
            box-shadow: 0px 4px 5px 0px rgba(0, 204, 255, 0.3);
        }
        .ant-table-thead > tr > th:first-child {
            width: 180px;
        }
        .ant-table-tbody > tr > td:first-child div {
            color: #99ccff;
            background-color: #050e25;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            padding: 8px 0;
        }
        .ant-table-thead > tr {
            background: #050e25 !important;
        }
    }
    .ant-table {
        color: #99ccff;
        background: transparent;
    }
    .ant-table-tbody > tr > td {
        border: none;
        text-align: center;
        padding: 8px 0;
        position: relative;
    }
    .ant-table-tbody tr:hover > td {
        background-color: transparent !important;
    }
    .ant-table-thead > tr {
        background: #081536 !important;
        box-shadow: inset 0 0 5px 1px #66ccff;
    }
    .ant-table-thead > tr > th {
        color: #66ccff;
        height: 30px;
        background: transparent !important;
        padding: 0;
        line-height: 30px;
        text-align: center;
        border-bottom: 0;
        text-align: center;
    }
}
@media screen and (max-width: 1200px) {
    #operationGuaranteeManage {
        .header,
        .title {
            letter-spacing: 0;
        }
    }
}
</style>
