<template>
    <div class='search-history'>
        <div class='search-title'>
            <span>{{ $t('signal.search.history') }}</span>
            <van-icon name='delete-o' :size='18' @click='onDelete' />
        </div>
        <div v-if='searchHistory.length === 0' class='search-none'>
            {{ $t('signal.search.noData') }}
        </div>
        <div v-else class='search-list'>
            <div v-for='(item, index) in searchHistory' :key='index' class='item' @click='onItem(item)'>
                <van-icon name='clock-o' :size='16' />
                <span>{{ item }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'

export default {
    setup (props, { emit }) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        // 搜索历史数据
        const searchHistory = computed(() => {
            return store.state._user.searchHistory
        })
        // 删除历史搜索
        const onDelete = () => {
            Dialog.confirm({
                message: t('signal.search.confirmDel'),
            }).then(() => {
                store.commit('_user/Update_SearchHistory', [])
            })
        }

        // 点击搜索项
        const onItem = (value) => {
            emit('search', value)
        }

        return {
            searchHistory,
            onDelete,
            onItem
        }
    }
}
</script>

<style lang="scss" scoped>
.search-history {
    min-height: rem(300px);
    margin-top: rem(32px);
    font-size: rem(28px);
    display: flex;
    flex-direction: column;
    .search-title {
        border-bottom-color: var(--lineColor);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: rem(24px);
        border-bottom-style: solid;
        border-bottom-width: 1px;
        span {
            color: var(--minorColor);
        }
        .van-icon {
            cursor: pointer;
        }
    }
    .search-none {
        color: var(--minorColor);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: rem(24px) 0;
        flex: 1;
    }
    .search-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: rem(32px);
        .item {
            display: inline-flex;
            align-items: center;
            width: 50%;
            margin-bottom: rem(32px);
            cursor: pointer;
            .van-icon-clock-o {
                margin-top: -2px;
            }
            span {
                color: var(--color);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                flex: 1;
                margin-left: rem(8px);
                margin-right: rem(16px);
            }
        }
    }
}
</style>
