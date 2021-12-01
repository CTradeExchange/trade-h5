<template>
    <div ref='wrapper' :style='data.styleObj'>
        <van-cell-group class='cellGroup'>
            <van-cell
                v-for='(item, key) in cellList'
                :key='key'
                class='cellItem'
                :is-link='item.isLink'
                :title='item.title'
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
                        <span v-if='!h5Preview && item.dataKey'>
                            {{ $store.getters[item.dataKey] }}
                        </span>
                        <span v-else-if='item.value'>
                            {{ item.value }}
                        </span>
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
        userAccountType () {
            return this.$store.getters['_user/userAccountType']
        },
        cellList () {
            const userAccountType = this.userAccountType
            const list = this.data.items
            if (this.h5Preview || this.data.accountType.includes(userAccountType)) {
                return list.map(el => {
                    let dataKey = null
                    const reg = /\{\{(\w+)\}\}/
                    if (el.value && el.value.trim().match(reg)) {
                        dataKey = el.value.trim().match(reg)[1]
                    }
                    return Object.assign({}, el, { dataKey })
                })
            }
            return []
        }
    },
    methods: {
        open (item) {
            const toRoute = item.href
            if (toRoute.name === 'Nest') {
                toRoute.params.type = 'otherPage'
                this.$router.push(toRoute)
            } else {
                this.$router.push({ name: toRoute.name })
            }
        },

    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.title {
    padding: 10px 20px;
    font-size: 14px;
    line-height: 1;
    vertical-align: middle;;
}
.icon {
    display: inline-block;
    margin-right: rem(44px);
    vertical-align: middle;
    //font-size: rem(32px);
    width: rem(64px);
    height: rem(64px);
}
.cellGroup{
    .cellItem {
        font-size: rem(32px);
        font-weight: bold;
        line-height: rem(120px);
        height: rem(120px);
        background: var(--contentColor);
        border-top: solid rem(10px) var(--bgColor);
        //background: none;
        display: flex;
        align-items: center;
        //margin-top: rem(10px);
        &::after{
            border: none;
        }

}
}

:deep(.van-tag--none) {
    color: #969799;
}
:deep(.van-cell__label:empty) {
    display: none;
}

</style>
