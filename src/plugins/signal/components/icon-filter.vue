<template>
    <popover
        class='icon-filter'
        :offset='offset'
        :placement='placement'
        :text='$t("signal.filter")'
        :touch-disabled='true'
    >
        <template #reference>
            <div class='tab-icon' @click='handleClick'>
                <van-icon name='filter-o' size='18' />
            </div>
        </template>
    </popover>
</template>

<script>
import popover from '@/components/popover'

export default {
    components: {
        popover
    },
    props: {
        offset: {
            type: Array,
            default: () => [0, 8],
        },
        placement: {
            type: String,
            default: 'top'
        }
    },
    emits: ['click'],
    setup (props, { emit }) {
        const handleClick = () => {
            emit('click')
        }
        return {
            handleClick
        }
    }
}
</script>
