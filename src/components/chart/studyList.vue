<template>
    <div class='popup-warp'>
        <van-popup
            v-model:show='showList'
            class='popup'
            :close-on-click-overlay='true'
            closeable
            :get-container='getContainer'
            round
            :style="{ width: $isPC ? '570px' : '90%' }"
            @click-close-icon='onClose'
            @closed='closed'
        >
            <div class='p-5'>
                <div class='text-base font-bold mb-5'>
                    {{ $t('chart.mainStudy') }}
                </div>
                <!-- :style="{ 'font-size': (1/item.label.length/6) + 24/75+'rem' }" -->
                <div class='list'>
                    <span
                        v-for='(item, i) in MAINSTUDIES'
                        :key='i'
                        class='item'
                        :class='{ active: mainStudy === item.name }'
                        @click="onClick('main', item.name)"
                    >
                        {{ item.label }}
                    </span>
                </div>

                <div class='text-base font-bold mb-5 mt-5'>
                    {{ $t('chart.subStudy') }}
                </div>
                <div class='list'>
                    <span
                        v-for='(item, i) in substudies'
                        :key='i'
                        class='item'
                        :class='{ active: subStudy === item.name }'
                        @click="onClick('sub', item.name)"
                    >
                        {{ item.label }}
                    </span>
                </div>

                <van-button block class='mt-5' type='primary' @click='onSubmit'>
                    {{ $t('confirm') }}
                </van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { MAINSTUDIES, SUBSTUDIES } from '@/components/tradingview/datafeeds/userConfig/config'
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        propMainStudy: {
            type: String,
            default: '',
        },
        propSubStudy: {
            type: String,
            default: '',
        },
        product: {
            type: Object,
        },
    },
    data () {
        return {
            MAINSTUDIES,
            SUBSTUDIES,
            list: [],
            mainStudy: '',
            subStudy: '',
            showList: false,
        }
    },
    computed: {
        substudies () {
            return !this.product.isCryptocurrency ? SUBSTUDIES.filter(item => item.name !== 'Volume') : SUBSTUDIES
        }
    },
    watch: {
        show (val) {
            this.showList = val
        },
        propMainStudy: {
            immediate: true,
            handler (val) {
                const study = this.MAINSTUDIES.find((e) => e.name === val)
                this.mainStudy = study ? val : null
            },
        },
        propSubStudy: {
            immediate: true,
            handler (val) {
                const study = this.SUBSTUDIES.find((e) => e.name === val)
                this.subStudy = study ? val : null
            },
        },
    },
    methods: {
        onSubmit () {
            this.$emit('updateStudy', [this.mainStudy, this.subStudy])
            this.onClose()
        },
        onClose () {
            this.$emit('update:show', false)
        },
        closed () {
            this.mainStudy = this.propMainStudy
            this.subStudy = this.propSubStudy
            this.$emit('update:show', false)
        },
        onClick (type, name) {
            switch (type) {
                case 'main': {
                    this.mainStudy = this.mainStudy === name ? '' : name
                    break
                }
                case 'sub': {
                    this.subStudy = this.subStudy === name ? '' : name
                    break
                }
            }
        },
        getContainer () {
            return document.body
        },
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.popup-warp {
    :deep(.van-popup) {
        .list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            .item {
                margin-right: 16px;
                margin-bottom: 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 32px;
                width: 90px;
                box-sizing: border-box;
                color: var(--color);
                font-weight: normal;
                text-align: center;
                border: 1px solid var(--lineColor);
                border-radius: 4px;
                transition: all 0.2s ease 0s;
                &:hover {
                    border-color: var(--primary);
                }
                &.active {
                    color: #fff;
                    background: var(--primary);
                    border-color: var(--primary);
                }
            }
        }
    }
}
</style>
