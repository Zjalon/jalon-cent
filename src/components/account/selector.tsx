import { useAccount } from "@/hooks/use-account";
import { cn } from "@/utils";

export function AccountSelector({
    value,
    onChange,
    className,
}: {
    value?: string;
    onChange: (accountId: string) => void;
    className?: string;
}) {
    const { accounts } = useAccount();

    return (
        <div
            className={cn(
                "w-full flex gap-2 items-center overflow-x-auto px-2 text-sm font-medium scrollbar-hidden",
                className,
            )}
        >
            {accounts.map((account) => {
                const selected = value === account.id;
                return (
                    <button
                        key={account.id}
                        type="button"
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all whitespace-nowrap cursor-pointer shrink-0",
                            selected
                                ? "border-transparent text-white"
                                : "border-border bg-background hover:bg-accent",
                        )}
                        style={
                            selected
                                ? { backgroundColor: account.color }
                                : undefined
                        }
                        onClick={() => onChange(account.id)}
                    >
                        <i
                            className={cn(`icon-[${account.icon}]`, "size-3.5")}
                        />
                        {account.name}
                    </button>
                );
            })}
        </div>
    );
}
