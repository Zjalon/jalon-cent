<script setup lang="ts">
</script>

<template>
    <div class="page">
        <van-nav-bar title="Cent" />
        <div class="content">
            <van-empty description="暂无账单" />
        </div>
    </div>
</template>

<style scoped>
.page {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.content {
    flex: 1;
    overflow-y: auto;
}
</style>
