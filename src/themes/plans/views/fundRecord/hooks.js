import { useRoute } from 'vue-router'

export default function hooks () {
    const route = useRoute()
    const { direction } = route.query
    const pageTitle = direction === 'buy' ? '申购记录' : '基金'
    return {
        pageTitle,
    }
};
