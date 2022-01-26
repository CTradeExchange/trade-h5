<template>
    <router-view />

    <div class='fund-container'>
        <div class='fund-content'>
            <div class='side'>
                <h2 class='title'>
                    {{ $t('fundManager.side.title') }}
                </h2>
                <div class='list'>
                    <ul>
                        <li
                            v-for='item in menus'
                            :key='item.value'
                            :class="{ 'active': active === item.value }"
                            @click='switchMenu(item)'
                        >
                            <i :class='item.icon'></i>
                            <span>{{ item.name }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 申购管理 -->
            <buy-module v-if="active === 'buy'" />
            <!-- 赎回管理 -->
            <ransom-module v-if="active === 'ransom'" />
            <!-- 下单执行标准 -->
            <standard-module v-if="active === 'standard'" />
        </div>
    </div>
</template>

<script setup>
import buyModule from './components/buy-module.vue'
import ransomModule from './components/ransom-module.vue'
import standardModule from './components/standard-module.vue'
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const store = useStore()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })

// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 基金经理专区菜单
const menus = ref([
    { name: t('fundManager.side.buy'), value: 'buy', icon: 'icon_xianhuojiaoyizhanghu' },
    { name: t('fundManager.side.ransom'), value: 'ransom', icon: 'icon_heyuezhucangzhanghu' },
    { name: t('fundManager.side.standard'), value: 'standard', icon: 'icon_heyuequancangzhanghu' }
])
// 当前选中 buy:申购管理 ransom:赎回管理 standard:下单执行标准
const active = ref('buy')
// 切换菜单
const switchMenu = (item) => {
    if (item.value !== active.value) {
        active.value = item.value
    }
}

onMounted(() => {
    // 不是基金账号跳转到首页
    if (customerInfo.value.isFund !== 1) {
        router.replace({ name: 'Home' })
    }
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fund-container {
    padding: 8px;
    background: var(--bgColor);
    .fund-content {
        display: flex;
        min-width: 1200px;
        min-height: 820px;
        .side {
            width: 256px;
            margin-right: 16px;
            flex-shrink: 0;
            background: var(--contentColor);
            border-radius: 10px;
            .title {
                @include font();
                padding: 30px;
                line-height: 1;
                font-size: 30px;
                font-weight: bold;
                color: var(--color);
            }
            .list {
                padding: 0 20px;
                li {
                    display: flex;
                    align-items: center;
                    height: 56px;
                    margin-bottom: 10px;
                    font-size: 14px;
                    color: var(--color);
                    background: var(--contentColor);
                    border-radius: 10px;
                    cursor: pointer;
                    i {
                        margin-left: 20px;
                        margin-right: 18px;
                        font-size: 18px;
                    }
                    &:hover {
                        color: var(--primary);
                    }
                }
                .active {
                    color: #fff;
                    background: var(--primary);
                    i {
                        color: #fff;
                    }
                    span {
                        color: #fff;
                    }
                }
            }
        }
    }
}
</style>
