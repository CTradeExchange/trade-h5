<template>
    <el-popover
        :popper-style="{ borderRadius: '8px', padding: 0, border: 'none', width: '320px' }"
        :show-arrow='false'
        @hide='show = false'
        @show='show = true'
    >
        <template #reference>
            <img class='w-9 h-9 ml-4 cursor-pointer' :src='bellIcon' />
        </template>
        <template #default>
            <div class='mt-5 flex flex-col notice-container'>
                <div class='flex-1 notice-list'>
                    <van-skeleton v-if='loading && !list.length' class='mb-5' :row='3' title />
                    <van-list v-else v-model:loading='loading' :finished='finished' :finished-text="$t('common.noMore')" @load='onLoad'>
                        <div v-for='(item, index) in list' :key='index' class='border-bottom pb-4 mb-4 px-5'>
                            <div class='mb-4 text-base font-bold text-color'>
                                {{ item.title }}
                            </div>
                            <div class='mb-4 text-sm text-color'>
                                {{ computeHtmlTime(item.content) }}
                            </div>
                            <div class='text-xs text-minorColor'>
                                {{ formatTime(item.createTime) }}
                            </div>
                        </div>
                    </van-list>
                </div>
            </div>
        </template>
    </el-popover>
</template>

<script setup>
import { ref, watch } from 'vue'
import bellIcon from '../../images/topNav/notice.png'
import { queryPlatFormMessageLogList } from '@/api/user'
import { useI18n } from 'vue-i18n'
import { computeHtmlTime } from '@/utils/util'

const { locale } = useI18n()

const show = ref(false)
const loading = ref(true)
const list = ref([])
const finished = ref(false)
const current = ref(1)

const formatTime = (val) => {
    return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
}

// 获取消息列表
const getMsgList = (current) => {
    queryPlatFormMessageLogList({
        current,
        lang: locale.value,
        size: 20,
    })
        .then((res) => {
            if (res.check()) {
                if (res.data.records.length === 0) {
                    finished.value = true
                } else {
                    list.value = [...list.value, ...res.data.records]
                }
            }
        })
        .finally(() => {
            loading.value = false
        })
}

const onLoad = () => {
    current.value += 1
    getMsgList(current.value)
}

watch(
    () => show.value,
    () => {
        if (show.value) {
            loading.value = true
            getMsgList(current.value)
        } else {
            current.value = 1
            list.value = []
        }
    },
)
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.notice-container {
    max-height: 70vh;
    overflow: hidden;
}
.notice-list {
    overflow-y: auto;
    overscroll-behavior-y: none;
    @include scroll-bar-vertical;
}
</style>
