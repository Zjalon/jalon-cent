import { useCallback, useMemo } from "react";
import { v4 } from "uuid";
import { useShallow } from "zustand/shallow";
import { DefaultAccounts } from "@/ledger/account";
import { amountToNumber } from "@/ledger/bill";
import type { Bill, BillAccount } from "@/ledger/type";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";

export function useAccount() {
    const savedAccounts = useLedgerStore(
        useShallow((state) => state.infos?.meta.accounts),
    );

    const bills = useLedgerStore(useShallow((state) => state.bills));

    const accounts = useMemo(
        () => savedAccounts ?? DefaultAccounts,
        [savedAccounts],
    );

    const accountMap = useMemo(
        () => new Map(accounts.map((a) => [a.id, a])),
        [accounts],
    );

    const getBalance = useCallback(
        (accountId: string): number => {
            const account = accountMap.get(accountId);
            const initial = account?.initialBalance ?? 0;

            const delta = bills.reduce((sum, bill) => {
                if (bill.type === "income" && bill.accountId === accountId) {
                    return sum + bill.amount;
                }
                if (bill.type === "expense" && bill.accountId === accountId) {
                    return sum - bill.amount;
                }
                if (bill.type === "transfer") {
                    if (bill.accountId === accountId) {
                        return sum - bill.amount;
                    }
                    if (bill.transferTo === accountId) {
                        return sum + bill.amount;
                    }
                }
                return sum;
            }, 0);

            return amountToNumber(initial + delta);
        },
        [bills, accountMap],
    );

    const add = useCallback(async (newData: Omit<BillAccount, "id">) => {
        const book = useBookStore.getState().currentBookId;
        if (!book) return;
        const id = v4();
        await useLedgerStore.getState().updateGlobalMeta((prev) => {
            const list = prev.accounts ?? [...DefaultAccounts];
            list.push({ ...newData, id });
            prev.accounts = list;
            return prev;
        });
        return id;
    }, []);

    const update = useCallback(
        async (id: string, value?: Partial<Omit<BillAccount, "id">>) => {
            const book = useBookStore.getState().currentBookId;
            if (!book) return;
            await useLedgerStore.getState().updateGlobalMeta((prev) => {
                const list = prev.accounts ?? [...DefaultAccounts];
                if (value === undefined) {
                    prev.accounts = list.filter((v) => v.id !== id);
                    return prev;
                }
                const index = list.findIndex((v) => v.id === id);
                if (index === -1) return prev;
                list[index] = { ...list[index], ...value, id };
                prev.accounts = list;
                return prev;
            });
        },
        [],
    );

    return {
        accounts,
        accountMap,
        getBalance,
        add,
        update,
    };
}
