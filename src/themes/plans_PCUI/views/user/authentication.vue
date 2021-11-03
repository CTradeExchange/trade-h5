<template>
    <centerViewDialog>
        <div>
            <LayoutTop :back='true' :menu='false' title='' @backEvent='back' />
            <div class='page-wrap'>
                <Loading :show='loading' />
                <div v-if='list.length === 0' class='empty-data'>
                    <van-empty :description='$t("auth.noRequired")' image='/images/empty.png' />
                </div>
                <div v-else>
                    <p class='title'>
                        {{ $t('auth.authComplete') }}
                    </p>
                    <div class='auth-list'>
                        <div v-for='(item,index) in list' :key='index' class='auth-item'>
                            <img alt='' class='auth-img' :src="require('@/themes/mt4/images/'+ item.levelCode +'.png')" />
                            <div class='content'>
                                <p class='t1'>
                                    {{ item.levelName }}
                                </p>
                                <p class='t2'>
                                    {{ $t('auth.authPass') }} [{{ item.businessNameList.toString() }}]
                                </p>
                            </div>
                            <div v-if='item.preLevelObj && item.preLevelObj.status !== 2'>
                                <span class='notice'>
                                    {{ $t('auth.executeAuth', [item.preLevelObj.levelName]) }}
                                </span>
                            </div>
                            <div v-else>
                                <van-button plain round size='small' @click='handleNext(item)'>
                                    <template #default>
                                        <span class='btn-text'>
                                            {{ item.statusName }}
                                        </span>
                                        <van-icon :color='style.color' name='arrow' />
                                    </template>
                                </van-button>
                            </div>
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
import { findAllBizKycList } from '@/api/user'
import { useStore } from 'vuex'
import { toRefs, reactive, computed, onBeforeMount } from 'vue'
import { getArrayObj } from '@/utils/util'

export default {
    name: 'Authentication',
    components: {
        centerViewDialog
    },
    setup (props, { emit, attrs }) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const style = computed(() => store.state.style)
        const state = reactive({
            list: [],
            loading: false,
        })

        const kycState = computed(() => store.state._user.kycState)

        const getAuthCondition = () => {
            state.loading = true
            findAllBizKycList().then(res => {
                state.loading = false
                if (res.check()) {
                    res.data.forEach(item => {
                        if (item.preLevelName) {
                            const temp = getArrayObj(res.data, 'levelName', item.preLevelName)
                            item.preLevelObj = temp
                        }
                    })
                    state.list = res.data
                }
            }).catch(err => {
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

        const back = () => {
            router.replace('/personal')
        }

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
        })

        return {
            kycState,
            handleNext,
            back,
            style,
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
    .empty-data {
        padding-top: rem(200px);
    }
    .title {
        color: var(--minorColor);
        line-height: rem(80px);
        border-bottom: solid 1px var(--lineColor);
            padding-top: 22px;
    }
    .auth-list {
        margin-top: rem(30px);
        padding: 0 rem(30px);
        background: var(--contentColor);
        .auth-item {
            display: flex;
            align-items: center;
            padding: rem(45px) 0;
            border-bottom: solid 1px var(--lineColor);
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
                    vertical-align: middle;
                }
            }
            .notice {
                color: var(--minorColor);
                font-size: rem(24px);
            }
        }
    }
}
</style>
