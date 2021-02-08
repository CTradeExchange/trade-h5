<template>
    <div class='topAccount' @click='show'>
        <span class='curLevel'>D</span>
        <span class='curNo'>3102816</span>
        <i class='arrowDown'></i>
    </div>
    <van-action-sheet v-model:show='visible' :actions='actions' cancel-text='取消' teleport='body' @select='hide' />
</template>

<script>
export default {
    data () {
        return {
            visible: false,
            actions: [
                { name: '选项一' },
                { name: '选项一' },
                { name: '选项一' },
            ]
        }
    },
    methods: {
        show () {
            this.visible = true
        },
        hide () {
            this.visible = false
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.topAccount {
    position: relative;
    display: flex;
    align-items: center;
    margin-left: 1em;
    .curLevel {
        padding: rem(6px) rem(10px);
        font-size: rem(28px);
        line-height: 1;
        text-align: center;
        border: 1px solid var(--white);
        border-radius: rem(5px);
    }
    .curNo {
        margin-left: 1em;
        font-size: rem(32px);
    }
    .arrowDown {
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 1em;
        border: 5px solid var(--white);
        border-color: var(--white) transparent transparent transparent;
        border-width: 6px 6px 0;
        border-radius: 3px;
    }
}
</style>
