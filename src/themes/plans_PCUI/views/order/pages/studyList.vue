<template>
    <van-popup
        v-model:show='showList'
        :close-on-click-overlay='true'
        closeable
        :get-container='getContainer'
        round
        :style="{ width: '520px' }"
        @click-close-icon='onClose'
        @closed='closed'
    >
        <div class='content'>
            <span class='type'>
                {{ $t('chart.mainStudy') }}
            </span>
            <!-- :style="{ 'font-size': (1/item.label.length/6) + 24/75+'rem' }" -->
            <div class='list'>
                <span
                    v-for='(item, i) in MAINSTUDIES'
                    :key='i'
                    class='item of-1px'
                    :class="{ 'active': mainStudy === item.name }"
                    :style="[{ 'font-size': item.label.length >=6 ? '0.28rem': '' } ]"
                    @click='onClick("main", item.name)'
                >
                    {{ item.label }}
                </span>
            </div>

            <span class='type'>
                {{ $t('chart.subStudy') }}
            </span>
            <div class='list'>
                <span
                    v-for='(item, i) in SUBSTUDIES'
                    :key='i'
                    class='item of-1px'
                    :class="{ 'active': subStudy === item.name }"
                    :style="[{ 'font-size': item.label.length >6 ? '0.28rem': '' } ]"
                    @click='onClick("sub", item.name)'
                >
                    {{ item.label }}
                </span>
                <span v-for='item in (5 - SUBSTUDIES.length %5)' :key='"other" + item' class='item of-1px' style='opacity: 0;'></span>
            </div>

            <div class='submit' @click='onSubmit'>
                {{ $t('confirm') }}
            </div>
        </div>
    </van-popup>
</template>

<script>
import { MAINSTUDIES, SUBSTUDIES } from '@/components/tradingview/datafeeds/userConfig/config'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        propMainStudy: {
            type: String,
            default: ''
        },
        propSubStudy: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            MAINSTUDIES,
            SUBSTUDIES,
            list: [],
            mainStudy: '',
            subStudy: '',
            showList: false
        }
    },
    watch: {
        show (val) {
            this.showList = val
        },
        propMainStudy: {
            immediate: true,
            handler (val) {
                const study = this.MAINSTUDIES.find(e => e.name === val)
                this.mainStudy = study ? val : null
            }
        },
        propSubStudy: {
            immediate: true,
            handler (val) {
                const study = this.SUBSTUDIES.find(e => e.name === val)
                this.subStudy = study ? val : null
            }
        }
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
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.van-popup {
    width: 90%;
    max-width: rem(736px);
    .content {
        display: flex;
        height: 100%;
        flex-direction: column;
        width: 100%;
        padding: rem(50px) 0 0;
        background-color: var(--bgColor);
        .type {
            margin: rem(10px) 0;
            padding: 0 rem(30px);
            font-size: rem(28px);
        }
        .list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            margin-bottom: rem(20px);
            padding: 15px 0;
            .item {
                cursor: pointer;
                padding: 10px 10px;
                flex: 0 0 rem(112px);
                box-sizing: border-box;
                margin: 6px 10px;
                color: var(--color);
                font-weight: normal;
                line-height: rem(40px);
                text-align: center;
                border: 1px solid var(--lineColor);
                &.active {
                    color: #FFF;
                    background: var(--primary);
                    border-color: var(--primary);
                }
            }
        }
        .submit {
            box-sizing: border-box;
            width: 90%;
            height: 35px;
            color: #FFF;
            line-height: 35px;
            text-align: center;
            background: var(--primary);
            margin: 10px auto;
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
</style>
