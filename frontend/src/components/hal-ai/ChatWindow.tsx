import { ChatHeader } from "./ChatHeader";
import { ChatBody } from "./ChatBody";
import { ChatInput } from "./ChatInput";
import { useChatStore } from "../../store/useChatStore";

export const ChatWindow = () => {
  const { isOpen } = useChatStore();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 w-[90vw] sm:w-[400px] h-auto max-h-[80vh] bg-[#FAFAFA] rounded-xl shadow-2xl z-50 flex flex-col border border-[#A5D6A7] animate-in slide-in-from-bottom-5">
      <ChatHeader />
      <ChatBody />
      <ChatInput />
    </div>
  );
};
