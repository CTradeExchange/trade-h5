<template>
    <div class='home'>
        <ul>
            <li v-for='item in list' :key='item.id'>
                <a href=''>
                    {{ item.title }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { getArticleList } from './api'
export default {
    name: 'Home',
    setup () {
        const state = reactive({
            list: []
        })
        // 调取api获取数据
        const getNewsList = () => {
            const params = {
                companyId: 19,
                lang: 'en-US',
            }
            getArticleList(params).then(res => {
                console.log(res)
                const { data } = res
                state.list = data.data
            })
        }
        onMounted(getNewsList)
        // ...toRefs()将state里面得对象解构
        return {
      ...toRefs(state)
        }
    }
}
</script>
