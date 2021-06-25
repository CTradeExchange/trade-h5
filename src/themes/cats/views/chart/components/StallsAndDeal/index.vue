<template>
    <div class='stallsAndDeal' :class='isPC && "pcCls"'>
        9999
        <Mobile
            v-if='!isPC'
            :buy-list='buyList'
            :deal-data='dealData'
            :sell-list='sellList'
            :status='status'
            :sums='sums'
            :volume-ratio-for-sell='volumeRatioForSell'
        >
            <template #myPositions>
                <slot name='myPositions'></slot>
            </template>
        </Mobile>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Mobile from './components/Mobile'
import { toFixed } from '@/utils/calculation'

export default {
    name: 'StallsAndDeal',
    components: {
        Mobile
    },
    props: {
        status: {
            type: Object,
            default: () => ({
                stalls: false,
                deal: false
            })
        },
        stallsStr: {
            type: String,
            default: ''
        },
        dealStr: {
            type: String,
            default: ''
        },
        productId: {
            type: [String, Number],
            default: ''
        },
        digit: {
            type: Number,
            default: 2
        },
        curPrice: {
            type: Number,
            default: 0
        },
        marketId: {
            type: [String, Number],
            default: ''
        }
    },
    data () {
        return {
            tabActive: 'stalls',
            dealData: [],
            tempDealData: [],
            isDealDelaying: false,
            timer: 0
        }
    },
    computed: {
        ...mapGetters(['style']),
        stallsData () {
            if (!this.status.stalls) {
                return []
            }
            const list = this.getData(this.stallsStr).map(item => {
                item[0] = (item[0] * 1).toFixed(this.digit)
                item[1] = (item[1] * 1).toFixed(this.digit)
                if (this.marketId === 13) {
                    item[2] = item[2] / 10000
                    item[3] = item[3] / 10000
                }
                return item
            })

            const temp = []
            list.forEach(e => {
                temp.push(e[2], e[3])
            })
            if (temp.length) {
                const maxValue = Math.max(...temp)
                const minValue = Math.min(...temp)
                const diff = maxValue - minValue
                list.forEach(e => {
                    e.width = {
                        buy: (e[2] - minValue) / diff * 56 + '%',
                        sell: (e[3] - minValue) / diff * 56 + '%',
                    }
                })
            }

            return list
        },
        sellList () {
            // const result = []
            // this.stallsData.forEach((item, i, arr) => {
            //     result.push(arr[arr.length - i - 1])
            // })
            // return result
            return this.stallsData
        },
        buyList () {
            return this.stallsData
        },
        isPC () {
            return window['isPC']
        },
        // values () {
        //     const arr = []
        //     this.stallsData.forEach(e => {
        //         arr.push(e[2], e[3])
        //     })
        //     return arr
        // },
        // maxValue () {
        //     return Math.max(...this.values)
        // },
        // minValue () {
        //     return Math.min(...this.values)
        // },
        sums () {
            return {
                sell: this.sellList.reduce((total, item) => total + item[3], 0),
                buy: this.buyList.reduce((total, item) => total + item[2], 0),
            }
        },
        // 成交量比
        volumeRatioForSell () {
            return this.sums.sell / (this.sums.sell + this.sums.buy) * 100
        }
    },
    watch: {
        productId: {
            immediate: true,
            handler (val, oldval) {
                if (oldval) {
                    clearTimeout(this.timer)
                    this.dealData = []
                    this.tempDealData = []
                }
            }
        },
        // dealStr: {
        //     immediate: true,
        //     handler (val) {
        //         if (!this.status.deal) {
        //             return
        //         }
        //         let color = ''
        //         const newList = this.getData(val).map(item => {
        //             item[2] = toFixed(item[2], this.digit)
        //             if (item[5] > 0) {
        //                 color = [this.style.riseColor, this.style.fallColor][item[5] - 1]
        //             }
        //             item.color = color
        //             return item
        //         })
        //         // const totalLen = this.tempDealData.length + newList.length
        //         // this.tempDealData.splice(0, totalLen - 20)
        //         this.tempDealData.push(...newList)
        //     }
        // },
        tempDealData: {
            deep: true,
            immediate: true,
            handler (val, old) {
                if (!val.length) {
                    this.isDealDelaying = false
                }

                if (val.length && !this.isDealDelaying) {
                    this.isDealDelaying = true
                    this.delayMounted()
                    // console.log(val.length, 'delayMounted')
                }
            }
        },

        curPrice (price, oldPrice) {
            const newList = []
            const len = this.genRandomLen()
            while (newList.length < len) {
                const time = Date.now()
                const volume = this.genRandomVolume()
                newList.unshift([793065, time, price, volume, 2, 1])
            }
            if (newList.length && price && oldPrice) {
                if (price * 1 !== oldPrice * 1) {
                    if (price * 1 > oldPrice * 1) {
                        newList[newList.length - 1].colorCls = 'riseColor'
                    } else {
                        newList[newList.length - 1].colorCls = 'fallColor'
                    }
                }
            }

            this.tempDealData.unshift(...newList)
        }
    },
    methods: {
        getData (str) {
            const result = []
            try {
                str && result.push(...JSON.parse('[' + str + ']'))
            } catch (error) {
                console.log('error: ', error)
            }
            return result
        },
        delayMounted (time = 100) {
            requestAnimationFrame(() => {
                if (!this.tempDealData.length) {
                    return
                }
                // if (this.tempDealData.length > 100) {
                //     this.tempDealData.splice(0, this.tempDealData.length - 60)
                // }
                this.tempDealData.splice(20)
                if (this.dealData.length > 20) {
                    this.dealData.pop()
                }
                this.dealData.unshift(this.tempDealData.splice(this.tempDealData.length - 1, 1)[0])

                this.timer = setTimeout(() => {
                    this.delayMounted(100 / this.tempDealData.length)
                }, time)
            })
        },
        // 生成随机长度，大于0
        genRandomLen () {
            // 笔数=【1，5】随机
            const random = Math.random()
            let range = []
            if (random < 0.7) {
                // 3条概率
                range = [0, 3]
            } else {
                // 5条概率
                range = [3, 2]
            }

            let len = range[0] + Math.random() * range[1]
            while (!len) {
                len = range[0] + Math.random() * range[1]
            }

            return len
        },
        // 生成随机成交量，大于0
        genRandomVolume () {
            const random = Math.random()
            let range = []
            if (random < 0.7) {
                range = [0, 3]
            } else {
                range = [3, 10]
            }
            // BTC产品 数量=【0，30】随机，保留3位小数
            // ETH产品 数量=【0，100】随机，保留3位小数
            let volume = range[0] + Math.random() * range[1]
            while (!volume) {
                volume = range[0] + Math.random() * range[1]
            }
            volume = volume.toFixed(3)

            return volume
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.stallsAndDeal {
    min-width: rem(200px);
    height: rem(890px);
    margin-top: rem(10px);
    margin-bottom: rem(30px);
    border-top: 1px solid #ECEDF2;
    border-right: 1px solid #ECEDF2;
    &.pcCls {
        min-width: auto;
    }
}
</style>
