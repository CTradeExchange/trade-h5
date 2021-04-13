<template>
    <Top back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <div class='list'>
            <div v-for='(item,index) in bankList' :key='index' class='bank-item' :class="item.bankCode+'_BG'">
                {{ item.bankName }}
                {{ item.bankCardNumber }}
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { toRefs, reactive, ref, onBeforeMount } from 'vue'
import { queryBankList } from '@/api/user'
import { isEmpty } from '@/utils/util'
import { Toast, Dialog } from 'vant'
export default {
    components: {
        Top
    },
    setup (props) {
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

        onBeforeMount(() => {
            getBankList()
        })
        return {
            getBankList,
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
            &.ICBC_BG{

            }
        }
    }
}
</style>
