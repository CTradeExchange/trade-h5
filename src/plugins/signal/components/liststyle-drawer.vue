<template>
    <van-popup
        v-model:show='visible'
        class='filter-drawer'
        position='bottom'
    >
        <div class='drawer-title'>
            <span>{{ $t("signal.changeListStyle") }}</span>
            <van-icon name='cross' size='18' @click='close' />
        </div>
        <div class='drawer-container'>
            <div class='drawer-content'>
                <div class='drawer-item' @click='handleSelect(0)'>
                    <div class='drawer-img'>
                        <img
                            class='img'
                            :src="`/images/signal/block-style${currentTheme === 'light'? '-w': ''}.png?v=123`"
                        />
                    </div>
                    <van-icon
                        :class='listStyle === 0 ? "icon-selected": ""'
                        :name='listStyle === 0 ? "checked" : "circle"'
                        :size='20'
                    />
                </div>
                <div class='drawer-item' @click='handleSelect(1)'>
                    <div class='drawer-img'>
                        <img
                            class='img'
                            :src="`/images/signal/list-style${currentTheme === 'light'? '-w': ''}.png?v=123`"
                        />
                    </div>
                    <van-icon
                        :class='listStyle === 1 ? "icon-selected": ""'
                        :name='listStyle === 1 ? "checked" : "circle"'
                        :size='20'
                    />
                </div>
            </div>
            <div class='drawer-handle'>
                <button class='confirm' @click='onConfirm'>
                    {{ $t('signal.common.apply') }}
                </button>
            </div>
        </div>
    </van-popup>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
    setup () {
        const store = useStore()
        const listStyle = ref(0)
        const visible = ref(false)

        watch(() => store.state._signal.listStyle, (newValue) => {
            listStyle.value = newValue
        }, { immediate: true })

        const currentTheme = computed(() => {
            return store.state.theme
        })

        // 打开弹窗
        const open = (data) => {
            visible.value = true
        }

        // 关闭弹窗
        const close = () => {
            visible.value = false
        }

        const onConfirm = () => {
            store.commit('_signal/Update_listStyle', listStyle.value)
            close()
        }

        const handleSelect = (data) => {
            listStyle.value = data
        }
        return {
            visible,
            listStyle,
            currentTheme,
            open,
            close,
            onConfirm,
            handleSelect
        }
    }
}
</script>

<style lang="scss" scoped>

.drawer-title {
    text-align: center;
    padding: rem(32px) 0 rem(20px) 0;
    font-size: rem(34px);
    color: var(--color);
    position: relative;
    .van-icon-cross {
        position: absolute;
        right: rem(30px);
    }
}
.drawer-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    background: var(--contentColor);
}
.drawer-content {
    flex: 1;
    display: flex;
    .drawer-item {
        flex: 1;
        text-align: center;
        margin: rem(40px) rem(24px);
        .drawer-img {
            .img {
                width: 100%;
            }
        }
        .icon-selected {
            color: var(--primary);
        }
    }
}
.drawer-block {
    padding: 0 rem(30px);
    margin-top: rem(24px);
    .drawer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: rem(80px);
        .name {
            font-size: rem(26px);
        }
        .arrow {
            color: var(--minorColor);
            margin-right: rem(-6px);
            font-size: rem(34px);
            transition: all cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
        }
    }
    .drawer-classify {
        overflow: hidden;
    }
    &.drawer-block-show {
        .drawer-classify {
            transition: all 0.25s;
            max-height: rem(600px);
        }
    }
    &.drawer-block-hide {
        .drawer-classify {
            transition: all 0.1s;
            max-height: 0;
        }
        &::v-deep {
            .arrow {
                transform: rotate(180deg);
            }
        }
    }
}
.drawer-handle {
    display: flex;
    justify-content: space-between;
    padding: 0 rem(30px);
    margin: rem(24px) 0 rem(48px);
    button {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        height: rem(80px);
        border-radius: 4px;
        &.confirm {
            background: var(--primary);
            color: #FFF;
        }
    }
}
</style>
