<template>
    <span class='sortIcon'>
        <i class='upArrow'></i>
        <i class='downArrow'></i>
    </span>
</template>

<script setup>
const props = defineProps({
    sortField: String,
    sortType: String,
})
</script>

<style lang="scss" scoped>
.sortIcon{
    display: flex;
    flex-direction: column;
    .upArrow,.downArrow{
        width: 0;
        height: 0;
        border: 10px solid var(--color);
        border-top-width: 0;
        border-color: transparent transparent var(--color) transparent;
    }
    .downArrow{
        border-bottom-width: 0;
        border-top-width: 10px;
    }
}
</style>
