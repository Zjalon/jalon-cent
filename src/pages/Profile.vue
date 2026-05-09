<script setup lang="ts">
import dayjs from "dayjs";
import { showConfirmDialog, showToast } from "vant";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/use-auth";
import { lastSyncAt } from "@/composables/use-sync-status";
import { useCurrentUser } from "@/composables/useCurrentUser";

const router = useRouter();
const { logout } = useAuth();
const { user, updateNickname } = useCurrentUser();

const showEditDialog = ref(false);
const editNickname = ref("");

const lastSyncLabel = computed(() => {
    if (!lastSyncAt.value) {
        return "暂无记录";
    }
    return dayjs(lastSyncAt.value).format("YYYY-MM-DD HH:mm");
});

const openEditNickname = () => {
    editNickname.value = user.value?.nickname ?? "";
    showEditDialog.value = true;
};

const onConfirmEdit = async () => {
    const name = editNickname.value.trim();
    if (!name) {
        showToast("昵称不能为空");
        return;
    }
    try {
        await updateNickname(name);
        showToast("修改成功");
    } catch {
        showToast("修改失败");
    }
};

const onLogout = async () => {
    try {
        await showConfirmDialog({ title: "确定退出登录？" });
        logout();
        showToast("已退出");
        router.replace("/login");
    } catch {
        // cancelled
    }
};
</script>

<template>
    <div class="page">
        <div class="content">
            <div v-if="user" class="user-card">
                <van-image
                    v-if="user.avatar"
                    round
                    width="64"
                    height="64"
                    :src="user.avatar"
                />
                <div class="user-info">
                    <span class="user-nickname">{{ user.nickname }}</span>
                    <van-button
                        size="small"
                        plain
                        type="primary"
                        @click="openEditNickname"
                    >
                        编辑昵称
                    </van-button>
                </div>
            </div>
            <van-cell-group inset>
                <van-cell title="上次同步成功" :value="lastSyncLabel" />
                <van-cell title="设置" is-link />
                <van-cell title="关于" is-link />
            </van-cell-group>
            <div class="logout-actions">
                <van-button round block plain type="danger" @click="onLogout">
                    退出登录
                </van-button>
            </div>
        </div>

        <van-dialog
            v-model:show="showEditDialog"
            title="修改昵称"
            show-cancel-button
            :close-on-click-overlay="false"
            @confirm="onConfirmEdit"
        >
            <van-field
                v-model="editNickname"
                placeholder="请输入新昵称"
                label="昵称"
                maxlength="20"
            />
        </van-dialog>
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
.user-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 16px;
    margin: 0 16px 12px;
    background: #fff;
    border-radius: 8px;
}
.user-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.user-nickname {
    font-size: 18px;
    font-weight: 600;
    color: #323233;
}
.logout-actions {
    margin: 32px 16px 0;
}
</style>
