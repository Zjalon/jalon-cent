import type { BaseItem } from "@/database/stash";

export type Account = BaseItem & {
    name: string;
    icon: string;
    color: string;
    /** 初始余额，10000:1 比率 */
    initialBalance?: number;
};
