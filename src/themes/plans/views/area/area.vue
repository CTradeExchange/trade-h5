<template>
    <div>
        <LayoutTop :title='$t("common.area")' />
        <Loading :show='loading' />
        <div class='page-wrapper'>
            <div class='top-search'></div>
            <div class='check-group'>
                <div v-for='(item,i) in countryList' :key='item.CountryCode' class='check-item'>
                    <div v-if='isShowTag(i)' class='char'>
                        <span>{{ item.nameEn.slice(0,1) }}</span>
                    </div>
                    <div :class="['item-content',isShowTag(i) && 'first']" @click='handleConfirmCountry(item)'>
                        <span>{{ item.name }}</span>
                        <img class='check-icon' :src='item.code===countryCode?checkedIcon:unCheckedIcon' />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { updateCountry } from '@/api/user'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import checkedIcon from '../../images/checked.png'
import unCheckedIcon from '../../images/unChecked.png'
export default {
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { back, nickname, avatar, inviteCode, countryCode } = route.params || {}
        const state = reactive({
            list: null,
            countryCode,
            loading: false
        })

        const srotArray = (x, y) => {
            const collator = new Intl.Collator('en')
            return collator.compare(x.nameEn, y.nameEn)
        }
        const countryList = computed(() => (store.state.countryList || []).sort(srotArray))

        const isShowTag = (i) => {
            if (i === 0) return true
            return countryList.value[i]?.nameEn.slice(0, 1).toLowerCase() !== countryList.value[i - 1]?.nameEn.slice(0, 1).toLowerCase()
        }

        const handleConfirmCountry = (item) => {
            state.countryCode = item.code
            if (back === 'Authentication') {
                state.loading = true
                updateCountry({ newCountry: item.code }).then(res => {
                    store.dispatch('_user/UpdateCustomerInfo')
                    Toast(t('common.submitSuccess'))
                    router.push({ name: back, params: { countryCode: state.countryCode, isBack: true } })
                }).catch(() => state.loading = false)
                return
            }
            router.push({ name: back, params: { countryCode: state.countryCode, nickname, avatar, inviteCode, isBack: true } })
        }

        return {
            countryList,
            handleConfirmCountry,
            isShowTag,
            checkedIcon,
            unCheckedIcon,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.check-group{

    .check-item{
        color:var(--color50);
        .char{
            height: rem(60px);
            display: flex;
            align-items: center;
            padding: 0 rem(20px);
            font-size:rem(28px)
        }

        .item-content{
            background: var(--contentColor);
            border-top:1px solid var(--lineColor);
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: rem(84px);
            padding: 0 rem(20px);
            font-size: rem(32px);
            &.first{
                border-top:none;
            }
            .check-icon{
                width:rem(36px);
                height: rem(36px);
            }
        }
    }
}
</style>
