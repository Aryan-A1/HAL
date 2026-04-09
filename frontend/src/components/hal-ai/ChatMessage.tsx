import { ChatMessage as ChatMessageType } from "../../store/useChatStore";

export const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? "bg-[#1B5E20] text-[#FAFAFA] rounded-br-sm"
            : "bg-white border border-[#A5D6A7] text-gray-800 rounded-bl-sm shadow-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};
