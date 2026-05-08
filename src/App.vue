<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const active = ref(0);

const tabs = [
    { path: "/", icon: "chart-typed", label: "统计" },
    { path: "/home", icon: "records", label: "账本" },
    { path: "/add", icon: "add", label: "记账" },
    { path: "/assets", icon: "balance-list", label: "资产" },
    { path: "/profile", icon: "contact", label: "我的" },
];

const onChange = (index: number) => {
    const tab = tabs[index];
    if (tab.path === "/add") {
        // TODO: open bill editor
        return;
    }
    router.push(tab.path);
};
</script>

<template>
    <div class="app-container">
        <router-view />
        <van-tabbar v-model="active" @change="onChange">
            <van-tabbar-item
                v-for="(tab, i) in tabs"
                :key="tab.path"
                :icon="tab.icon"
            >
                {{ tab.label }}
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<style scoped>
.app-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
