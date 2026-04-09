import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import { ChatMessage } from "./ChatMessage";
import { VoiceRecorder } from "./VoiceRecorder";

export const ChatBody = () => {
  const { messages, isVoiceMode, isTyping } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isVoiceMode, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-[#FAFAFA] flex flex-col">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isTyping && (
        <div className="flex w-full justify-start mb-4">
          <div className="bg-white border border-[#A5D6A7] text-gray-500 text-sm italic rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            HAL AI is typing...
          </div>
        </div>
      )}
      <VoiceRecorder isRecording={isVoiceMode} />
      <div ref={bottomRef} />
    </div>
  );
};
