<template>
    <router-view />
    <div class='page-my-race'>
        <div class='my-race-main'>
            <div class='race-dropdown'>
                <el-dropdown ref='dropdown1' class='dropdown-el' trigger='click'>
                    <div class='dropdown-link'>
                        <span>{{ currentTab.label }}</span>
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for='item in tabsList' :key='item.value' @click='changeTabIndex(item)'>
                                {{ item.label }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

            <div class='table-box'>
                <el-table class='race-table' :data='list' @row-click='handleCilick'>
                    <el-table-column
                        v-for='col in columns'
                        :key='col.label'
                        :align='col.align'
                        :fixed='col.fixed'
                        :formatter='col.formatter'
                        :label='col.label'
                        :prop='col.prop'
                    />
                    <template #empty class='none-data'>
                        <van-empty v-if='isEmpty(list) && !loading' :description='$t("common.noData")' image='/images/empty.png' />
                        <div v-if='isEmpty(list) && loading' class='loading'>
                            <van-loading type='spinner'>
                                {{ $t('compLang.loading') }}
                            </van-loading>
                        </div>
                    </template>
                </el-table>
            </div>
            <div v-if='!finished && isFetch' class='load-more'>
                <div class='more-btn' @click='loadMore'>
                    <span>{{ $t("news.more") }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { getUserActiveList } from '@/api/newApi'
import dayjs from 'dayjs'
import raceCup from '@planspc/images/race-cup.png'
import { isEmpty, getCookie } from '@/utils/util'
import { useRouter } from 'vue-router'
export default {
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const router = useRouter()
        const state = reactive({
            tabsList: [
                {
                    label: t('competition.inProgress'),
                    value: 20
                },
                {
                    label: t('competition.finished'),
                    value: 30
                }
            ],
            currentTab: {
                label: t('competition.inProgress'),
                value: 20
            },
            list: [],
            columns: [
                {
                    label: t('competition.time'),
                    prop: 'StartTime',
                    width: 210,
                    align: 'center',
                    formatter: (row, col, cell, index) => {
                        const text = `${dayjs(Number(row.StartTime)).format('YYYY.MM.DD')}-${dayjs(Number(row.EndTime)).format('YYYY.MM.DD')}`
                        return h('div', { class: 'time-cell' }, text)
                    }
                },
                // {
                //     label: t('competition.type'),
                //     prop: 'type',
                //     width: 60,
                //     align: 'center',
                //     formatter: (row, col, cell, index) => {
                //         const src = cell === 1 ? raceCup : raceCup
                //         return h('img', { src, class: 'cup-img' }, '')
                //     }
                // },
                {
                    label: t('competition.competitionName'),
                    prop: 'name',
                    width: 380,
                    formatter: (row, col, cell, index) => {
                        const lang = getCookie('lang') || 'en-US'
                        const { AllActivityNames } = row || {}
                        if (isEmpty(AllActivityNames)) return ''
                        const curItem = AllActivityNames.find(i => i.Language === lang) || AllActivityNames[0]
                        const { ActivityName } = curItem || {}
                        return ActivityName
                    }
                },
                {
                    label: t('competition.rankOfProfit'),
                    prop: 'AmountRank',
                    width: 180,
                    align: 'center',
                    formatter: (row, col, cell, index) => {
                        return h('div', { class: 'time-cell' }, cell > 999 ? '999+' : cell <= 0 ? '-' : cell)
                    }
                },
                // {
                //     label: t('competition.rankOfProfitability'),
                //     prop: 'RateRank',
                //     width: 180,
                //     align: 'center',
                //     formatter: (row, col, cell, index) => {
                //         return h('div', { class: 'time-cell' }, cell > 999 ? '999+' : cell)
                //     }
                // },
                {
                    label: t('competition.totalReward'),
                    prop: 'AwardPool',
                    fixed: 'right',
                    align: 'right',
                    width: 180,
                    formatter: (row, col, cell, index) => {
                        return h('div', { class: 'reward-cell' }, cell && Number(cell).toLocaleString() + ' USDT')
                    }
                },
            ],
            loading: false,
            isFetch: false,
            offset: 1,
            limit: 10,
            finished: false
        })

        const getList = () => {
            const body = {
                ActivityStatus: [state.currentTab.value],
                Offset: state.offset,
                Limit: state.limit,
                Language: getCookie('lang') || 'en-US'
            }
            state.loading = true
            getUserActiveList({ body }).then(res => {
                const { Code, Data, } = res || {}
                if (Code === 1000) {
                    const { Records, Total } = Data || {}
                    if (state.offset === 1) {
                        state.list = Records || []
                    } else {
                        state.list = (state.list || []).concat(Records)
                    }
                    if (state.list.length >= Total) {
                        state.finished = true
                    } else {
                        state.offset += 1
                    }
                }
                state.loading = false
                state.isFetch = true
            }).catch(err => {
                state.finished = true
                state.loading = false
                state.isFetch = true
            })
        }
        const changeTabIndex = (item) => {
            state.offset = 1
            state.finished = false
            state.isFetch = false
            state.currentTab = item
            state.list = []
            getList()
        }

        const loadMore = () => {
            getList()
        }

        const handleCilick = (e) => {
            const { ActivityId } = e || {}
            router.push(`/competition?id=${ActivityId}`)
        }

        onMounted(() => {
            getList()
        })

        return {
            handleCilick,
            loadMore,
            isEmpty,
            changeTabIndex,
            ...toRefs(state)
        }
    }

}
</script>

<style scoped lang="scss">
.page-my-race{
    flex:1;
    background: var(--contentColor);
    display: flex;
    flex-direction: column;
    align-items: center;
    .my-race-main{
        padding: 30px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .race-dropdown{
            width: 100%;
            max-width: 1200px;
            display: flex;
            justify-content: flex-start;
        }

        .dropdown-link{
            display: flex;
            align-items: center;
            color:var(--mainColor);
            font-size: 16px;
            cursor: pointer;

        }
        .table-box{
            margin-top:15px;
            overflow-x: auto;
            width: 100%;
            max-width: 1200px;
            display: flex;
            justify-content: center;
            .loading{
                padding: 115px 0;

            }
            .race-table{
                width: 100%;
            }
            :deep{
                .el-table__header{
                    //background: linear-gradient(to right,#FAB654, #EA643F );

                    tr{
                        background: linear-gradient(270deg, #EA643F -0.11%, #FAB654 100.45%);
                    }
                }
                .el-table__header{
                    tr{
                        background-color: unset;

                    }
                    .cell{
                        color: var(--contentColor);
                        font-size: 14px;
                        font-weight: normal;
                    }
                }
                .el-table th.el-table__cell{
                    background-color: unset;
                }
                .time-cell{
                    font-family: 'Inter';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 16px;
                    color: #3F5372;
                }
                .reward-cell{
                    color:var(--primary)
                }
                .el-table__body{
                    .cell{
                        font-size: 16px;
                        word-break:unset
                    }
                }

            }
        }
    }
    .load-more{
        display: flex;
        padding:30px;
        .more-btn{
            display:flex;
            justify-content: center;
            align-items: center;
            height:42px;
            background: var(--contentColor);
            color:var(--mainColor);
            font-size: 16px;
            padding:0 15px;
            border: 1px solid #EBEBEB;
            border-radius: 4px;
            cursor: pointer;
        }
    }
}

</style>
