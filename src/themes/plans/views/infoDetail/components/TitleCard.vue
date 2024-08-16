<template>
    <div class='titleBox'>
        <div>
            <p>{{ detail.Title }}</p>
            <p>
                <span>
                    {{
                        formatPublishTime(detail.PublishTime)
                    }}
                </span>
                <!-- <span>
                    {{
                        $t("news.userJoin", { allVotes: detail.TotalLikeCount })
                    }}
                </span> -->
            </p>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import dayjs from 'dayjs'
import { isEmpty, getCookie } from '@/utils/util'

export default {
    props: {
        info: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    setup (props) {
        const state = reactive({
            type: 1
        })

        const detail = computed(() => {
            const language = getCookie('lang') || 'en-US'
            const { TotalLikeCount, ItemLanguages } = props.info
            const currentItem = isEmpty(ItemLanguages) ? {} : ItemLanguages.find(i => i.Language === language) || {}
            const { PublishTime, Title } = currentItem || {}
            return { TotalLikeCount, Title, PublishTime }
        })

        const formatPublishTime = (time) => {
            return dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')
        }

        return {
            detail,
            formatPublishTime,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.titleBox {
    padding: rem(20px);
    & > div {
        background: var(--contentColor);
        padding: rem(20px);
        border-radius: rem(10px);
        & > p:first-of-type {
            font-size: rem(34px);
            color: (--primaryText);
            line-height: 1.5;
        }
        & > p:last-of-type {
            display: flex;
            justify-content: space-between;
            font-size: rem(24px);
            color: var(--placeholdColor);
            margin-top: rem(20px);
        }
    }
}
.titleBoxs {
    padding: rem(40px) rem(30px) rem(20px);
    background: var(--contentColor);
    & > p:first-of-type {
        font-size: rem(48px);
        font-weight: bold;
        line-height: 1.5;
        color: (--primaryText);
    }
    & > p:last-of-type {
        display: flex;
        justify-content: space-between;
        margin-top: rem(55px);
        font-size: rem(24px);
        color: var(--placeholdColor);
    }
}
</style>
