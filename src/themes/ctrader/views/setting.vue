<template>
    <div class='search'>
        <Top back><span>{{ $route.meta.title }}</span></Top>
        <div class='panel'>
            <p class='muted'>时区偏移</p>
            <div class='zoneSetR'>
                <div class='col of-1px-bottom' @click='utcListVisible = true'>
                    <i class='icon_xiala muted'></i>
                    <span>{{ utcList[utcIndex] && utcList[utcIndex]['name'] }}</span>
                </div>
                <p align='right' class='col muted'>{{ timeFormat }}</p>
            </div>

            <p class='muted mtop20'>语言</p>
            <div class='zoneSetR'>
                <div class='col of-1px-bottom' @click='langVisible = true'>
                    <i class='icon_xiala muted'></i>
                    <span>{{ langList[langIndex] && langList[langIndex]['name'] }}</span>
                </div>
            </div>
        </div>
        <van-action-sheet v-model:show='utcListVisible' :actions='utcList' @select='utcSelected' />
        <van-action-sheet v-model:show='langVisible' :actions='langList' cancel-text='取消' @select='langSelected' />
    </div>
</template>

<script>
import Top from '@ct/layout/top'
import dayjs from 'dayjs'
export default {
    components: {
        Top
    },
    data () {
        return {
            utcListVisible: false,
            zone: new Date().getTimezoneOffset(),
            utcIndex: 0,
            utcList: [],
            curTime: new Date(),
            langVisible: false,
            langIndex: 0,
            langList: [
                { name: '中文', val: 'zh-CN' },
                { name: 'English', val: 'en-US' },
            ],
        }
    },
    computed: {
        timeFormat () {
            return dayjs(this.curTime).format('YYYY-MM-DD HH:mm')
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            const start = -12 * 60
            this.utcList = new Array(53).fill('').map((el, i) => {
                const zone = (start + 30 * i)
                const t = zone / 60
                const h = t.toString().indexOf('.') > -1 ? t.toString().split('.')[0] : t.toString()
                const m = t.toString().indexOf('.') > -1 ? '30' : '00'
                if (zone === this.zone) this.utcIndex = i
                return {
                    name: `UTC ${h.startsWith('-') ? h : '+' + h}:${m}`,
                    zone: zone
                }
            })
        },
        utcSelected (item, i) {
            console.log(item, i)
            this.utcListVisible = false
            this.utcIndex = i
        },
        langSelected (item, i) {
            console.log(item, i)
            this.langVisible = false
            this.langIndex = i
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.search {
    height: 100%;
}
.panel {
    padding: rem(30px);
}
.zoneSetR {
    display: flex;
    margin-top: rem(20px);
    .col {
        flex: 1;
        padding-bottom: rem(10px);
    }
    .icon_xiala {
        float: right;
    }
}
</style>
