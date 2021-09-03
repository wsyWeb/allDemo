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
            <a-row class="top">
                <a-col :span="6" class="top-left heightAll">
                    <div class="title">检修任务统计</div>
                    <SearchDiv class="p-t-md" @changeTime="handleChangeTime"></SearchDiv>
                    <StationChart class="StationChart"></StationChart>
                    <div class="stationTable">
                        <a-table
                            :pagination="false"
                            :columns="columns"
                            :data-source="c_tableData"
                            :bordered="false"
                            :rowKey="rowKey || 'id'"
                            :expandIconColumnIndex="expandIconColumnIndex || 0"
                            :expandedRowKeys="expandedRowKeys || []"
                            :scroll="scroll"
                            @expandedRowsChange="expandedRowsChange"
                        />
                        <!-- <Table :data="c_tableData" :columns="columns" :hasPag="false" /> -->
                    </div>
                </a-col>
                <a-col :span="12" class="top-center heightAll">
                    <!-- <Gis></Gis> -->
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
                <a-row class="faultStatisticsTable">
                    <Table :data="c_tableData" :columns="columns" :hasPag="false" />
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
// import Gis from './cop/Gis'

export default {
    components: {
        Table,
        SearchDiv,
        StationChart,
        PersonChart,
        // Gis,
    },
    data() {
        const columns = [
            {
                title: '站点名',
                dataIndex: 'name',
                customRender: (text) => <div>{text}</div>,
            },
            {
                title: '所属区县',
                dataIndex: 'modelNumber',
                customRender: (text) => <div>{text}</div>,
            },
            {
                title: '维修次数',
                dataIndex: 'num',
                customRender: (text) => <div>{text}</div>,
            },
            {
                title: '管理层级',
                dataIndex: 'purchaseDate',
                customRender: (text) => <div>{text}</div>,
            },
        ]
        return {
            columns,
            c_tableData: [
                {
                    name: '牟子镇',
                    modelNumber: '市中区',
                    num: 108,
                    purchaseDate: '国家站',
                    id: 1,
                },
                {
                    name: '牟子镇',
                    modelNumber: '市中区',
                    num: 108,
                    purchaseDate: '国家站',
                    id: 2,
                },
                {
                    name: '牟子镇',
                    modelNumber: '市中区',
                    num: 108,
                    purchaseDate: '国家站',
                    id: 3,
                },
                {
                    name: '牟子镇',
                    modelNumber: '市中区',
                    num: 108,
                    purchaseDate: '国家站',
                    id: 4,
                },
            ],
        }
    },

    created() {
        // apiGetOverhaulPeopleListStat()
    },
    mounted() {},
    methods: {
        back() {
            this.$router.replace('/home')
        },
        handleChangeTime(v) {
            console.log(v)
        },
    },
}
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
        height: 70%;
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
        height: 30%;
        position: relative;
        .title {
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
    }
    .ant-table {
        color: #99ccff;
    }
    .ant-table-tbody > tr > td {
        border: none;
        text-align: center;
        padding: 8px 0;
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
        border-bottom: 0;
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
