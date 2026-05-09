import type { BillCategory } from "./type";

/** 内置支出分类（可与账本 meta.categories 中的自定义项合并展示） */
export const ZhExpensePresets: BillCategory[] = [
    {
        id: "zh-exp-food",
        name: "吃饭",
        type: "expense",
        icon: "records",
        color: "#c2410c",
    },
    {
        id: "zh-exp-transport",
        name: "交通",
        type: "expense",
        icon: "logistics",
        color: "#2d6a4f",
    },
    {
        id: "zh-exp-shopping",
        name: "购物",
        type: "expense",
        icon: "shopping-cart-o",
        color: "#b45309",
    },
    {
        id: "zh-exp-house",
        name: "居家",
        type: "expense",
        icon: "wap-home-o",
        color: "#78716c",
    },
    {
        id: "zh-exp-ent",
        name: "娱乐",
        type: "expense",
        icon: "smile-o",
        color: "#7c3aed",
    },
    {
        id: "zh-exp-med",
        name: "医疗",
        type: "expense",
        icon: "like-o",
        color: "#dc2626",
    },
    {
        id: "zh-exp-other",
        name: "其他",
        type: "expense",
        icon: "ellipsis",
        color: "#57534e",
    },
];

/** 内置收入分类 */
export const ZhIncomePresets: BillCategory[] = [
    {
        id: "zh-inc-salary",
        name: "工资",
        type: "income",
        icon: "gold-coin-o",
        color: "#2d6a4f",
    },
    {
        id: "zh-inc-bonus",
        name: "奖金",
        type: "income",
        icon: "gift-o",
        color: "#c2410c",
    },
    {
        id: "zh-inc-redpacket",
        name: "红包",
        type: "income",
        icon: "coupon-o",
        color: "#ea580c",
    },
    {
        id: "zh-inc-invest",
        name: "理财",
        type: "income",
        icon: "chart-trending-o",
        color: "#0369a1",
    },
    {
        id: "zh-inc-other",
        name: "其他",
        type: "income",
        icon: "ellipsis",
        color: "#57534e",
    },
];

export const TransferPresetCategory: BillCategory = {
    id: "zh-transfer",
    name: "转账",
    type: "transfer",
    icon: "exchange",
    color: "#2d6a4f",
};

export const presetCategoryIds = new Set([
    ...ZhExpensePresets.map((c) => c.id),
    ...ZhIncomePresets.map((c) => c.id),
    TransferPresetCategory.id,
]);
