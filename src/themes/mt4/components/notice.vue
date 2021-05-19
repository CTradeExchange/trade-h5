<template>
    <van-popup
        v-model:show='show'
        class='notice-wrap'
        close-on-popstate
        :overlay='false'
        position='top'
        :style='{ zIndex: 9999,overflow: "hidden" }'
        teleport='#app'
    >
        <div class='notice' @click="show=false;$router.push('/msg')">
            <div class='top'>
                <p class='title'>
                    {{ noticeContent.title || '标题' }}
                </p>
                <van-icon name='cross' @click.stop='show = false' />
            </div>
            <div class='content'>
                {{ computeHtml(noticeContent.text) }}
                {{ computeHtmlTime(noticeContent.text) }}
            </div>
        </div>
    </van-popup>
</template>

<script>
import dayjs from 'dayjs'
import { isEmpty } from '@/utils/util'
import { reactive, toRefs } from 'vue'
export default {
    setup (props) {
        const state = reactive({
            show: false,
            noticeContent: ''
        })

        document.body.addEventListener('notice', res => {
            state.show = true
            state.noticeContent = res.detail.content
            setTimeout(() => {
                state.show = false
            }, 5000)
        }, false)

        const computeHtmlTime = (content) => {
            try {
                const reg = /<?time[^>]*>[^<]*<\/time>/gi
                const tag = content.match(reg)
                if (!isEmpty(tag)) {
                    const time = tag.toString().replace(/<\/?time>/g, '')
                    return dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
                }
            } catch (error) {
                console.log(error)
            }
        }

        const computeHtml = (content) => {
            const reg = /<?time[^>]*>[^<]*<\/time>。/gi
            return content.replace(reg, '')
        }

        return {
            computeHtmlTime,
            computeHtml,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss">
@import '~@m/style.scss';
.notice-wrap {
    width: 96% !important;
    height: 15%;
    margin: 2% !important;
    overflow: hidden;
    border-radius: rem(10px);
    box-shadow: rem(2px) rem(3px) rem(5px) #868383;
    .notice {
        padding: rem(30px);
        .top {
            display: flex;
            justify-content: space-between;
            margin-bottom: rem(10px);
            .title {
                font-weight: bold;
            }
        }
        .content {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }
    }
}
</style>
