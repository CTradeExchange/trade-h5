<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()
const router = useRouter()
const id = route.query.id
const symbolCode = id?.split('_')?.[0]
const product = computed(() => store.getters['_signal/getSignalProduct'](symbolCode))

watch(
    () => product.value,
    (value) => {
        if (!value) return
        store.commit('_quote/Update_productActivedID', `${value.symbolId}_${value.tradeType}`)
        router.push({
            path: '/order',
            query: {
                tradeType: value.tradeType,
                symbolId: value?.symbolId,
            },
        })
    },
)
</script>
