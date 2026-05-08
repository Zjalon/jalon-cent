import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import ComplexAddButton from "./add-button";
import { goAddBill } from "./bill-editor";
import { showSettings } from "./settings";

const tabs = [
    {
        path: "/stat",
        label: "统计",
        icon: "icon-[mdi--chart-box-outline]",
        activeIcon: "icon-[mdi--chart-box]",
    },
    {
        path: "/",
        label: "账本",
        icon: "icon-[mdi--book-open-outline]",
        activeIcon: "icon-[mdi--book-open]",
    },
    {
        path: "__add__",
        label: "记账",
        icon: "icon-[mdi--add]",
        activeIcon: "icon-[mdi--add]",
    },
    {
        path: "/assets",
        label: "资产",
        icon: "icon-[mdi--wallet-outline]",
        activeIcon: "icon-[mdi--wallet]",
    },
    {
        path: "__settings__",
        label: "我的",
        icon: "icon-[mdi--account-circle-outline]",
        activeIcon: "icon-[mdi--account-circle]",
    },
];

export default function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const currentTab = useMemo(() => {
        if (location.pathname.startsWith("/stat")) return "/stat";
        if (location.pathname === "/assets") return "/assets";
        return "/";
    }, [location.pathname]);

    const handleTabClick = (path: string) => {
        if (path === "__add__") {
            goAddBill();
        } else if (path === "__settings__") {
            setSettingsOpen(true);
            showSettings().finally(() => setSettingsOpen(false));
        } else {
            navigate(path);
        }
    };

    const isActive = (path: string) => {
        if (path === "__add__") return false;
        if (path === "__settings__") return settingsOpen;
        return currentTab === path;
    };

    return createPortal(
        <div
            className="floating-tab fixed bottom-0 left-0 w-screen z-[3]
                bg-background/80 backdrop-blur-lg border-t pb-[env(safe-area-inset-bottom)]
                sm:top-0 sm:bottom-auto sm:left-0 sm:w-auto sm:h-screen sm:border-t-0 sm:border-r
                sm:flex-col sm:justify-center"
        >
            <div className="flex items-center justify-around h-16 sm:flex-col sm:h-auto sm:gap-1 sm:px-2">
                {tabs.map((tab) => {
                    if (tab.path === "__add__") {
                        return (
                            <div
                                key={tab.path}
                                className="flex flex-col items-center justify-center -mt-5 sm:mt-0 sm:-mr-5"
                            >
                                <ComplexAddButton
                                    onClick={() => handleTabClick(tab.path)}
                                    className="!w-12 !h-12 sm:!w-11 sm:!h-11 !m-0"
                                />
                                <span className="text-[10px] mt-0.5 text-muted-foreground">
                                    {tab.label}
                                </span>
                            </div>
                        );
                    }

                    const active = isActive(tab.path);

                    return (
                        <button
                            key={tab.path}
                            type="button"
                            className={`flex flex-col items-center justify-center flex-1 sm:flex-none sm:w-14 sm:py-2
                                cursor-pointer transition-colors rounded-lg sm:rounded-xl
                                ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            onClick={() => handleTabClick(tab.path)}
                        >
                            <i
                                className={`${active ? tab.activeIcon : tab.icon} size-5 transition-transform ${active ? "scale-110" : ""}`}
                            ></i>
                            <span className="text-[10px] mt-0.5">
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>,
        document.body,
    );
}
