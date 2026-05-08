import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { StorageAPI } from "@/api/storage";
import CloudLoopIcon from "@/assets/icons/cloud-loop.svg?react";
import AnimatedNumber from "@/components/animated-number";
import { showBookGuide } from "@/components/book/util";
import { HintTooltip } from "@/components/hint";
import Ledger from "@/components/ledger";
import Loading from "@/components/loading";
import { Promotion } from "@/components/promotion";
import { amountToNumber } from "@/ledger/bill";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useLedgerStore } from "@/store/ledger";
import { usePreferenceStore } from "@/store/preference";
import { cn } from "@/utils";
import { filterOrderedBillListByTimeRange } from "@/utils/filter";
import { denseDate } from "@/utils/time";

let ledgerAnimationShows = false;

export default function Page() {
    const t = useIntl();

    const { bills, loading, sync } = useLedgerStore();
    const currentBook = useBookStore(
        useShallow((state) => {
            const { currentBookId, books } = state;
            return books.find((b) => b.id === currentBookId);
        }),
    );
    const showAssets = usePreferenceStore(
        useShallow((state) => state.showAssetsInLedger),
    );
    const syncIconClassName =
        sync === "wait"
            ? "icon-[mdi--cloud-minus-outline]"
            : sync === "syncing"
              ? "icon-[line-md--cloud-alt-print-loop]"
              : sync === "success"
                ? "icon-[mdi--cloud-check-outline]"
                : "icon-[mdi--cloud-remove-outline] text-red-600";

    const [currentDate, setCurrentDate] = useState(dayjs());
    const ledgerRef = useRef<any>(null);

    const currentDateBills = useMemo(() => {
        const today = filterOrderedBillListByTimeRange(bills, [
            currentDate.startOf("day"),
            currentDate.endOf("day"),
        ]);
        return today;
    }, [bills, currentDate]);

    const currentDateAmount = useMemo(() => {
        return amountToNumber(
            currentDateBills.reduce((p, c) => {
                return p + c.amount * (c.type === "income" ? 1 : -1);
            }, 0),
        );
    }, [currentDateBills]);

    const onDateClick = useCallback(
        (date: dayjs.Dayjs) => {
            setCurrentDate(date);
            const index = bills.findIndex((bill) => {
                const billDate = dayjs.unix(bill.time / 1000);
                return billDate.isSame(date, "day");
            });
            if (index >= 0) {
                ledgerRef.current?.scrollToIndex(index);
            }
        },
        [bills],
    );

    const presence = useMemo(() => {
        if (ledgerAnimationShows) {
            return false;
        }
        return true;
    }, []);

    // safari capable
    useEffect(() => {
        ledgerAnimationShows = true;
    }, []);
    return (
        <div className="w-full h-full p-2 flex flex-col overflow-hidden page-show">
            <div className="flex flex-wrap flex-col w-full gap-2">
                <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 text-white rounded-2xl p-5 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
                    <div className="relative flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-white/60 font-medium tracking-wide uppercase">
                                {denseDate(currentDate)}
                            </span>
                            <AnimatedNumber
                                value={currentDateAmount}
                                className="font-bold text-4xl tracking-tight"
                            />
                        </div>
                        {currentBook && (
                            <button
                                type="button"
                                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-medium transition-colors cursor-pointer"
                                onClick={() => {
                                    showBookGuide();
                                }}
                            >
                                <i className="icon-[mdi--book] size-3.5" />
                                {currentBook.name}
                            </button>
                        )}
                    </div>
                </div>
                <Promotion />
            </div>
            <div className="flex justify-between items-center px-4 py-1.5 h-8">
                <button
                    className="cursor-pointer flex items-center"
                    type="button"
                    onClick={() => {
                        if (loading) {
                            return;
                        }
                        useLedgerStore.getState().initCurrentBook();
                    }}
                >
                    <div className={cn("opacity-0", loading && "opacity-100")}>
                        <Loading className="[&_i]:size-[18px]" />
                    </div>
                </button>
                <div className="flex items-center gap-2" />
                <HintTooltip
                    persistKey={"cloudSyncHintShows"}
                    content={"等待云同步完成后，其他设备即可获取最新的账单数据"}
                >
                    <button
                        type="button"
                        className="cursor-pointer flex items-center"
                        onClick={() => {
                            StorageAPI.toSync();
                        }}
                    >
                        {sync === "syncing" ? (
                            <CloudLoopIcon width={18} height={18} />
                        ) : (
                            <i
                                className={cn(syncIconClassName, "size-[18px]")}
                            ></i>
                        )}
                    </button>
                </HintTooltip>
            </div>
            <div className="flex-1 translate-0 pb-[10px] overflow-hidden">
                <div className="w-full h-full">
                    {bills.length > 0 ? (
                        <Ledger
                            ref={ledgerRef}
                            bills={bills}
                            className={cn(bills.length > 0 && "relative")}
                            enableDivideAsOrdered
                            showTime
                            onVisibleDateChange={setCurrentDate}
                            onDateClick={onDateClick}
                            presence={presence}
                            showAssets={showAssets}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <i className="icon-[mdi--receipt-text-outline] size-12 mb-3 opacity-30" />
                            <p className="text-sm">
                                {t("nothing-here-add-one-bill")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
