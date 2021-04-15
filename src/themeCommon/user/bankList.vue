<template>
    <Top back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <div class='list'>
            <div v-for='(item,index) in bankList' :key='index' class='bank-item' :class="'BG_'+ item.bankCode">
                <div class='bi-head'>
                    <div class='icon-bank' :class="'BK_'+ item.bankCode">
                        <img alt='' :src="require('../../assets/bank_icon/BK_'+ item.bankCode+ '.png')" />
                    </div>
                    <span class='bank-name'>
                        {{ item.bankName }}
                    </span>
                </div>
                <p class='bank-no'>
                    {{ hideMiddle(item.bankCardNumber) }}
                </p>
                <div class='bank-bg'>
                    <img alt='' sizes='' :src="require('../../assets/bank_icon/BK_'+ item.bankCode+ '.png')" />
                </div>
            </div>
            <div class='add-wrap' @click='toAdd'>
                <van-icon name='plus' />
                <span class='btn-text'>
                    新增银行卡
                </span>
                <van-icon name='arrow' />
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { toRefs, reactive, ref, onBeforeMount } from 'vue'
import { queryBankList } from '@/api/user'
import { isEmpty } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import { Toast, Dialog } from 'vant'
export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const state = reactive({
            bankList: []
        })
        const getBankList = () => {
            console.log('banklist')
            const toast = Toast.loading({
                message: '加载中...',
                forbidClick: true,
            })
            queryBankList().then(res => {
                console.log(res)
                toast.clear()
                if (res.check()) {
                    if (res.data && res.data.length > 0) {
                        state.bankList = res.data
                    }
                }
            })
        }

        // 处理银行卡号显示
        const hideMiddle = (value) => {
            return `${value.substring(0, 0)} ${'*'.repeat(value.length - 4).replace(/(.{4})/g, '$1 ')}${value.length % 4 ? ' ' : ''}${value.slice(-4)}`
        }

        const toAdd = () => {
            router.push('/addBank')
        }

        onBeforeMount(() => {
            getBankList()
        })
        return {
            getBankList,
            hideMiddle,
            toAdd,
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
    .list {
        padding: rem(30px);
        .bank-item {
            position: relative;
            height: rem(210px);
            margin-bottom: rem(30px);
            padding: rem(30px);
            overflow: hidden;
            border-radius: rem(10px);
            &.BG_ICBC {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #EC4E56, #C92E36);
            }
            &.BG_ABC {
                background-color: #EC4E56;
                background-image: linear-gradient(to right, #58A8A1, #379A85);
            }
            .bank-bg {
                position: absolute;
                top: rem(90px);
                right: rem(30px);
                z-index: 1;
                opacity: 0.1;
                filter: grayscale(100%) brightness(1000%);
                img {
                    //filter: grayscale(1);
                }
            }
            .icon-bank {
                display: inline-block;
                width: rem(72px);
                height: rem(72px);
                margin-right: rem(22px);
                text-align: center;
                vertical-align: middle;
                background: #FFF;
                border-radius: 50%;
                img {
                    width: rem(52px);
                    height: rem(52px);
                    margin-top: rem(10px);
                }
            }
            .bank-name {
                color: #FFF;
                font-size: rem(28px);
            }
            .bank-no {
                position: relative;
                z-index: 2;
                margin-top: rem(20px);
                margin-left: rem(90px);
                color: #FFF;
                font-size: rem(50px);
            }
        }
        .add-wrap {
            display: flex;
            align-items: center;
            padding: rem(34px);
            border: solid 1px var(--bdColor);
            cursor: pointer;
            .van-icon-plus {
                margin-right: rem(10px);
            }
            .btn-text {
                flex: 1;
                color: var(--color);
                font-size: rem(28px);
            }
        }
    }
}
</style>
