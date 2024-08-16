<template>
    <centerViewDialog :id='id' :class='class'>
        <LayoutTop :custom-back='true' icon='icon_icon_close_big' @back='customBack' />
        <div class='page-wrap'>
            <Loading :show='loading' />
            <div v-if='kycList.length>0' class='arae'>
                <div class='left'>
                    <span>{{ $t('common.yourArea') }}</span>
                    <img
                        alt=''
                        class='icon-country'
                        :src='`${cdnUrl}/images/countries_flags/${customerInfo.country}.png`'
                        srcset=''
                    />
                    <span>{{ currentCountry?.name }}</span>
                </div>
                <div v-if='kycStatus!==4' class='right' @click='handleChangeArea'>
                    {{ $t('common.change') }}
                    <van-icon name='arrow' />
                </div>
            </div>
            <div v-if='kycList && kycList.length === 0' class='empty-data'>
                <van-empty :description='$t("auth.noRequired")' image='/images/empty.png' />
            </div>
            <div v-else>
                <p class='title'>
                    {{ $t('auth.authComplete') }}
                </p>
                <div class='auth-list'>
                    <div v-for='(item,index) in kycList' :key='index' class='auth-item'>
                        <img alt='' class='auth-img' :src="require('@/themes/plans/images/'+ item.levelCode +'.png')" />
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
                            <!-- <van-button v-if='[0,3].includes(Number(item.status))' plain round size='small' @click='handleNext(item)'>
                                    <template #default>
                                        <span class='unverified' @click='handleNext(item)'>
                                            {{ kycAuditStatus[item.status] }}
                                            <van-icon :color='style.fallColor' name='arrow' />
                                        </span>
                                    </template>
                                </van-button> -->
                            <div v-if='[0,3].includes(Number(item.status))' class='unverified' @click='handleNext(item)'>
                                {{ kycAuditStatus[item.status] }}
                                <van-icon :color='style.fallColor' name='arrow' />
                            </div>
                            <span v-else class='state'>
                                {{ kycAuditStatus[item.status] }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { toRefs, reactive, computed, onBeforeMount, onMounted, watch } from 'vue'
import { firebaseAnalytics } from '@/utils/firebase'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { cdnUrl } from '@/config'
import { getUserInfo } from '@/api/newApi'
import { sessionGet, sessionSet, sessionRemove } from '@/utils/util'

export default {
    name: 'Authentication',
    components: {
        centerViewDialog
    },
    data: function () {
        return {
            id: 'AuthenticationId',
            title: 'AuthenticationClass'
        }
    },
    setup (props, { emit, attrs }) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const style = computed(() => store.state.style)
        const { t, tm } = useI18n({ useScope: 'global' })
        const customerInfo = computed(() => store.state._user?.customerInfo)
        const state = reactive({
            list: [],
            loading: false,
            userInfo: (sessionGet('newsUserInfo') && JSON.parse(sessionGet('newsUserInfo'))) || {},
        })

        store.dispatch('getCountryListByParentCode')
        const countryList = computed(() => store.state.countryList)

        const kycMap = {
            level_1: t('common.kycLevel1'),
            level_2: t('common.kycLevel2'),
            level_3: t('common.kycLevel3'),
        }
        const kycList = computed(() => store.state._user.kycList)
        const kycState = computed(() => store.state._user.kycState)
        const kycStatus = computed(() => store.state._user.kycStatus)
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
                    path: route.path.slice(0, -15) + '/authForm',
                    query: {
                        levelCode: item.levelCode,
                        businessCode: route.query.businessCode
                    }
                })
            }
        }

        const getInfo = () => {
            getUserInfo({ body: {} }).then(res => {
                const { Code, Data } = res || {}
                if (Code === 1000) {
                    const { InvitationCode } = Data || {}
                    sessionSet('newsUserInfo', JSON.stringify(Object.assign(Data, { isBack: false, submit: true })))
                    state.userInfo = Data
                    if (InvitationCode) {
                        state.inviteCodeEnable = false
                    }
                }
            })
        }
        onMounted(() => {
            // firebase
            const value = location.pathname.toLocaleLowerCase().indexOf('/assets') > -1 ? 'withdraw' : 'me'
            firebaseAnalytics('kyc_initiated', {
                key: 'kyc_entrance',
                value
            })
            if (state.userInfo.isBack) return
            getInfo()
        })

        const back = () => {
            router.replace('/personal')
        }

        const customBack = () => {
            sessionRemove('newsUserInfo')
            router.go(-1)
        }

        const handleChangeArea = () => {
            if (kycStatus.value !== 4) {
                sessionSet('newsUserInfo', JSON.stringify(state.userInfo))
                router.push({
                    path: route.path.slice(0, -14) + 'area',
                })
            }
        }

        const currentCountry = computed(() => countryList.value.find(i => i.code === customerInfo.value?.country)) || countryList.value[0] || {}

        watch([() => countryList.value, () => state.userInfo], () => {
            if (!state.userInfo?.Country) {
                state.userInfo.Country = countryList.value[0]?.code
            }
        }, { immediate: true })

        onBeforeRouteLeave((to, from) => {
            if ((Number(kycState.value) === 0 || Number(kycState.value) === 3) && to.path.indexOf('/authForm') === -1) {
                store.dispatch('_user/logout').then(() => {
                    return router.push('/login')
                }).then(() => {
                    location.reload()
                })
            }
        })

        onBeforeMount(() => {
            getAuthCondition()
        })

        return {
            kycStatus,
            currentCountry,
            customBack,
            cdnUrl,
            handleChangeArea,
            kycState,
            handleNext,
            back,
            style,
            kycMap,
            kycAuditStatus,
            kycList,
            customerInfo,
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
    padding:20px;
    background: var(--contentColor);
    .empty-data {
        padding-top: rem(200px);
    }
    .title {
        padding: 0 rem(25px);
        color: var(--minorColor);
        line-height: rem(80px);
        //border-bottom: solid 1px var(--lineColor);
    }
    .auth-list {
        //padding: 0 rem(30px);
        background: var(--contentColor);
        .auth-item {
            display: flex;
            align-items: center;
            padding: 20px;
            border: solid 1px var(--lineColor);
            .auth-img {
                width: rem(60px);
                height: rem(100px);
                margin-right: rem(30px);
            }
            .content {
                flex: 1;
                word-break: keep-all;
                word-wrap: break-word;
                padding-right: 30px;
                .t1 {
                    color: var(--color);
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 25px;
                }
                .t2 {
                    color: var(--color);
                    font-weight: 500;
                    font-size: 14px;
                    //font-family: PingFang SC;
                    line-height: 25px;
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
                    vertical-align: middle;
                }
            }
            .notice {
                color: var(--minorColor);
                font-size: rem(24px);
            }
        }
        .btn{
            :deep(.van-button){
                background: var(--primaryAssistColor);
            }
            .unverified{
                color: var(--fallColor);
                cursor: pointer;

            }
            .state{
                color: var(--minorColor);
                font-size: rem(24px);
            }
            .van-icon-arrow{
                vertical-align: -1px !important;
            }
        }
    }
    .arae{
        display: flex;
        justify-content: space-between;
        height: 60px;
        border:1px solid var(--lineColor);
        padding:0 20px;
        align-items: center;
        background: var(--contentColor);
        .left{
            font-size: 16px;
            color:var(--mainColor);
            display: flex;
            align-items: center;
            .icon-country{
                width:36px;
                margin:0 8px 0 20px;
            }
        }
        .right{
            font-size: 14px;
            color: #929292;
            cursor: pointer;
            text-transform: capitalize;
        }

    }
}
</style>
