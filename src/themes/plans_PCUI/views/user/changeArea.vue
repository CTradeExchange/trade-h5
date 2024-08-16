<template>
    <centerViewDialog :id='id'>
        <LayoutTop class='top' :custom-back='true' @back='handleBack' />
        <div class='page-wrapper'>
            <div class='container'>
                <div class='search-box'>
                    <el-select
                        v-model='countryCode'
                        class='search-select'
                        filterable
                        placeholder=''
                        reserve-keyword
                        suffix-icon='Search'
                    >
                        <el-option
                            v-for='item in countryList'
                            :key='item.name'
                            :label='item.name'
                            :value='item.code'
                        />
                    </el-select>
                </div>
                <div v-for='(values,key) in countryObj' :key='key' class='country-group'>
                    <div class='county-label'>
                        {{ key }}
                    </div>
                    <div class='country-list'>
                        <div v-for='(item,i) in values' :key='`${key}_${i}`' class='country-item'>
                            <div :class="['country-btn',item.code===countryCode && 'active']" @click='changeCountry(item)'>
                                <span>{{ item.name }}</span>
                                <img
                                    alt=''
                                    class='icon-country'
                                    :src='`${cdnUrl}/images/countries_flags/${item.code}.png`'
                                    srcset=''
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class='bottom-btn'>
                <div class='confirm-btn' @click='handleConfirm'>
                    <span>{{ $t('news.confirm') }}</span>
                </div>
            </div>
        </div>
    </centerViewDialog>
</template>

<script>

import centerViewDialog from '@planspc/layout/centerViewDialog'
import { reactive, toRefs, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sessionGet, sessionSet, isEmpty } from '@/utils/util'
import { updateCountry } from '@/api/user'
import { useI18n } from 'vue-i18n'
import { cdnUrl } from '@/config'
import { useStore } from 'vuex'
import { Toast } from 'vant'
export default {
    components: { centerViewDialog },
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        const state = reactive({
            userInfo: (sessionGet('newsUserInfo') && JSON.parse(sessionGet('newsUserInfo'))) || {},
            countryCode: ''
        })

        const countryList = computed(() => store.state.countryList)

        const countryObj = computed(() => {
            const obj = {}
            countryList.value.forEach(i => {
                const key = i.nameEn.slice(0, 1).toUpperCase()
                if (!obj[key]) obj[key] = []
                obj[key].push(i)
            })

            return obj
        })

        const changeCountry = (item) => {
            const { code } = item || {}
            state.countryCode = code
        }

        const handleConfirm = () => {
            if (state.userInfo.submit) {
                updateCountry({ newCountry: state.countryCode }).then(res => {
                    const { Code } = res || {}
                    if (Code === 1000) {
                        state.userInfo.Country = state.countryCode
                        sessionSet('newsUserInfo', JSON.stringify(Object.assign(state.userInfo, { isBack: true })))
                        Toast(t('common.submitSuccess'))
                    }
                    router.go(-1)
                    store.dispatch('_user/findCustomerInfo', false)
                })
                return
            }
            state.userInfo.Country = state.countryCode
            sessionSet('newsUserInfo', JSON.stringify(Object.assign(state.userInfo, { isBack: true })))
            router.go(-1)
        }

        const handleBack = () => {
            sessionSet('newsUserInfo', JSON.stringify(Object.assign(state.userInfo, { isBack: true })))
            router.go(-1)
        }

        watch(() => state.userInfo, (n) => {
            if (isEmpty(n)) return
            state.countryCode = n.Country
        }, { immediate: true })

        return {
            handleBack,
            handleConfirm,
            countryList,
            changeCountry,
            cdnUrl,
            countryObj,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.top{
    text-transform: capitalize;
}
.page-wrapper{
    flex:1;
    height: 0;
    display: flex;
    flex-direction: column;

    .container{
        flex:1;
        padding:0 40px;
        overflow-y:auto;
        @include scroll-bar-vertical;
    }
    .search-box{
        padding: 15px 0;
        border-bottom: 1px solid #d9d9d9;
    }
    .country-group{
        display:flex;
        border-bottom:1px solid #d9d9d9;
        padding:15px 0;

        .county-label{
            font-size: 20px;
            color:var(--mainColor);
            width:50px;
        }
        .country-list{
            display:flex;
            flex-wrap: wrap;
            margin:-7px;
            .country-item{
                padding: 7px;

                .country-btn{
                    display: flex;
                    height: 38px;
                    border-radius: 5px;
                    background: var(--bgColor);
                    color:var(--mainColor);
                    font-size: 16px;
                    align-items: center;
                    padding:0 10px;
                    cursor: pointer;
                    border:1px solid var(--bgColor);
                    &.active{
                        border:1px solid var(--primary);
                        color: var(--primary);
                    }
                    .icon-country{
                        width:28px;
                        height: 20px;
                        margin-left:30px;
                    }
                }
            }
        }
    }
    .bottom-btn{
        padding:30px 0;
        display: flex;
        justify-content: center;
        .confirm-btn{
            height: 40px;
            background: var(--primary);
            color:var(--contentColor);
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            width:282px;
            border-radius: 5px;
            cursor: pointer;
        }
    }
}
</style>
