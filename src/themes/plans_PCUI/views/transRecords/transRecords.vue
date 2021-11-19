<template>
    <router-view />
    <div class='transRecords'>
        <Header v-model:params='params' />
        <Content :common-options='commonOptions' :params='params' />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './components/Header'
import Content from './components/Content'

const commonOptions = {
    maxHeight: 530,
}
const params = ref({})

</script>

<style lang="scss" scoped>
.transRecords{
    display: flex;
    flex-direction: column;
    background: var(--contentColor);
    margin: 8px;
    border-radius: 10px;
    min-width: 1300px;
}
</style>
