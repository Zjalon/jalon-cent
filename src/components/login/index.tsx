/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import { createPortal } from "react-dom";
import { useShallow } from "zustand/shallow";
import { useIntl } from "@/locale";
import { useIsLogin, useUserStore } from "@/store/user";

const loaded = import("@/api/storage");

const loadStorageAPI = async () => {
    const lib = await loaded;
    return lib.StorageAPI;
};

export default function Login() {
    const t = useIntl();
    const isLogin = useIsLogin();
    const [loading] = useUserStore(
        useShallow((state) => {
            return [state.loading];
        }),
    );
    if (isLogin) {
        return null;
    }
    return createPortal(
        <div className="fixed inset-0 z-[1] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background w-[380px] rounded-2xl shadow-2xl overflow-hidden">
                <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 px-8 py-10 text-center text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
                    <h1 className="relative text-3xl font-bold tracking-tight">
                        {t("APP_NAME")}
                    </h1>
                    <p className="relative mt-3 text-sm text-white/70 leading-relaxed">
                        {t("app-introduce")}
                    </p>
                </div>

                <div className="px-8 py-8">
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <i className="icon-[mdi--loading] animate-spin text-lg" />
                            <span className="text-sm">{t("login")}</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <button
                                type="button"
                                className="group flex items-center justify-center gap-3 w-full h-12 rounded-xl bg-[#b7312d] text-white font-medium text-sm shadow-md transition-all hover:bg-[#a02a27] hover:shadow-lg active:scale-[0.98] cursor-pointer"
                                onClick={async () => {
                                    const StorageAPI = await loadStorageAPI();
                                    StorageAPI.loginManuallyWith("gitee");
                                }}
                            >
                                <svg
                                    fill="currentColor"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    className="shrink-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296z" />
                                </svg>
                                {t("login-to-gitee")}
                            </button>

                            <p className="text-center text-xs text-muted-foreground/60">
                                {t("pwa-install-tip")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    );
}
