import { useState } from "react";
import { useAccount } from "@/hooks/use-account";
import { useIntl } from "@/locale";
import { cn } from "@/utils";
import createConfirmProvider from "../confirm";
import modal from "../modal";

const [AccountManagerDialog, showAccountManager] = createConfirmProvider(
    AccountManager,
    {
        dialogTitle: "Accounts",
        dialogModalClose: true,
        contentClassName:
            "max-h-[70vh] w-[90vw] max-w-[500px] p-0 overflow-hidden rounded-2xl",
        fade: true,
    },
);

export { AccountManagerDialog, showAccountManager };

export default function AccountManager() {
    const t = useIntl();
    const { accounts, getBalance, add, update } = useAccount();
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAdd = async () => {
        const name = (await modal.prompt({
            title: t("account"),
            input: { type: "text" },
        })) as string;
        if (!name) return;
        await add({
            name,
            icon: "mdi--wallet-outline",
            color: "#6b7280",
            initialBalance: 0,
        });
    };

    const handleEdit = async (id: string) => {
        const account = accounts.find((a) => a.id === id);
        if (!account) return;
        const name = (await modal.prompt({
            title: t("account"),
            input: { type: "text", defaultValue: account.name },
        })) as string;
        if (!name) return;
        await update(id, { name });
    };

    const handleDelete = async (id: string) => {
        const confirmed = await modal
            .prompt({ title: "确定删除此账户？" })
            .catch(() => false);
        if (!confirmed) return;
        await update(id);
    };

    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t("accounts")}</h2>
                <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={handleAdd}
                >
                    <i className="icon-[mdi--plus] size-4" />
                    {t("add")}
                </button>
            </div>

            <div className="flex flex-col gap-2">
                {accounts.map((account) => {
                    const balance = getBalance(account.id);
                    return (
                        <div
                            key={account.id}
                            className="group flex items-center gap-3 rounded-xl border p-3.5 transition-all hover:bg-accent/50"
                        >
                            <div
                                className="flex items-center justify-center size-9 rounded-lg text-white shrink-0"
                                style={{ backgroundColor: account.color }}
                            >
                                <i
                                    className={cn(
                                        `icon-[${account.icon}]`,
                                        "size-5",
                                    )}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">
                                    {account.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {t("account-balance")}: {balance.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    className="p-1.5 rounded-md hover:bg-accent text-muted-foreground cursor-pointer"
                                    onClick={() => handleEdit(account.id)}
                                >
                                    <i className="icon-[mdi--pencil-outline] size-4" />
                                </button>
                                <button
                                    type="button"
                                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                                    onClick={() => handleDelete(account.id)}
                                >
                                    <i className="icon-[mdi--delete-outline] size-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
