<template>
    <div class='watchlist-pages'>
        <Splitpanes class='default-theme' :dbl-click-splitter='false' horizontal>
            <Pane class='watchlist-page' :size='watchlistSize'>
                <watchlist />
            </Pane>
            <Pane class='watchlist-page' :size='watchListDetailSize'>
                <watchListDetail />
            </Pane>
        </Splitpanes>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import watchlist from './watchlist.vue'
import watchListDetail from './detail.vue'
import { localGet } from '@/utils/util'
import { useStore } from 'vuex'

export default {
    components: {
        Splitpanes,
        Pane,
        watchlist,
        watchListDetail,
    },
    setup () {
        const watchlistSize = ref(50)
        const watchListDetailSize = ref(50)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const store = useStore()

        const setPanesSize = () => {
            const paneHeight = document.querySelector('.splitpanes')
            if (paneHeight?.offsetHeight) {
                const clientHeight = paneHeight.offsetHeight - document.body.clientHeight
                watchListDetailSize.value = parseInt(((400 + clientHeight) / paneHeight?.offsetHeight) * 100)
                watchlistSize.value = 100 - watchListDetailSize.value
            }
        }

        onMounted(() => {
            // setPanesSize()
            if (!customerInfo.value) {
                const localSelfSymbolList = localGet('selfSymbolListStorage') ? JSON.parse(localGet('selfSymbolListStorage')) : []
                localSelfSymbolList.length && store.dispatch('_user/queryLocalCustomerOptionalList', localSelfSymbolList)
            }
        })

        return {
            watchListDetailSize,
            watchlistSize,
        }
    },
}
</script>

<style lang="scss" scoped>
.watchlist-pages {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .watchlist-page {
        display: flex;
        flex-direction: column;
        min-height: 55px;
    }
    :deep {
        .splitpanes__splitter {
            background-color: var(--bgColor);
            border: none;
        }
    }
}
</style>
