import type { BillAccount } from "./type";

export const DefaultAccounts: BillAccount[] = [
    {
        id: "cash",
        name: "现金",
        icon: "mdi--cash",
        color: "#4ade80",
    },
    {
        id: "bank-card",
        name: "银行卡",
        icon: "mdi--credit-card-outline",
        color: "#60a5fa",
    },
    {
        id: "alipay",
        name: "支付宝",
        icon: "mdi--alpha-a-circle-outline",
        color: "#1677ff",
    },
    {
        id: "wechat-pay",
        name: "微信",
        icon: "mdi--wechat",
        color: "#07c160",
    },
];
