<template>
    <div class="page">
        <van-nav-bar title="我的" />
        <div class="content">
            <van-cell-group inset>
                <van-cell title="设置" is-link />
                <van-cell title="关于" is-link />
            </van-cell-group>
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
    padding-top: 12px;
}
</style>
