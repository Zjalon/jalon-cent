<script setup lang="ts">
import { closeToast, showLoadingToast, showToast } from "vant";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useSync } from "@/composables/use-sync";

const router = useRouter();
const { ep, books, selectBook } = useSync();

const loading = ref(true);
const newBookName = ref("");
const showCreateDialog = ref(false);

const doSelectAndSync = async (bookId: string) => {
    showLoadingToast({ message: "同步中...", forbidClick: true, duration: 0 });
    try {
        await ep.initBook(bookId);
        await selectBook(bookId);
        closeToast();
        router.replace("/");
    } catch (e: any) {
        closeToast();
        setTimeout(
            () => showToast(`同步失败：${e.message ?? "未知错误"}`),
            100,
        );
    }
};

const onCreateBook = async () => {
    const name = newBookName.value.trim() || "默认账本";
    showLoadingToast({ message: "创建中...", forbidClick: true, duration: 0 });
    try {
        const book = await ep.createBook(name);
        await ep.initBook(book.id);
        await selectBook(book.id);
        showCreateDialog.value = false;
        closeToast();
        router.replace("/");
    } catch (e: any) {
        closeToast();
        setTimeout(
            () => showToast(`创建失败：${e.message ?? "未知错误"}`),
            100,
        );
    }
};

onMounted(async () => {
    try {
        const list = await ep.fetchAllBooks();
        books.value = list;
    } catch (e: any) {
        setTimeout(
            () => showToast(`获取账本失败：${e.message ?? "未知错误"}`),
            100,
        );
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="book-select-page">
        <van-nav-bar title="选择账本" safe-area-inset-top :border="false" />
        <div class="content">
            <van-empty v-if="loading" description="正在加载账本..." />

            <template v-else>
                <div class="book-list">
                    <div class="book-list-header">
                        <span class="book-list-title">我的账本</span>
                        <van-button
                            size="small"
                            type="primary"
                            plain
                            @click="showCreateDialog = true"
                        >
                            新建
                        </van-button>
                    </div>

                    <van-cell-group inset v-if="books.length > 0">
                        <van-cell
                            v-for="book in books"
                            :key="book.id"
                            :title="book.name"
                            :label="book.id"
                            is-link
                            @click="doSelectAndSync(book.id)"
                        />
                    </van-cell-group>

                    <van-empty
                        v-else
                        description="暂无账本，点击右上角新建"
                    />
                </div>
            </template>
        </div>

        <van-dialog
            v-model:show="showCreateDialog"
            title="新建账本"
            show-cancel-button
            :close-on-click-overlay="false"
            @confirm="onCreateBook"
        >
            <van-field
                v-model="newBookName"
                placeholder="请输入账本名称"
                label="名称"
            />
        </van-dialog>
    </div>
</template>

<style scoped>
.book-select-page {
    flex: 1;
    min-height: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #f7f8fa;
}
.content {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
}
.book-list {
    padding: 16px;
}
.book-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}
.book-list-title {
    font-size: 18px;
    font-weight: 600;
    color: #323233;
}
</style>
