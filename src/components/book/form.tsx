import { useEffect, useState } from "react";
import type { Book } from "@/api/endpoints/type";
import { loadStorageAPI } from "@/api/storage/dynamic";
import { useIntl } from "@/locale";
import { useBookStore } from "@/store/book";
import { useIsLogin } from "@/store/user";
import { cn } from "@/utils";
import Loading from "../loading";
import modal from "../modal";

export function BookForm({ embedded }: { embedded?: boolean }) {
    const t = useIntl();
    const isLogin = useIsLogin();
    const { books, currentBookId, loading } = useBookStore();

    const [creating, setCreating] = useState(false);

    const [core, setCore] = useState<
        Awaited<ReturnType<typeof loadStorageAPI>> | undefined
    >(undefined);
    useEffect(() => {
        loadStorageAPI().then((v) => {
            setCore(v);
        });
    }, []);

    useEffect(() => {
        useBookStore.getState().updateBookList();
    }, []);

    if (!isLogin) {
        return null;
    }

    const toSwitchBook = (bookId: string) => {
        useBookStore.getState().switchToBook(bookId);
    };
    const toInvite = async (book: Book) => {
        const { StorageAPI } = await loadStorageAPI();
        StorageAPI.inviteForBook?.(book.id);
    };

    const toDelete = async (book: Book) => {
        const { StorageAPI } = await loadStorageAPI();
        try {
            await StorageAPI.deleteBook(book.id);
            useBookStore.getState().switchToBook(undefined);
        } catch (error) {
            console.log(error);
        }
    };

    const content = (
        <>
            <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 px-6 py-5 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {t("select-a-book")}
                        </h2>
                        <p className="text-xs text-white/50 mt-1">
                            {books.length > 0
                                ? `${books.length} ${books.length === 1 ? "book" : "books"}`
                                : loading
                                  ? t("loading-books")
                                  : t("no-books-go-create-one")}
                        </p>
                    </div>
                    <button
                        type="button"
                        disabled={creating}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                        onClick={async () => {
                            const name = (await modal.prompt({
                                title: t("please-input-book-name"),
                                input: { type: "text" },
                            })) as string;
                            if (!name) return;
                            setCreating(true);
                            try {
                                await (
                                    await loadStorageAPI()
                                ).StorageAPI.createBook(name);
                                await useBookStore.getState().updateBookList();
                            } finally {
                                setCreating(false);
                            }
                        }}
                    >
                        {creating ? (
                            <Loading className="[&_i]:size-4" />
                        ) : (
                            <i className="icon-[mdi--plus] size-4" />
                        )}
                        {t("create-new-book")}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
                {loading && books.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <Loading>{t("loading-books")}</Loading>
                    </div>
                ) : books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <i className="icon-[mdi--book-open-page-variant-outline] size-10 mb-3 opacity-40" />
                        <p className="text-sm">{t("no-books-go-create-one")}</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {books.map((book) => {
                            const isActive = book.id === currentBookId;
                            return (
                                <button
                                    type="button"
                                    key={book.id}
                                    className={cn(
                                        "group relative flex items-center gap-3 rounded-xl border p-3.5 transition-all cursor-pointer",
                                        isActive
                                            ? "border-l-4 border-l-stone-800 bg-stone-50 dark:bg-stone-800/30 dark:border-l-stone-400"
                                            : "hover:bg-accent/50",
                                    )}
                                    onClick={() => toSwitchBook(book.id)}
                                >
                                    <div
                                        className={cn(
                                            "flex items-center justify-center size-9 rounded-lg text-white text-sm font-bold shrink-0",
                                            isActive
                                                ? "bg-stone-800 dark:bg-stone-600"
                                                : "bg-stone-400 dark:bg-stone-600",
                                        )}
                                    >
                                        {book.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {book.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                            {book.id}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {core?.StorageAPI.inviteForBook && (
                                            <button
                                                type="button"
                                                className="p-1.5 rounded-md hover:bg-accent text-muted-foreground cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toInvite(book);
                                                }}
                                            >
                                                <i className="icon-[mdi--account-plus-outline] size-4" />
                                            </button>
                                        )}
                                        {!isActive && (
                                            <button
                                                type="button"
                                                className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toDelete(book);
                                                }}
                                            >
                                                <i className="icon-[mdi--delete-outline] size-4" />
                                            </button>
                                        )}
                                    </div>
                                    {isActive && (
                                        <i className="icon-[mdi--check-circle] size-5 text-stone-800 dark:text-stone-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );

    if (embedded) {
        return content;
    }

    return (
        <div className="pointer-events-auto w-[380px] max-w-[90vw] max-h-[70vh] flex flex-col rounded-2xl bg-background shadow-2xl overflow-hidden">
            {content}
        </div>
    );
}

export function BookConfirmForm({
    edit,
}: {
    edit?: any;
    onCancel?: () => void;
    onConfirm?: (v: any) => void;
}) {
    return (
        <div>
            <BookForm embedded />
        </div>
    );
}
