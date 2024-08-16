<template>
    <!-- 头部导航 -->
    <LayoutTop :custom-back='true' :menu='false' :title='$t("cRoute.regKyc")' @back='back' />
    <div class='page-wrap'>
        <Loading :show='loading' />
        <div v-if='kycList.length>0' class='arae' @click='handleChangeArea'>
            <div class='left'>
                <span>{{ $t('common.yourArea') }}</span>
                <img
                    alt=''
                    class='icon-country'
                    :src='`${cdnUrl}/images/countries_flags/${countryCode}.png`'
                    srcset=''
                />
                <span>{{ countryName }}</span>
            </div>
            <div v-if='kycStatus!==4' class='right'>
                <span>{{ $t('common.change') }}</span>
                <van-icon class='right-icon' name='arrow' :size='14' />
            </div>
        </div>
        <div v-if='customInfo.openAccountType===1' class='business'>
            {{ $t('auth.authToPC') }}
        </div>
        <div v-else-if='kycList.length === 0' class='empty-data'>
            <van-empty :description='$t("auth.noRequired")' image='/images/empty.png' />
        </div>
        <div v-else>
            <div class='auth-list'>
                <div v-for='(item,index) in kycList' :key='index' class='auth-item'>
                    <div class='content'>
                        <p class='t1'>
                            {{ kycMap[item.levelCode] }}
                        </p>
                        <p class='t2'>
                            {{ $t('auth.authPass') }} [{{ item.businessNameList.toString() }}]
                        </p>
                    </div>
                    <div v-if='item.preLevelObj && item.preLevelObj.status !== 2'>
                        <span class='notice'>
                            {{ $t('auth.executeAuth', [kycMap[item.preLevelObj.levelCode]]) }}
                        </span>
                    </div>
                    <div v-else class='btn'>
                        <span v-if='[0,3].includes(Number(item.status))' class='unverified' @click='handleNext(item)'>
                            {{ kycAuditStatus[item.status] }}
                            <van-icon :color='style.fallColor' name='arrow' />
                        </span>
                        <span v-else class='state'>
                            {{ kycAuditStatus[item.status] }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { cdnUrl } from '@/config'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { toRefs, reactive, computed, onBeforeMount, watch } from 'vue'
import { getArrayObj } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { getUserInfo } from '@/api/newApi'
import { Toast } from 'vant'

export default {

    setup (props, { emit, attrs }) {
        const { t, tm } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { countryCode, isBack } = route.params || {}
        const style = computed(() => store.state.style)
        const customInfo = computed(() => store.state._user.customerInfo)
        const state = reactive({
            loading: false,
            countryCode: computed(() => customInfo.value?.country),
            countryName: ''
        })

        store.dispatch('getCountryListByParentCode')
        const countryList = computed(() => store.state.countryList)

        const kycMap = {
            level_1: t('common.kycLevel1'),
            level_2: t('common.kycLevel2'),
            level_3: t('common.kycLevel3'),
        }

        const kycState = computed(() => store.state._user.kycState)
        const kycStatus = computed(() => store.state._user.kycStatus)

        const kycList = computed(() => store.state._user.kycList)
        const kycAuditStatus = tm('kycAuditStatus')

        const getAuthCondition = () => {
            state.loading = true
            store.dispatch('_user/findAllBizKycList').then(res => {
                state.loading = false
            })
        }

        const handleNext = (item) => {
            if (Number(item.status) === 0 || Number(item.status) === 3) {
                router.push({
                    path: '/authForm',
                    query: {
                        levelCode: item.levelCode,
                        businessCode: route.query.businessCode
                    }
                })
            }
        }

        const getInfo = () => {
            // getUserInfo({ body: {} }).then(res => {
            //     const { Code, Data } = res || {}
            //     if (Code === 1000) {
            //         const { Country } = Data || {}
            //         if (Country) {
            //             state.countryCode = countryList.value.find(i => i.code === Country)?.code
            //         } else {
            //             state.countryCode = countryList.value[0]?.code
            //         }
            //     }
            // })
        }

        const back = () => {
            router.replace('/mine')
        }

        const handleChangeArea = () => {
            if (kycStatus.value !== 4) {
                router.push({ name: 'Area', params: { back: 'Authentication', countryCode: state.countryCode } })
            }
        }

        watch([() => countryList.value, () => state.countryCode], () => {
            if (!state.countryCode) {
                state.countryCode = countryList.value[0]?.code
            }
            state.countryName = countryList.value.find(i => i.code === state.countryCode)?.name || countryList.value[0]?.name
        }, { immediate: true })

        onBeforeRouteLeave((to, from) => {
            if ((Number(kycState.value) === 0 || Number(kycState.value) === 3) && to.path !== '/authForm') {
                store.dispatch('_user/logout').then(() => {
                    return router.push('/login')
                }).then(() => {
                    location.reload()
                })
            }
        })

        onBeforeMount(() => {
            getAuthCondition()
            if (isBack) return
            getInfo()
        })

        return {
            kycStatus,
            cdnUrl,
            handleChangeArea,
            kycState,
            handleNext,
            back,
            style,
            kycMap,
            kycList,
            customInfo,
            kycAuditStatus,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    overflow: auto;
    background: var(--bgColor);

    .arae{
        margin-top:rem(20px);
        background: var(--contentColor);
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: rem(120px);
        padding:rem(30px);
        .left{
            display: flex;
            align-items: center;
            color:var(--mainColor);
            font-size: rem(28px);
            .icon-country{
                width:rem(72px);
                // height: rem(110px);
                vertical-align: middle;
                border: solid 1px var(--lineColor);
                margin:0 rem(25px) 0 rem(20px);
            }

        }
        .right{
            display: flex;
            align-items: center;
            font-size: rem(26px);
            color:#929292;
            text-transform: capitalize;
            .right-icon{
                margin-bottom: rem(5px);
            }
        }
    }
    .empty-data {
        padding-top: rem(200px);
    }
    .title {
        padding: 0 rem(25px);
        color: var(--minorColor);
        line-height: rem(80px);
        border-bottom: solid 1px var(--lineColor);
    }
    .auth-list {
        //margin-top: rem(10px);
        //padding: 0 rem(30px);
        background: var(--contentColor);
        .auth-item {
            display: flex;
            align-items: center;
            padding: rem(30px) rem(30px);
            //border-top: solid rem(10px) var(--bgColor);
            margin-top:rem(20px);
            .auth-img {
                width: rem(60px);
                height: rem(100px);
                margin-right: rem(30px);
            }
            .content {
                flex: 1;
                .t1 {
                    color: var(--color);
                    font-weight: bold;
                    font-size: rem(28px);
                    line-height: rem(49px);
                }
                .t2 {
                    color: var(--color);
                    font-weight: 500;
                    font-size: rem(24px);
                    font-family: PingFang SC;
                    line-height: rem(49px);
                }
            }
            .van-button {
                padding: 0 rem(30px);
                // background: var(--primaryAssistColor);
                .btn-text {
                    padding-right: rem(6px);
                    color: var(--color);
                    vertical-align: middle;
                }
                .van-icon {
                    vertical-align: rem(-2px);
                }
            }
            .notice {
                color: var(--minorColor);
                font-size: rem(24px);
            }
        }
        .btn {
            :deep(.van-button) {
                background: var(--primaryAssistColor);
            }
            .unverified {
                color: var(--fallColor);
            }
            .state {
                color: var(--minorColor);
                font-size: rem(26px);
            }
        }
    }
    .business {
        padding-top: 40%;
        color: var(--minorColor);
        font-size: rem(30px);
        text-align: center;
    }
}
</style>
