<template>
    <div class="page">
        <div class="content">
            <van-empty description="暂无数据" />
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
