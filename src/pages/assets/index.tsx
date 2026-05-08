import { useMemo } from "react";
import AnimatedNumber from "@/components/animated-number";
import modal from "@/components/modal";
import { useAccount } from "@/hooks/use-account";
import { useIntl } from "@/locale";
import { cn } from "@/utils";

export default function AssetsPage() {
    const t = useIntl();
    const { accounts, getBalance, add, update } = useAccount();

    const totalBalance = useMemo(() => {
        return accounts.reduce((sum, acc) => sum + getBalance(acc.id), 0);
    }, [accounts, getBalance]);

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
        await modal.prompt({ title: t("delete-account-confirm") });
        await update(id);
    };

    return (
        <div className="w-full h-full p-2 flex flex-col overflow-hidden page-show">
            {/* total balance */}
            <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 text-white rounded-2xl p-5 w-full overflow-hidden mb-3">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
                <div className="relative flex items-start justify-between">
                    <div>
                        <span className="text-xs text-white/60 font-medium tracking-wide uppercase">
                            {t("total")}
                        </span>
                        <AnimatedNumber
                            value={totalBalance}
                            className="font-bold text-3xl tracking-tight mt-1"
                        />
                    </div>
                    <button
                        type="button"
                        className="flex items-center justify-center size-8 rounded-full bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
                        onClick={handleAdd}
                    >
                        <i className="icon-[mdi--plus] size-5" />
                    </button>
                </div>
            </div>

            {/* account list */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-2 px-1">
                    {accounts.map((account) => {
                        const balance = getBalance(account.id);
                        return (
                            <div
                                key={account.id}
                                className="group flex items-center gap-3 rounded-xl border p-3.5 bg-card transition-all hover:bg-accent/50"
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
                                </div>
                                <span className="text-sm font-semibold tabular-nums">
                                    {balance.toFixed(2)}
                                </span>
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
        </div>
    );
}
