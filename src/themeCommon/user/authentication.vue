<template>
    <Top back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <p class='title'>
            完成认证，可获得对应权限
        </p>
        <div class='auth-list'>
            {{ list }}
            <div class='auth-item'>
                <img alt='' class='auth-img' src='../../themes/mt4/images/lv1.png' srcset='' />
                <div class='content'>
                    <p class='t1'>
                        基础认证
                    </p>
                    <p class='t2'>
                        认证通过后方可进行 [注册]
                    </p>
                </div>
                <van-button plain round size='small' @click="$router.push('/authL1')">
                    <template #default>
                        <span class='btn-text'>
                            去认证
                        </span>
                        <van-icon name='arrow' />
                    </template>
                </van-button>
            </div>

            <div class='auth-item'>
                <img alt='' class='auth-img' src='../../themes/mt4/images/lv2.png' srcset='' />
                <div class='content'>
                    <p class='t1'>
                        中级认证
                    </p>
                    <p class='t2'>
                        认证通过后方可进行 [存款]
                    </p>
                </div>
                <span class='notice'>
                    请先完成LV1认证
                </span>
            </div>

            <div class='auth-item'>
                <img alt='' class='auth-img' src='../../themes/mt4/images/lv3.png' srcset='' />
                <div class='content'>
                    <p class='t1'>
                        高级认证
                    </p>
                    <p class='t2'>
                        认证通过后方可进行 [取款]
                    </p>
                </div>
                <span class='notice'>
                    请先完成LV2认证
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { useRouter } from 'vue-router'
import { findAllBizKycList } from '@/api/user'
import { toRefs, reactive, ref, onBeforeMount } from 'vue'
export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const state = reactive({
            list: []
        })
        const getAuthCondition = () => {
            findAllBizKycList().then(res => {
                if (res.check()) {
                    state.list = res.data
                }
            })
        }
        onBeforeMount(() => {
            getAuthCondition()
        })

        return {
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
