<template>
    <div class='imgsg' :style='data.styleObj'>
        <a v-if='data.href' href='javascript:;' @click="$emit('openurl',data)">
            <img alt='' class='img' :src='data.src || placeholder' />
        </a>
        <img v-else alt='' class='img' :src='data.src || placeholder' />
        <slot></slot>
    </div>
</template>

<script>
const placeholder = require('./placeholder.png')
export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
                }
            }
        },
    },
    data () {
        return {
            placeholder: placeholder
        }
    },
}
</script>

<style lang="scss" >
.imgsg {
    position: relative;
    overflow: hidden;
    a {
        display: block;
    }
    &::before {
        position: absolute;
        width: 5px;
        height: 100%;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);
        transform: rotate(30deg) scaleY(2);
        content: '';
    }
    .img {
        display: block;
        width: 100%;
    }
}
</style>
