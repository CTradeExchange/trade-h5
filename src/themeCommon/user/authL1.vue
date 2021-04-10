<template>
    <Top back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <van-field
            v-model='area'
            input-align='right'
            label='国家'
            placeholder='请选择国家'
            readonly
            right-icon='arrow-down'
            @click='areaShow = true'
        />
        <div class='notice'>
            <p class='title'>
                需要准备的验证资料
            </p>
            <ul>
                <li>姓名</li>
                <li>身份证号</li>
            </ul>
        </div>
        <van-button class='confirm-btn' @click='beginAuth'>
            开始验证
        </van-button>
    </div>
    <van-action-sheet v-model:show='areaShow' :actions='actions' @select='onSelect' />
</template>

<script>
import Top from '@m/layout/top'
import { useRouter } from 'vue-router'
import { toRefs, reactive, ref } from 'vue'
import { Toast } from 'vant'
export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const state = reactive({
            areaShow: false,
            area: ''
        })
        const actions = [
            { name: '中国' },
            { name: '美国' },
            { name: '澳大利亚' },
        ]

        const onSelect = (item) => {
            state.area = item.name
            state.areaShow = false
        }

        const beginAuth = () => {
            if (!state.area) {
                return Toast('请先选择国家')
            }
            router.push('/authL1Input')
        }

        return {
            ...toRefs(state),
            actions,
            onSelect,
            beginAuth
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    padding-top: rem(30px);
    overflow: auto;
    .notice {
        margin-top: rem(58px);
        padding-left: rem(30px);
        .title {
            color: var(--mutedColor);
            font-size: rem(28px);
            line-height: rem(36px);
        }
        ul {
            padding-left: rem(30px);
            li {
                margin-top: rem(20px);
                list-style-type: disc;
            }
        }
    }
    .confirm-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        color: var(--color);
        font-size: rem(34px);
        background: var(--btnColor);
    }
}
</style>
