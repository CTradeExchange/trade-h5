//
<template>
    <div class='page-wrap'>
        <!-- <LayoutTop :back='true' /> -->
        <Top absolute back left-icon='arrow-left' :right-action='false' show-center>
            <template #left>
                <a class='topBack' href='javascript:;' @click='goBackList'>
                    <span class='icon_icon_close_big'></span>
                </a>
            </template>
        </Top>
        <div class='formBox'>
            <div class='page-wrap'>
                <div class='create-tips'>
                    {{ $t('api.createTips') }}
                </div>
                <div class='sub-title'>
                    {{ $t('api.createSubTit1') }}
                </div>
                <van-row>
                    <van-col class='item-left txtWrap' span='20'>
                        {{ backData.apiKey }}
                    </van-col>
                    <van-col align='right' class='item-right' span='4'>
                        <!-- <i class='icon_fuzhi copy-btn' :data-clipboard-text='backData.apiKey' @click='copyCustomerNo'></i> -->
                        <van-icon class='copy-btn' :data-clipboard-text='backData.apiKey' name='description' :title="$t('compLang.copy')" @click='copyCustomerNo' />
                    </van-col>
                </van-row>
                <div class='sub-title'>
                    {{ $t('api.createSubTit2') }}
                </div>
                <van-row>
                    <van-col class='item-left txtWrap' span='20'>
                        {{ backData.privateKey }}
                    </van-col>
                    <van-col align='right' class='item-right' span='4'>
                        <!-- <i class='icon_fuzhi copy-btn' :data-clipboard-text='backData.privateKey' @click='copyCustomerNo'></i> -->
                        <van-icon class='copy-btn' :data-clipboard-text='backData.privateKey' name='description' :title="$t('compLang.copy')" @click='copyCustomerNo' />
                    </van-col>
                </van-row>
                <div class='sub-title'>
                    {{ $t('api.createSubTit3') }}
                </div>
                <div class='backContent'>
                    <span v-for='(item,i) in backData.permissionDTOList' :key='i' class='perItem'>
                        <span v-if='item.status == 1'>
                            {{ item.name }}
                        </span>
                    </span>
                </div>
                <div class='sub-title'>
                    {{ $t('api.createSubTit4') }}
                </div>
                <div class='backContent'>
                    {{ backData.whiteIps }}
                </div>
                <div class='sub-title col-black'>
                    {{ $t('api.createSubTit5') }}
                </div>
                <div class='sub-createTipsTxt' v-html="$t('api.createTipsTxt')">
                </div>

                <van-button block class='confirm-btn' type='primary' @click='handleApi'>
                    <span>{{ $t('compLang.confirm') }}</span>
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@/components/top'
import { onBeforeMount, computed, reactive, watch, toRefs, ref, inject } from 'vue'
import { Dialog, Toast } from 'vant'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { createCustomerApi } from '@/api/user'
import Clipboard from 'clipboard'

export default {
    components: {
        Top
    },
    props: ['popShow', 'currency', 'googleSafetyData'],
    setup (props, context) {
        const store = useStore()
        // const accountList = computed(() => {
        //     return store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(props.tradeType))
        // })
        const style = computed(() => store.state.style)
        const state = reactive({
            ggSafetyPopupShow: props.popShow,
            curCurrency: props.currency,
            loading: false,
            params: {},
            isCreateOk: false, // 是否创建成功
            backData: { // 创建成功后返回数据
                apiKey: '',
                privateKey: '',
                permissionList: [],
                whiteIps: ''
            },
            googleSafetyData: {},
            googleCode: '', // 谷歌验证码
            phoneCode: '', // 手机验证码
            sendTokenSMS: '', // 手机验证码发送票据
            emailCode: '', // 邮箱验证码
            sendTokenEmail: '', // 邮箱验证码发送票据
        })

        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const { id } = route.query

        watch(() => state.ggSafetyPopupShow, val => {
            context.emit('update:ggSafetyPopupShow', val)
        })

        const close = () => {
            context.emit('update:popShow', false)
        }
        const bgColor = style.value.primary + '0D'
        const googleVerifyCodeRef = ref(null)
        const customerInfo = computed(() => store.state._user.customerInfo)

        const isReLoad = inject('isReLoad')

        const goBackList = () => {
            router.push({ path: '/api', query: { reload: true } })
        }

        const handleApi = () => {
            isReLoad(true)
            router.push({ path: '/api', query: { reload: true } })
        }

        const getQuery = () => {
            state.params = route.query
            state.params.permissionDTOList = JSON.parse(route.query.permissionDTOList)
            state.backData = state.params
        }

        // 复制
        const copyCustomerNo = (value) => {
            var clipboard = new Clipboard('.copy-btn')
            clipboard.on('success', e => {
                Toast(t('common.copySuccess'))
                // 释放内存
                clipboard.destroy()
            })
        }

        onBeforeMount(() => {
            getQuery()
        })

        return {
            ...toRefs(state),
            goBackList,
            isReLoad,
            handleApi,
            close,
            copyCustomerNo,
            bgColor,
            customerInfo,
            googleVerifyCodeRef,
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-dialog{
    display: flex;
    flex-direction: column;
    height: 92%;
    overflow: hidden;
    background: var(--bgColor);
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: rem(37px) rem(30px) rem(50px);
        .header-title{
            font-size: rem(48px);
            font-weight: bold;
            color: var(--color);
        }
        .icon_guanbi{
            font-size: rem(30px);
            font-weight: bold;
        }
    }
}
</style>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';

.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(20px);
    overflow: auto;
    // background: var(--contentColor);
    :deep(.topNav .main) {
        max-width: 100%;
    }
    .formBox {
        margin: 50px 15px 15px 15px;
        .cell {
            margin-bottom: 10px;
        }
        .van-cell {
            padding: 0 0 0 10px;
        }
        .label {
            padding-bottom: 10px;
        }
    }

    .sub-title{
        padding: 5px 28px 5px 0px;
        color: var(--minorColor);
        font-size: 14;
        line-height: 24px;
    }
    .sub-title.col-black{
        color: var(--normalColor);
    }

    .create-tips{
        margin: 20px 0;
        font-size: 16px;
        color: var(--warn);
        line-height: 24px;
    }
    .sub-createTipsTxt{
        color: var(--minorColor);
        line-height: 24px;
    }
    .perItem{
        display: inline-block;
        margin-right: 10px;
        color: var(--normalColor);
        background-color: var(--assistColor);
        padding: 5px;
        line-height: 24px;
    }
    .txtWrap{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: auto;
        line-height: 24px;
        min-height: auto;
    }

    .confirm-btn{
        margin-top: 20px;
    }

}

</style>
