import { usePreference } from "@/store/preference";
import { BaseButton } from "./base";
import { KeyboardAddButton } from "./keyboard-add";
import { VoiceAddButton } from "./voice-add";

export default function ComplexAddButton({
    onClick,
    className,
}: {
    onClick?: () => void;
    className?: string;
}) {
    const [voiceRecordingEnabled] = usePreference("voiceRecordingEnabled");
    const [voiceByKeyboard] = usePreference("voiceByKeyboard");
    if (!voiceRecordingEnabled) {
        return (
            <BaseButton onClick={onClick} className={className}>
                <i className="icon-[mdi--add] text-[white] size-7"></i>
            </BaseButton>
        );
    }
    if (voiceByKeyboard) {
        return <KeyboardAddButton onClick={onClick} className={className} />;
    }
    return <VoiceAddButton onClick={onClick} className={className} />;
}
