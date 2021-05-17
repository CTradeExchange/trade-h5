<template>
    <div class='top'>
        <a v-if='menu' class='icon_caidan1' href='javascript:;' @click='$refs.leftMenu.visible=true'>
        </a>
        <a v-if='back' class='icon_fanhui' href='javascript:;' @click='backEvent'></a>

        <div class='title'>
            <slot name='center'>
                <template v-if='titleText && titleVis'>
                    <h2 v-if='titleText'>
                        {{ titleText }}
                    </h2>
                    <p v-if='subTitle' class='subTitle'>
                        {{ subTitle }}
                    </p>
                </template>
            </slot>
        </div>

        <slot name='left'></slot>
        <slot name='right'></slot>
        <!-- <topRight /> -->
    </div>

    <leftMenu ref='leftMenu' />
</template>

<script>
import topRight from './topRight'
import leftMenu from './leftMenu'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default {
    components: {
        topRight,
        leftMenu,
    },
    props: {
        menu: {
            type: Boolean,
            default: true
        },
        back: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        titleVis: {
            type: Boolean,
            default: true
        },
        subTitle: {
            type: String,
            default: ''
        },
    },
    setup (props, { emit, attrs }) {
        const router = useRouter()
        const route = useRoute()
        const titleText = computed(() => props.title || route.meta?.title)
        const backEvent = () => {
            attrs.onBackEvent ? emit('backEvent') : router.back()
        }
        return {
            titleText,
            backEvent
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.top {
    position: relative;
    display: flex;
    align-items: center;
    //justify-content: space-between;
    height: rem(90px);
    padding: 0 rem(30px);
    color: var(--white);
    background: var(--primary);
    .icon_caidan {
        color: var(--white);
        font-size: 1.2em;
    }
    .title {
        position: relative;
        flex: 1;
        margin-left: rem(20px);
        padding-left: rem(60px);
        line-height: 1.4;
        &::before {
            position: absolute;
            top: 50%;
            left: 0;
            width: rem(50px);
            height: rem(50px);
            margin-top: rem(-25px);
            background: url('~@m/images/logo.png') no-repeat;
            background-size: auto 100%;
            content: '';
        }
        h2 {
            font-size: rem(32px);
        }
        .subTitle {
            font-size: rem(24px);
        }
    }
    a {
        color: var(--white);
    }
}
</style>
