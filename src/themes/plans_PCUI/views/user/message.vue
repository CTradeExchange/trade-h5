<template>
    <centerViewDialog id='messageId' class='messageClass'>
        <div class='page-wrap'>
            <Loading :show='loading' />
            <LayoutTop icon='icon_icon_close_big' />
            <msgView />
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import msgView from '../../layout/components/msg.vue'
export default {
    components: {
        centerViewDialog,
        msgView
    }
}
</script>
