<template>
    <div ref='wrapper' :style='data.styleObj'>
        <van-cell-group class='cellGroup'>
            <van-cell
                v-for='(item, key) in cellList'
                :key='key'
                class='cellItem'
                :is-link='item.isLink'
                :title='item.title'
                value=''
                @click='open(item)'
            >
                <template #icon>
                    <img
                        v-if='item.icon'
                        alt=''
                        class='icon'
                        height='20'
                        :src='item.icon'
                        width='20'
                    />
                </template>
                <template #label>
                    <span v-if='item.describe'>
                        {{ item.describe }}
                    </span>
                </template>
                <template #value>
                    <van-tag v-if='item.value' round :type='item.valueStyle'>
                        <template>
                            <span v-if='!h5Preview && item.dataKey'>
                                {{ $store.getters[item.dataKey] }}
                            </span>
                            <span v-else-if='item.value'>
                                {{ item.value }}
                            </span>
                        </template>
                    </van-tag>
                </template>
            </van-cell>
        </van-cell-group>
        <slot></slot>
    </div>
</template>

<script>

export default {
    props: {
        data: {
            type: Object,
            default: () => ({
                href: '',
                src: '',
                target: '',
            })
        },
    },
    data () {
        return {
            placeholder: '',
            fccInfoFlow: {}
        }
    },
    computed: {
        cellList () {
            return this.data.items.map(el => {
                let dataKey = null
                const reg = /\{\{(\w+)\}\}/
                if (el.value && el.value.trim().match(reg)) {
                    dataKey = el.value.trim().match(reg)[1]
                }
                return Object.assign({}, el, { dataKey })
            })
        }
    },
    methods: {
        open (item) {
            this.$router.push(item.href)
        }
    },
}
</script>

<style lang="scss"
       scoped>
.title {
    padding: 10px 20px;
    font-size: 14px;
    line-height: 1;
}
.icon {
    margin-top: 3px;
    margin-right: 5px;
}
.cellGroup,
.cellItem {
    background: none;
}
:deep(.van-tag--none) {
    color: #969799;
}
:deep(.van-cell__label:empty) {
    display: none;
}
</style>
