import { CursorChatProps, CursorMode } from "@/types/type";
import CursorSVG from "@/public/assets/CursorSVG";

const CursorChat = ({
  cursor,
  cursorState,
  setCursorState,
  updateMyPresence,
}: CursorChatProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({ message: e.target.value });
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: e.target.value,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCursorState({
        mode: CursorMode.Chat,
        previousMessage:
          cursorState.mode === CursorMode.Chat ? cursorState.message : null,
        message: "",
      });
    } else if (e.key === "Escape") {
      setCursorState({ mode: CursorMode.Hidden });
    }
  };

  if (cursorState.mode !== CursorMode.Chat) return null;

  return (
    <div
      className="absolute left-0 top-0"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
    >
      <CursorSVG color="#22d3ee" />

      <div
        className="absolute left-3 top-5 flex min-w-[180px] flex-col gap-1 rounded-2xl border border-primary-grey-200 bg-primary-black/95 px-3 py-2 text-sm text-white shadow-xl backdrop-blur"
        onKeyUp={(e) => e.stopPropagation()}
      >
        {cursorState.previousMessage && (
          <div className="break-words text-white">
            {cursorState.previousMessage}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            className="w-56 border-none bg-transparent text-white placeholder-primary-grey-300 outline-none"
            autoFocus
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={cursorState.previousMessage ? "" : "Say something…"}
            value={cursorState.message}
            maxLength={50}
          />
        </div>
        <div className="flex items-center gap-2 text-[10px] text-primary-grey-300">
          <kbd className="rounded bg-primary-grey-200 px-1.5 py-0.5 font-mono text-[9px] text-white">
            ↵
          </kbd>
          <span>send</span>
          <span className="text-primary-grey-200">·</span>
          <kbd className="rounded bg-primary-grey-200 px-1.5 py-0.5 font-mono text-[9px] text-white">
            Esc
          </kbd>
          <span>close</span>
        </div>
      </div>
    </div>
  );
};

export default CursorChat;
