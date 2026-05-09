import { showToast } from "vant";
import { onMounted, ref } from "vue";
import type { SyncEndpoint } from "@/api/endpoints/type";
import { useSync } from "@/composables/use-sync";

const LAST_SYNC_KEY = "cent_last_sync_at";

export const syncing = ref(false);
export const pending = ref(false);
export const lastSyncAt = ref<number | null>(null);

let hookInstalled = false;
let endpointRef: SyncEndpoint | null = null;

const refreshPending = async () => {
    if (!endpointRef) return;
    try {
        pending.value = await endpointRef.getIsNeedSync();
    } catch {
        pending.value = false;
    }
};

const installSyncHooks = (ep: SyncEndpoint) => {
    if (hookInstalled) {
        endpointRef = ep;
        return;
    }
    hookInstalled = true;
    endpointRef = ep;

    const raw = localStorage.getItem(LAST_SYNC_KEY);
    lastSyncAt.value = raw ? Number(raw) : null;
    if (Number.isNaN(lastSyncAt.value ?? NaN)) {
        lastSyncAt.value = null;
    }

    ep.onSync((running) => {
        syncing.value = true;
        running
            .then(async () => {
                lastSyncAt.value = Date.now();
                localStorage.setItem(LAST_SYNC_KEY, String(lastSyncAt.value));
            })
            .catch(() => {
                showToast({
                    message: "同步失败，数据已保存在本机，联网后将同步到 Gitee",
                    duration: 3000,
                });
            })
            .finally(async () => {
                syncing.value = false;
                await refreshPending();
            });
    });
};

export function useSyncStatus() {
    const { ep } = useSync();

    onMounted(async () => {
        installSyncHooks(ep);
        await refreshPending();
    });

    const triggerSync = async () => {
        try {
            await ep.toSync();
        } catch {
            showToast({
                message: "同步失败，数据已保存在本机，联网后将同步到 Gitee",
                duration: 3000,
            });
        }
    };

    return {
        syncing,
        pending,
        lastSyncAt,
        triggerSync,
        refreshPending,
    };
}
