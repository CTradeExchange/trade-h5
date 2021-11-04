<template>
    <el-dropdown>
        <i class='icon icon_zhuanhuanchengbaitian' :title="$t('header.theme')"></i>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="changeTheme('light')">
                    {{ $t('theme.day') }}
                </el-dropdown-item>
                <el-dropdown-item @click="changeTheme('night')">
                    {{ $t('theme.night') }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import Colors, { setRootVariable } from '@planspc/colorVariables'
export default {
    setup () {
        const store = useStore()

        // 切换白天黑夜模式主题
        const changeTheme = theme => {
            // 设置全局变量
            store.commit('Update_invertColor', theme)
            setRootVariable(theme)

            document.body.style.setProperty('--color', Colors[theme].color)
            document.body.style.setProperty('--contentColor', Colors[theme].contentColor)
            document.body.style.setProperty('--primaryAssistColor', Colors[theme].primaryAssistColor)
            document.body.style.setProperty('--bgColor', Colors[theme].bgColor)
            document.body.style.setProperty('--normalColor', Colors[theme].normalColor)
            document.body.style.setProperty('--minorColor', Colors[theme].minorColor)
            document.body.style.setProperty('--lineColor', Colors[theme].lineColor)
            document.body.style.setProperty('--assistColor', Colors[theme].assistColor)
            document.body.style.setProperty('--placeholdColor', Colors[theme].placeholdColor)

            const event = new CustomEvent('Launch_theme', { detail: theme })
            document.body.dispatchEvent(event)
        }
        return {
            changeTheme
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.icon {
    font-size: 20px;
    color: #D6DAE1;
    cursor: pointer;
}
</style>
