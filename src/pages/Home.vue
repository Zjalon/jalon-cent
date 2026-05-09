<script setup lang="ts">
import { closeToast, showLoadingToast, showToast } from "vant";
import { onMounted, onUnmounted, ref } from "vue";
import { useSync } from "@/composables/use-sync";
import type { Full } from "@/database/stash";
import type { Transaction } from "@/database/tables/transaction";

const { selectedBookId, ep } = useSync();

const syncing = ref(true);
const bills = ref<Full<Transaction>[]>([]);

let unsubscribe: (() => void) | undefined;

onMounted(async () => {
    const bookId = selectedBookId.value;
    if (!bookId) return;

    showLoadingToast({ message: "同步中...", forbidClick: true, duration: 0 });
    try {
        await ep.initBook(bookId);
        bills.value = await ep.tableGetAllItems(bookId, "transactions");
    } catch (e: unknown) {
        localStorage.removeItem("selected_book_id");
        const msg = e instanceof Error ? e.message : String(e ?? "未知错误");
        const offlineHint =
            typeof navigator !== "undefined" && !navigator.onLine
                ? "当前网络不可用。"
                : "";
        setTimeout(() => {
            showToast({
                message: `${offlineHint}同步失败：${msg}。数据已保存在本机，联网后将同步到 Gitee`,
                duration: 3500,
            });
        }, 100);
    } finally {
        closeToast();
        syncing.value = false;
    }

    unsubscribe = ep.onChange(async ({ bookId: id }) => {
        bills.value = await ep.tableGetAllItems(id, "transactions");
    });
});

onUnmounted(() => {
    unsubscribe?.();
});
</script>

<template>
    <div class="page">
        <div class="content">
            <template v-if="syncing">
                <van-empty description="正在同步..." />
            </template>
            <template v-else-if="bills.length === 0">
                <van-empty description="暂无账单" />
            </template>
            <template v-else>
                <van-cell-group inset>
                    <van-cell
                        v-for="bill in bills"
                        :key="bill.id"
                        :title="`${bill.type === 'expense' ? '-' : '+'}${bill.amount}`"
                        :label="bill.time"
                    />
                </van-cell-group>
            </template>
        </div>
        <van-button
            class="fab"
            type="primary"
            round
            icon="plus"
            @click="showToast('敬请期待')"
        />
    </div>
</template>

<style scoped>
.page {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}
.content {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
}
.fab {
    position: absolute;
    bottom: calc(66px + env(safe-area-inset-bottom, 0px));
    right: 16px;
    width: 52px;
    height: 52px;
    font-size: 22px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
