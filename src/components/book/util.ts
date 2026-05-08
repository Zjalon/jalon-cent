import createConfirmProvider from "../confirm";
import { BookConfirmForm } from "./form";

export const [BookConfirmProvider, showBookGuide] = createConfirmProvider(
    BookConfirmForm,
    {
        dialogTitle: "Books",
        dialogModalClose: true,
        contentClassName:
            "max-h-[70vh] w-fit max-w-[500px] p-0 overflow-hidden rounded-2xl",
        fade: true,
    },
);
