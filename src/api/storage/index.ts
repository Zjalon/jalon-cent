import { wrap } from "comlink";
import modal from "@/components/modal";
import { EmptyEndpoint } from "../endpoints/empty";
import { GiteeEndpoint } from "../endpoints/gitee";
import type { Exposed } from "./worker";
import DeferredWorker from "./worker?worker";

const APIS = {
    gitee: GiteeEndpoint,
};

const SYNC_ENDPOINT_KEY = "SYNC_ENDPOINT";
const type = (localStorage.getItem(SYNC_ENDPOINT_KEY) ??
    "gitee") as keyof typeof APIS;

const _StorageAPI = APIS[type] ?? EmptyEndpoint;
const actions = _StorageAPI.init({ modal });

export const StorageAPI = {
    name: _StorageAPI.name,
    type: _StorageAPI.type,
    ...actions,
    loginWith: (type: string) => {
        if (type === "gitee") {
            return GiteeEndpoint.login({ modal });
        }
    },
    loginManuallyWith: (type: string) => {
        if (type === "gitee") {
            return GiteeEndpoint.manuallyLogin?.({ modal });
        }
    },
};

// ComlinkSharedWorker

const workerInstance = new DeferredWorker({
    /* normal Worker options*/
});
const StorageDeferredAPI = wrap<Exposed>(workerInstance);

export { StorageDeferredAPI };
