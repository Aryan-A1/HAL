import { X, Maximize2, Minimize2, Bot } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useTranslation } from "@/hooks/useTranslation";

export const ChatHeader = () => {
  const { setIsOpen, isExpanded, setIsExpanded } = useChatStore();
  const { t } = useTranslation();

  return (
    <div className="bg-[#1B5E20] p-4 flex items-center justify-between rounded-t-xl shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#FAFAFA] flex items-center justify-center border-2 border-[#A5D6A7]">
          <Bot className="w-5 h-5 text-[#1B5E20]" />
        </div>
        <div>
          <h3 className="text-[#FAFAFA] font-semibold text-lg leading-tight">{t.chatbot.title}</h3>
          <p className="text-[#A5D6A7] text-xs">Smart Farm Assistant</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#FAFAFA] hover:text-[#A5D6A7] transition-colors"
          aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
        >
          {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[#FAFAFA] hover:text-[#A5D6A7] transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
