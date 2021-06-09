<template>
    <LayoutTop :back='true' :menu='false' title='' @backEvent='back' />
    <div class='page-wrap'>
        <Loading :show='loading' />
        <div v-if='list.length === 0'>
            <van-empty description='暂无需验证' image='search' />
        </div>
        <div v-else>
            <p class='title'>
                完成认证，可获得对应权限
            </p>
            <div class='auth-list'>
                <div v-for='(item,index) in list' :key='index' class='auth-item'>
                    <img alt='' class='auth-img' :src="require('../../themes/mt4/images/'+ item.levelCode +'.png')" />
                    <div class='content'>
                        <p class='t1'>
                            {{ item.levelName }}
                        </p>
                        <p class='t2'>
                            认证通过后方可进行 [{{ item.businessNameList.toString() }}]
                        </p>
                    </div>
                    <div v-if='item.preLevelObj && item.preLevelObj.status !== 2'>
                        <span class='notice'>
                            请先完成{{ item.preLevelObj.levelName }}认证
                        </span>
                    </div>
                    <div v-else>
                        <van-button plain round size='small' @click='handleNext(item)'>
                            <template #default>
                                <span class='btn-text'>
                                    {{ item.statusName }}
                                </span>
                                <van-icon name='arrow' />
                            </template>
                        </van-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { findAllBizKycList } from '@/api/user'
import { useStore } from 'vuex'
import { toRefs, reactive, computed, onBeforeMount } from 'vue'
import { getArrayObj } from '@/utils/util'
export default {
    setup (props, { emit, attrs }) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
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
                    path: '/authForm',
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
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    padding: 0 rem(30px);
    overflow: auto;
    .title {
        color: var(--mutedColor);
        line-height: rem(80px);
        border-bottom: solid 1px var(--btnLine);
    }
    .auth-list {
        .auth-item {
            display: flex;
            align-items: center;
            padding: rem(45px) 0;
            border-bottom: solid 1px var(--btnLine);
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
                .btn-text {
                    vertical-align: middle;
                }
                .van-icon {
                    vertical-align: middle;
                }
            }
            .notice {
                color: var(--mutedColor);
                font-size: rem(24px);
            }
        }
    }
}
</style>
