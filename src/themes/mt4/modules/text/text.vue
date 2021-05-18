<template>
    <div class='textWrapper' :style='styleObject'>
        {{ content || "这里是模块默认内容" }}
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: {
                content: '',
                color: '',
                fontSize: '',
            }
        },
    },
    computed: {
        styleObject () {
            const data = this.data
            return Object.assign({}, data.styleObj, {
                color: data.color,
                fontSize: data.fontSize,
                textAlign: data.textAlign,
            })
        },
        content () {
            return this.matchVar(this.data.content)
        }
    },
    methods: {
        matchVar (content = '') {
            const reg = /\{\{(\w+)\}\}/
            const getters = this.$store.getters
            if (content && content.trim().match(reg)) {
                const res = content.trim().replace(reg, (match, f1) => {
                    return getters[f1] ?? ''
                })
                console.log('matchVar', res)
                return res
            } else {
                return content
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.textWrapper {
    min-height: 10px;
}
</style>
