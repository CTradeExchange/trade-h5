<template>
    <div class='event-item'>
        <el-image class='event-image' fit='cover' :src='item.CoverURL' />
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
    props: {
        item: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    setup (props) {
        const state = reactive({

        })
        return {
            ...toRefs(state)
        }
    }

}
</script>

<style>

</style>
