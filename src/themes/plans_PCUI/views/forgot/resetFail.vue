<template>
    <div class='pageWrap'>
        <topNav class='header' />
        <div class='container'>
            <div class='content'>
                <div class='wrap'>
                    <i class='icon_fail'></i>
                    <p class='t1'>
                        {{ $t('forgot.setPwdFailed') }}
                    </p>
                    <p class='t2'>
                        {{ $t('forgot.tryLater') }}
                    </p>
                </div>
                <div class='footer-bottom'>
                    <van-button class='confirmBtn' @click='$router.push("/forgot")'>
                        {{ $t('common.tryAgain') }}
                    </van-button>
                    <span class='line'></span>
                    <van-button class='confirmBtn' @click='toService'>
                        {{ $t('common.serivce') }}
                    </van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { useRouter } from 'vue-router'
import topNav from '@planspc/layout/topNav'
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
    name: 'ResetFail',
    components: {
        topNav
    },
    setup (props) {
        // const router = useRouter()
        const store = useStore()
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)
        const toService = () => {
            if (onlineServices.value) { location.href = onlineServices.value }
        }

        return {
            toService,
            onlineServices
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--assistColor);
    .container {
        flex: 1;
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        .content{
            width:520px;
            padding: 60px;
            border-radius: 10px;
                background-color: var(--contentColor);
        }
    }
}
.wrap {
    padding-top: 40px;
    text-align: center;
    .icon_fail {
        color: var(--success);
        font-size: 64px;
    }
    .t1 {
        color: var(--color);
        font-size: 32px;
    }
    .t2 {
        margin-top: 24px;
        color: var(--color);
        font-size: 16px;
    }
    .t3 {
        margin-top: 30px;
        color: var(--minorColor);
        font-size: 16px;
    }
}
.footer-bottom {
    // position: absolute;
    // bottom: 0;
    margin-top:36px;
    display: flex;
    align-items: center;
    width: 100%;
    background: var(--lineColor);
    .line {
        width: rem(2px);
        height: rem(47px);
        background: var(--placeholder);
    }
    .confirmBtn {
        flex: 1;
        background: var(--primary);
        border-color: var(--primary);
        color: var(--contentColor);
        span {
            color: var(--contentColor);
            font-size: 24px;
        }
    }
}

</style>
