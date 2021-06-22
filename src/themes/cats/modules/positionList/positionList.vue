<template>
    <div class='position-wrap'>
        <positionItem v-for='item in positionList' :key='item' :data='item' />
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import positionItem from './positionItem'
export default {
    components: {
        positionItem
    },
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({

        })

        const positionList = computed(() => store.state._trade.positionList)

        return {
            ...toRefs(state),
            positionList,

        }
    }
}
</script>
