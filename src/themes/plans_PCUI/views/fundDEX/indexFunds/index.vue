<template>
    <router-view />
    <div class='IndexFunds'>
        <div class='fund-list'>
            <div class='headerTitle'>
                <div class='left'>
                    <div class='titleTxt'>
                        Index Funds
                    </div>
                    <div class='titleSubTxt'>
                        Easy access to crypto investment themes.
                    </div>
                </div>
                <div class='right'>
                    <el-select v-model='linkType' class='linkSelect' placeholder='请选择' @change='changeLinkType'>
                        <template #prefix>
                            <span class='smallIco'>
                                <img v-if='linkType === "Ethereum"' alt='#' class='icon' src='/images/markets/ethereum.svg' />
                                <img v-if='linkType === "Polygon"' alt='#' class='icon' src='/images/markets/polygon.svg' />
                                <van-icon v-if='linkType === "All"' class='icon-all' name='apps-o' />
                            </span>
                        </template>
                        <el-option
                            v-for='item in linkTypeOptions'
                            :key='item.value'
                            :index='item.index'
                            :label='item.label'
                            :value='item.value'
                        >
                            <img v-if='item.iconSrc !==""' alt='#' class='dropicon' :src='item.iconSrc' />
                            <van-icon v-if='item.value === "All"' class='icon-all' name='apps-o' />
                            <span>{{ item.label }}</span>
                        </el-option>
                    </el-select>
                </div>
            </div>

            <el-skeleton v-if='loading' animated class='skeleton-wrap'>
                <template #template>
                    <div v-for='item in 5' :key='item' class='skeleton-fild'>
                        <el-skeleton-item class='filed1' variant='circle' />
                        <el-skeleton-item class='filed2' variant='text' />
                        <el-skeleton-item class='filed3' variant='text' />
                        <el-skeleton-item class='filed4' variant='text' />
                        <el-skeleton-item class='filed5' variant='button' />
                        <el-skeleton-item class='filed5' variant='button' />
                    </div>
                </template>
            </el-skeleton>

            <el-table
                v-show='!loading'
                class='fundsTable'
                :data='tableData'
                :default-sort="{ prop: 'nav', order: 'descending' }"
                empty-text='No data'
            >
                <el-table-column label='Fund name' min-width='220' prop='Name' :sort-method='sortByName' sortable>
                    <template #default='scope' class='pro-link'>
                        <div class='proCell alink' @click='handleDetail(scope.row)'>
                            <img alt='' class='currencyIcon' :src='scope.row.image' />
                            <img alt='' class='currencyIcon small' :src='scope.row.iconOrigin' />
                        </div>
                        <div class='pro-name alink' @click='handleDetail(scope.row)'>
                            <b class='black'>
                                {{ scope.row.symbol }}
                            </b>
                            <span class='smallTxt'>
                                {{ scope.row.marketLinkType }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label='NAV' prop='nav' :sort-method='sortByNum' :sortable='true' width='130'>
                    <template #default='scope'>
                        <span class='black'>
                            ${{ scope.row.nav }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label='1D' prop='_1D' :sort-method='sortByDay' sortable>
                    <template #default='scope'>
                        <span :class="[Number(scope.row._1D)>0?'txtGreen':'txtRed' ]">
                            {{ scope.row._1D }} %
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label='1W' prop='_1W' :sort-method='sortByWeek' sortable>
                    <template #default='scope'>
                        <span :class="[Number(scope.row._1W)>0?'txtGreen':'txtRed' ]">
                            {{ scope.row._1W }} %
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label='1M' prop='_1M' :sort-method='sortByMonth' sortable>
                    <template #default='scope'>
                        <span :class="[Number(scope.row._1M)>0?'txtGreen':'txtRed' ]">
                            {{ scope.row._1M }} %
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label='3M' prop='_3M' :sort-method='sortBy3Month' sortable>
                    <template #default='scope'>
                        <span :class="[Number(scope.row._3M)>0?'txtGreen':'txtRed' ]">
                            {{ scope.row._3M }} %
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align='right' label='' prop='operta' width='220'>
                    <template #default='scope'>
                        <div class='handle'>
                            <el-tooltip
                                effect='dark'
                                placement='top'
                            >
                                <template #content>
                                    <p>Coming Soon</p>
                                </template>
                                <button>
                                    Purchase
                                </button>
                            </el-tooltip>
                            <button class='easy' @click='handleDetail(scope.row)'>
                                Details
                            </button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <CoopDialog
            :data='tableData'
            :show='dialogShow'
            @update:show='dialogShowClose'
        />
    </div>
</template>

<script>
import { computed, onUnmounted, ref, defineProps, unref, toRefs, reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import CoopDialog from '../components/coop-dialog.vue'
import { getMarketList, getMarketChart_coingecko } from '@/api/fundDEX.js'
import { productTokensBySymbol, productTokensBySymbolList, indexCoopFavLogo } from '../config/config-indexCoop.js'
import { getArrayObj, priceFormat, isEmpty, localGet, sessionSet } from '@/utils/util'
import { retainDecimal, plus, divide, minus, toFixed } from '@/utils/calculation'
import dayjs from 'dayjs'

import { web3Hooks } from '@/plugins/web3/index'

export default {
    components: {
        CoopDialog
    },
    props: {},
    setup (props, context) {
        const store = useStore()
        const { executeConnect } = web3Hooks()
        const state = reactive({
            loading: false,
            dialogShow: false,
            vs_currency: 'usd',
            price_change_percentage: '24h,7d,30d,90d',
            netlink: 'polygon-pos', // 网络 net link
            tableData: [],
            tableDataEmpty: [],
            tempData: [],
            console: '',
            showPopover: false,
            // mainnet token url
            tokenUrl_mainnet: [

            ],

            // polygon token url
            tokenUrl_polygon: [

            ],
            linkTypeOptions: [
                {
                    value: 'All',
                    label: 'All Markets',
                    iconSrc: ''
                },
                {
                    value: 'Ethereum',
                    label: 'Ethereum',
                    iconSrc: '/images/markets/ethereum.svg'
                },
                {
                    value: 'Polygon',
                    label: 'Polygon',
                    iconSrc: '/images/markets/polygon.svg'
                }
            ],
            linkType: 'All',
            linkSelectIcon: ''
        })
        const router = useRouter()

        const handleChange = (val) => {
            // console.log(val)
        }

        // 按产品名首字母排序
        const sortByName = (obj1, obj2) => {
            return obj1['symbol'].substr(0, 1).toLowerCase().localeCompare(obj2['symbol'].substr(0, 1).toLowerCase())
        }

        // 按nav价格排序
        const sortByNum = (obj1, obj2) => {
            const val1 = obj1.nav
            const val2 = obj2.nav
            return val1 - val2
        }

        const sortByDay = (obj1, obj2) => {
            const val1 = obj1._1D
            const val2 = obj2._1D
            return val1 - val2
        }

        const sortByWeek = (obj1, obj2) => {
            const val1 = obj1._1W
            const val2 = obj2._1W
            return val1 - val2
        }

        const sortByMonth = (obj1, obj2) => {
            const val1 = obj1._1M
            const val2 = obj2._1M
            return val1 - val2
        }

        const sortBy3Month = (obj1, obj2) => {
            const val1 = obj1._3M
            const val2 = obj2._3M
            return val1 - val2
        }

        // 获取市场列表
        const queryGetMarketList = () => {
            getMarketList({
                vs_currency: state.vs_currency,
                price_change_percentage: state.price_change_percentage,
                order: 'market_cap_desc'
            }).then(res => {
                console.log(res)
                // state.tableData = res
            })
        }

        const initData = () => {
            var proList = []
            state.loading = true
            var tempStr = []
            // 重新按产品列表组装显示的列表数据
            productTokensBySymbolList.map((item, index) => {
                let prices = 0.00

                // 获取90天的币种历史行情图表数据[时间戳,价格]
                getMarketChart_coingecko({
                    vs_currency: state.vs_currency,
                    id: item.coingeckoId,
                    days: 90,
                    // interval: 'daily'
                }).then(res => {
                    // console.log(res)

                    if (res) {
                        const dataArr = res.prices
                        const _length = dataArr.length // 记录数据总条数,避免总条数不够90天的按最多条数计数
                        prices = res.prices[_length - 1][1] // 最后一天,最近的价格
                        // console.log(_length)
                        // console.log(prices, window.dayjs(res.prices[_length - 1][0]).format('YYYY-MM-DD HH:mm:ss'))
                        const _1D_val = dataArr[_length - 24][1]
                        const _1W_val = dataArr[_length - (24 * 7)][1]
                        const _1M_val = dataArr[_length - (24 * 30)][1]
                        const _3M_val = dataArr[0][1]
                        // const _3M_val = dataArr[_length - (24 * 90)][1]
                        // console.log('_1D_val->' + _1D_val)
                        // console.log('_1W_val->' + _1W_val)
                        // console.log('_1M_val->' + _1M_val)
                        // console.log('_3M_val->' + _3M_val)

                        if (item.address) {
                            proList.push({
                                ...item,
                                id: item.coingeckoId,
                                NameSmall: item.name,
                                marketLinkType: 'Ethereum',
                                nav: toFixed(prices, 2),
                                _1D: (_1D_val ? toFixed(divide(minus(prices, _1D_val), _1D_val) * 100, 2) : '0.00'),
                                _1W: (_1W_val ? toFixed(divide(minus(prices, _1W_val), _1W_val) * 100, 2) : '0.00'),
                                _1M: (_1M_val ? toFixed(divide(minus(prices, _1M_val), _1M_val) * 100, 2) : '0.00'),
                                _3M: (_3M_val ? toFixed(divide(minus(prices, _3M_val), _3M_val) * 100, 2) : '0.00'),
                                Operta: '',
                                iconOrigin: indexCoopFavLogo
                            })
                        }
                        if (item.polygonAddress) {
                            proList.push({
                                ...item,
                                id: item.coingeckoId,
                                NameSmall: item.name,
                                marketLinkType: 'Polygon',
                                nav: toFixed(prices, 2),
                                _1D: (_1D_val ? toFixed(divide(minus(prices, _1D_val), _1D_val) * 100, 2) : '0.00'),
                                _1W: (_1W_val ? toFixed(divide(minus(prices, _1W_val), _1W_val) * 100, 2) : '0.00'),
                                _1M: (_1M_val ? toFixed(divide(minus(prices, _1M_val), _1M_val) * 100, 2) : '0.00'),
                                _3M: (_3M_val ? toFixed(divide(minus(prices, _3M_val), _3M_val) * 100, 2) : '0.00'),
                                Operta: '',
                                iconOrigin: indexCoopFavLogo
                            })
                        }

                        // console.log(dataArr)
                        // dataArr.map((it, index) => {
                        //     // console.log(it)
                        //     if (item.symbol === 'icETH') {
                        //         // console.log(item)
                        //         // console.log(window.dayjs(it[0]).format('YYYY-MM-DD HH:mm:ss'), it[1])
                        //     }
                        // })
                        // console.log(window.dayjs(dataArr[0][0]).format('YYYY-MM-DD HH:mm:ss'), dataArr[0][1])

                        // 执行单个插入
                        // proList.push({
                        //     ...item,
                        //     id: item.coingeckoId,
                        //     marketId: 'Ethereum_' + item.coingeckoId,
                        //     NameSmall: item.name,
                        //     marketLinkType: 'Ethereum',
                        //     nav: retainDecimal(prices, 2),
                        //     _1D: (_1D_val ? retainDecimal(divide(minus(prices, _1D_val), _1D_val) * 100, 2) : '0.00'),
                        //     _1W: (_1W_val ? retainDecimal(divide(minus(prices, _1W_val), _1W_val) * 100, 2) : '0.00'),
                        //     _1M: (_1M_val ? retainDecimal(divide(minus(prices, _1M_val), _1M_val) * 100, 2) : '0.00'),
                        //     _3M: (_3M_val ? retainDecimal(divide(minus(prices, _3M_val), _3M_val) * 100, 2) : '0.00'),
                        //     Operta: '',
                        //     iconOrigin: indexCoopFavLogo
                        // })
                    }
                }).catch(err => {
                    state.loading = false
                    proList.push({
                        ...item,
                        id: item.coingeckoId,
                        NameSmall: item.name,
                        nav: 0,
                        _1D: '--',
                        _1W: '--',
                        _1M: '--',
                        _3M: '--',
                        Operta: '',
                        iconOrigin: indexCoopFavLogo
                    })
                    console.log(err)
                })
            })

            // const fTime = (time) => {
            //     return window.dayjs(time).format('YYYY-MM-DD HH:mm:ss')
            // }

            const st = setTimeout(function () {
                if (store.state._web3.testnetMode) {
                    state.tableData = []
                } else {
                    state.tableData = proList
                }

                state.tempData = proList
                state.loading = false
                clearTimeout(st)
            }, 1300)
        }

        // 监听申购数量
        watch(() => store.state._web3.testnetMode, (val) => {
            console.log(val)
            if (val) {
                state.tableData = []
            } else {
                // state.tableData = state.tempData
                if (state.linkType !== 'All') {
                    const tempArr = []
                    state.tempData.map((it) => {
                        if (it.marketLinkType === state.linkType) {
                            tempArr.push(
                                it
                            )
                        }
                    })
                    const st = setTimeout(function () {
                        state.tableData = tempArr
                        clearTimeout(st)
                    }, 500)
                } else {
                    state.tableData = state.tempData
                }
            }
        })

        const changeLinkType = (val) => {
            console.log(val, store.state._web3.testnetMode)
            if (store.state._web3.testnetMode) {
                state.tableData = []
            } else {
                // state.tableData = proList
                if (val !== 'All') {
                    const tempArr = []
                    state.tempData.map((it) => {
                        if (it.marketLinkType === state.linkType) {
                            tempArr.push(
                                it
                            )
                        }
                    })
                    const st = setTimeout(function () {
                        state.tableData = tempArr
                        clearTimeout(st)
                    }, 500)
                } else {
                    state.tableData = state.tempData
                }
            }
        }

        // 申购 弹窗
        const handleClick = (e) => {
            // console.log(e)
            state.dialogShow = true
        }

        // 弹窗关闭
        const dialogShowClose = (val) => {
            state.dialogShow = val
        }

        // 跳转详情页
        const handleDetail = (row) => {
            console.log(row)
            router.push({
                path: '/indexFunds/detail',
                query: {
                    id: row.id,
                    address: row.address,
                    // polygonAddress: row.polygonAddress,
                    linkType: row.marketLinkType
                }
            })
        }

        onMounted(() => {
            // queryGetMarketList()
            initData()
            // 连接狐狸钱包
            // if (localGet('walletProvider')) {
            //     executeConnect()
            // }
        })

        return {
            ...toRefs(state),
            router,
            handleChange,
            handleClick,
            handleDetail,
            dialogShowClose,
            queryGetMarketList,
            initData,
            changeLinkType,
            sortByName,
            sortByNum,
            sortByDay,
            sortByWeek,
            sortByMonth,
            sortBy3Month
        }
    }
}

</script>

<style lang="scss" scoped>
@import '../fundDEX.scss';
.txtRed {
    color: var(--warn);
}
.txtGreen {
    color: var(--success);
}
.popover-content {
    width: auto;
    padding: 0 12px;
    font-size: 16px;
    line-height: 16px;
}
.test-tag {
    display: inline-block;
    text-align: center;
    cursor: pointer;
}
.icon-all {
    display: inline-block;
    margin-right: 15px;
    color: var(--mainColor);
    font-size: 22px;
    vertical-align: -3px;
}
.el-select-dropdown__item {
    height: 42px;
    color: var(--mainColor);
    line-height: 42px !important;
}

</style>
