import { Dialog, VisuallyHidden } from "radix-ui";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useIsLogin } from "@/store/user";
import { Button } from "../ui/button";
import { BookForm } from "./form";
import { showBookGuide } from "./util";

export default function BookGuide() {
    const t = useIntl();
    const isLogin = useIsLogin();
    const { currentBookId } = useBookStore();
    if (!isLogin) {
        return null;
    }
    if (currentBookId !== undefined) {
        return null;
    }

    return (
        <Dialog.Root open={currentBookId === undefined}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[2] bg-black/50 backdrop-blur-sm data-[state=open]:animate-overlay-show" />
                <Dialog.Content className="fixed inset-0 z-[3] flex items-center justify-center outline-none">
                    <VisuallyHidden.Root>
                        <Dialog.Title>{t("select-a-book")}</Dialog.Title>
                        <Dialog.Description>
                            {t("select-a-book")}
                        </Dialog.Description>
                    </VisuallyHidden.Root>
                    <BookForm />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export function BookSettings() {
    const t = useIntl();
    return (
        <div className="backup">
            <Button
                onClick={() => {
                    showBookGuide();
                }}
                variant="ghost"
                className="w-full py-4 rounded-none h-auto"
            >
                <div className="w-full px-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <i className="icon-[mdi--book-cog-outline] size-5"></i>
                        {t("ledger-books")}
                    </div>
                    <i className="icon-[mdi--chevron-right] size-5"></i>
                </div>
            </Button>
        </div>
    );
}
