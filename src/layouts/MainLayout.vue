<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSyncStatus } from "@/composables/use-sync-status";

const router = useRouter();
const route = useRoute();
const active = ref(0);
const { syncing, pending, triggerSync } = useSyncStatus();

const tabs = [
    { path: "/", icon: "records", label: "账本" },
    { path: "/stat", icon: "gem", label: "统计" },
    { path: "/assets", icon: "balance-list", label: "资产" },
    { path: "/profile", icon: "contact", label: "我的" },
];

const syncIndex = (path: string) => {
    const normalized = path === "/" ? "/" : path.replace(/\/$/, "") || "/";
    const idx = tabs.findIndex((t) => t.path === normalized);
    if (idx >= 0) {
        active.value = idx;
    }
};

watch(
    () => route.path,
    (p) => syncIndex(p),
    { immediate: true },
);

const onChange = (index: number) => {
    router.push(tabs[index].path);
};

const onSyncClick = async () => {
    await triggerSync();
};
</script>

<template>
    <div class="layout-container">
        <header class="header">
            <span class="header-title">Cent</span>
            <div class="sync-icon" @click="onSyncClick">
                <van-loading v-if="syncing" type="spinner" size="18" />
                <van-icon
                    v-else-if="pending"
                    name="clock-o"
                    color="#ff976a"
                    size="20"
                />
                <van-icon
                    v-else
                    name="passed"
                    color="#07c160"
                    size="20"
                    style="opacity: 0.5"
                />
            </div>
        </header>
        <div class="main">
            <router-view />
        </div>
        <van-tabbar
            v-model="active"
            safe-area-inset-bottom
            @change="onChange"
        >
            <van-tabbar-item
                v-for="tab in tabs"
                :key="tab.path"
                :icon="tab.icon"
            >
                {{ tab.label }}
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<style scoped>
.layout-container {
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: #f7f8fa;
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    padding-top: calc(8px + env(safe-area-inset-top, 0px));
    background: #fff;
    border-bottom: 1px solid #ebedf0;
    flex-shrink: 0;
}
.header-title {
    font-size: 18px;
    font-weight: 700;
    color: #323233;
}
.sync-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    min-height: 40px;
}
.main {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>
