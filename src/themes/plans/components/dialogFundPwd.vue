<template>
    <van-popup
        v-model:show='showFundPwd'
        class='custom-popup'
        :duration='0.2'
        position='bottom'
        round
        teleport='body'
        :transition-appear='true'
        @closed='closed'
    >
        <div class='header'>
            <div class='header-title'>
                {{ $t('common.fundPwd') }}
            </div>
            <i class='icon_guanbi' @click='$emit("update:show",false)'></i>
        </div>
        <div class='dialog-body'>
            <InputComp v-model='pwd' clear :label="$t('common.inputFundPwd')" :max-length='6' pwd />
            <router-link v-if='Number(customInfo.assertPassStatus) === 1' class='href' to='/setFundPwd'>
                {{ $t('login.goSet') }}
            </router-link>
            <router-link v-else class='href' :to="{ name: 'Forgot', query: { type: 'fund' } }">
                {{ $t('login.forgot') }}
            </router-link>
        </div>
        <div class='dialog-footer'>
            <van-button
                block
                class='pcHandler'
                :loading='loading'
                @click='submit'
            >
                {{ $t('common.sure') }}
            </van-button>
        </div>
    </van-popup>
    <!-- <Loading :show='loading' /> -->
</template>

<script>
import { reactive, toRefs, computed, watchEffect, onMounted } from 'vue'
import { useStore } from 'vuex'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import InputComp from '@/components/form/input'
export default {
    components: {
        InputComp
    },
    props: ['show'],
    emits: ['update:show'],
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })

        const customInfo = computed(() => store.state._user.customerInfo)

        const state = reactive({
            showFundPwd: false,
            loading: false,
            pwd: ''
        })

        const closed = () => { // 关闭弹出层且动画结束后触发
            context.emit('update:show', false)
        }
        const formatter = value => {
            // 过滤输入的非数字
            return value.replace(/[^\d]/g, '')
        }

        const submit = () => {
            if (!state.pwd) {
                return Toast(t('common.inputFundPwd'))
            }
            context.emit('confirmWithdraw', state.pwd)
        }

        watchEffect(() => {
            state.showFundPwd = props.show
        })

        return {
            closed,
            submit,
            customInfo,
            formatter,
            ...toRefs(state)

        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';

.dialog-header {

}
.dialog-body{
    .href{
        text-align: right;
        color: var(--primary);
        display: inline-block;
        width: 100%;
        font-size: rem(24px);
        padding: rem(30px) 0;
    }
}

.dialog-footer {
    width: 100%;
    padding: rem(30px) 0;
    .pcHandler {
        color: #FFF;
        background: var(--primary);
        border: none;
        border-radius: 0;
        border-radius: rem(6px);
    }
}

</style>
