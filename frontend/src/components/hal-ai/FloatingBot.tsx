import { Bot } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { ChatWindow } from "./ChatWindow";

export const FloatingBot = () => {
  const { isOpen, setIsOpen } = useChatStore();

  return (
    <>
      <ChatWindow />
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-[#1B5E20] hover:bg-[#1B5E20]/90 text-[#FAFAFA] rounded-full shadow-xl flex items-center justify-center z-50 transition-transform hover:scale-105 animate-bounce focus:outline-none focus:ring-4 focus:ring-[#A5D6A7]"
          aria-label="Ask HAL AI"
          title="Ask HAL AI"
        >
          <Bot className="w-7 h-7 animate-pulse" />
        </button>
      )}
    </>
  );
};
