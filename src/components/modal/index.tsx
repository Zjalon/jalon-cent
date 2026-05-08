import { toast } from "sonner";
import { LoadingProvider, loading } from "./loading";
import { PromptProvider, prompt } from "./prompt";

export function ModalProvider() {
    return (
        <>
            <PromptProvider />
            <LoadingProvider />
        </>
    );
}

const modal = {
    loading,
    prompt,
    toast,
};

export type Modal = typeof modal;

export default modal;
