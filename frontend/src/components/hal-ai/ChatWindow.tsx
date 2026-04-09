import { ChatHeader } from "./ChatHeader";
import { ChatBody } from "./ChatBody";
import { ChatInput } from "./ChatInput";
import { useChatStore } from "../../store/useChatStore";

export const ChatWindow = () => {
  const { isOpen, isExpanded, setIsExpanded } = useChatStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay when Expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div className={`fixed z-[9999] bg-[#FAFAFA] shadow-2xl flex flex-col border border-[#A5D6A7] transition-all duration-500 ease-in-out ${
        isExpanded 
          ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-[70vw] h-[85vh] rounded-2xl scale-100" 
          : "bottom-20 right-4 sm:right-6 w-[90vw] sm:w-[400px] h-auto max-h-[80vh] rounded-xl animate-in slide-in-from-bottom-5"
      }`}>
        <ChatHeader />
        <ChatBody />
        <ChatInput />
      </div>
    </>
  );
};
