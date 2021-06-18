<template>
    <van-tabs
        v-model:active='active'
        :background='background'
        :border='border'
        class='tabs'
        :color='color'
        :ellipsis='false'
        line-width='30'
        :title-active-color='titleActiveColor'
        :title-inactive-color='titleInactiveColor'
        :type='type'
        @change='updataActive'
    >
        <van-tab v-for='(item, index) in list' :key='index' class='tab'>
            <template #title>
                <div class='title' @click="$emit('tabClick',item,index)">
                    <i v-if='item.icon' class='icon' :class='item.icon' :style="{ 'color':item.color }"></i>
                    <div class='text'>
                        {{ item.title }}
                    </div>
                    <div v-if='dot' class='dot'></div>
                </div>
            </template>
        </van-tab>
    </van-tabs>
</template>

<script>
export default {
    name: 'Tab',
    emits: ['update:modelValue', 'tabClick'],
    props: {
        type: {
            type: String,
            default: 'line'
        },
        background: {
            type: String,
            default: '#fff'
        },
        color: {
            type: String,
            default: '#477FD3'
        },
        titleActiveColor: {
            type: String,
            default: '#477FD3'
        },
        titleInactiveColor: {
            type: String,
            default: '#333'
        },
        border: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: function () {
                return []
            }
        },
        modelValue: {
            type: [String, Number],
            default: 0
        },
        dot: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            active: 0
        }
    },
    watch: {
        modelValue () {
            this.active = this.modelValue
        }
    },
    created () {
        this.active = this.modelValue
    },
    methods: {
        updataActive (data) {
            this.$emit('update:modelValue', data)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
:deep(.van-tab) {
    flex: none;
    padding: 0;
    text-align: left;
}
.dot {
    display: block;
    width: rem(10px);
    height: rem(10px);
    margin: 0 auto;
    margin-top: rem(-10px);
    background: var(--primary);
    border-radius: 50%;
    transform: scale(0);
    opacity: 0;
}
.van-tab--active {
    .text {
        animation: zoomText 0.26s ease normal forwards;
    }
    .dot {
        animation: zoomDot 0.26s ease normal forwards;
    }
}
.text {
    font-weight: 400;
    font-size: rem(26px);
    line-height: rem(90px);
}
.title {
    padding: 0 rem(20px);
    .icon {
        font-size: rem(24px);
        font-style: normal;
    }
}

@keyframes zoomText {
    0% {
        font-weight: 400;
        font-size: rem(24px);
    }
    100% {
        font-weight: 700;
        font-size: rem(40px);
    }
}

@keyframes zoomDot {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>

<style lang="scss">
</style>
