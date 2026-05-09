import type { Modal } from "@/components/modal";
import { Scheduler } from "@/database/scheduler";
import type { Action, BaseItem, Full } from "@/database/stash";
import { BillIndexedDBStorage } from "@/database/storage";
import type { User } from "@/database/tables/user";
import { t } from "@/i18n";
import type { Bill } from "@/ledger/type";
import { createTidal } from "@/tidal";
import { createGiteeSyncer } from "@/tidal/gitee";
import type { SyncEndpoint, SyncEndpointFactory } from "../type";
import { createLoginAPI } from "./login";

const config = {
    repoPrefix: "cent-journal",
    entryName: "ledger",
    orderKeys: ["time"],
};

export const LoginAPI = createLoginAPI();

const PROFILE_USERS_KEY = "centUsers";

const manuallyLogin = async ({ modal }: { modal: Modal }) => {
    const token = await modal.prompt({
        title: t("please-enter-your-gitee-token"),
        input: { type: "text" },
    });
    if (!token) {
        return;
    }
    LoginAPI.manuallySetToken(token as string);
    location.reload();
};

export const GiteeEndpoint: SyncEndpointFactory = {
    type: "gitee",
    name: "Gitee",
    login: LoginAPI.login,
    manuallyLogin,
    init: ({ modal }) => {
        LoginAPI.afterLogin();
        const repo = createTidal<Bill>({
            storageFactory: (name) => new BillIndexedDBStorage(`book-${name}`),
            entryName: config.entryName,
            syncerFactory: () =>
                createGiteeSyncer({
                    auth: LoginAPI.getToken,
                    entryName: config.entryName,
                    repoPrefix: config.repoPrefix,
                }),
        });

        const toBookName = (bookId: string) => {
            const [, r] = bookId.split("/");
            return r.replace(`${config.repoPrefix}-`, "");
        };

        const inviteForBook = async (bookId: string) => {
            await modal.prompt({ title: t("invite-tip") });
            window.open(`https://gitee.com/${bookId}/team`, "_blank");
        };

        const deleteBook = async (bookId: string) => {
            await modal.prompt({ title: t("delete-book-tip") });
            window.open(
                `https://gitee.com/${bookId}/settings#remove`,
                "_blank",
            );
            return Promise.reject(new Error("cancelled"));
        };

        const scheduler = new Scheduler(async (signal) => {
            const [finished, cancel] = repo.sync();
            signal.onabort = cancel;
            await finished;
        });

        const readUsersMap = async (
            bookId: string,
        ): Promise<Record<string, User>> => {
            const profile = (await repo.getProfile(bookId)) as Record<
                string,
                unknown
            > | null;
            const raw = profile?.[PROFILE_USERS_KEY];
            if (raw && typeof raw === "object" && !Array.isArray(raw)) {
                return raw as Record<string, User>;
            }
            return {};
        };

        const writeUsersMap = async (
            bookId: string,
            users: Record<string, User>,
        ) => {
            const prev =
                ((await repo.getProfile(bookId)) as Record<string, unknown>) ??
                {};
            await repo.setProfile(bookId, {
                ...prev,
                [PROFILE_USERS_KEY]: users,
            });
            scheduler.schedule();
        };

        const endpoint: SyncEndpoint = {
            logout: async () => {
                await repo.detach();
            },
            getUserInfo: repo.getUserInfo,
            getCollaborators: repo.getCollaborators,
            getOnlineAsset: (src, store) => repo.getAsset(src, store),

            fetchAllBooks: async (...args) => {
                const res = await repo.fetchAllStore(...args);
                return res.map((v) => ({ id: v, name: toBookName(v) }));
            },
            createBook: repo.create,
            initBook: repo.init,
            initAllTables: async (bookId: string) => {
                await repo.init(bookId);
            },
            deleteBook,
            inviteForBook,

            tableBatch: async <T extends BaseItem>(
                bookId: string,
                tableName: string,
                actions: Action<T>[],
                overlap?: boolean,
            ) => {
                if (tableName === "transactions") {
                    await repo.batch(
                        bookId,
                        actions as Action<Bill>[],
                        overlap,
                    );
                    scheduler.schedule();
                    return;
                }
                if (tableName === "users") {
                    let users = await readUsersMap(bookId);
                    for (const a of actions) {
                        if (a.type === "update") {
                            users = {
                                ...users,
                                [a.id]: a.value as User,
                            };
                        } else if (a.type === "delete") {
                            const id = String(a.value);
                            users = { ...users };
                            delete users[id];
                        }
                    }
                    await writeUsersMap(bookId, users);
                    return;
                }
                if (tableName === "accounts") {
                    return;
                }
            },

            tableGetAllItems: async <T extends BaseItem>(
                bookId: string,
                tableName: string,
            ) => {
                if (tableName === "transactions") {
                    return (await repo.getAllItems(bookId)) as Full<T>[];
                }
                if (tableName === "users") {
                    const users = await readUsersMap(bookId);
                    return Object.values(users) as Full<T>[];
                }
                if (tableName === "accounts") {
                    return [];
                }
                return [];
            },

            onChange: repo.onChange,

            getIsNeedSync: repo.hasStashes,
            onSync: scheduler.onProcess.bind(scheduler),
            toSync: async () => {
                scheduler.schedule();
            },

            forceNeedSync: repo.forceNeedSync,

            getProfile: repo.getProfile,
            setProfile: async (bookId: string, data: unknown) => {
                await repo.setProfile(bookId, data);
                scheduler.schedule();
            },
        };

        return endpoint;
    },
};
