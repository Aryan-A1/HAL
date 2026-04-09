import { ChatMessage as ChatMessageType } from "../../store/useChatStore";

export const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  const isUser = message.role === "user";

  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      return (
        <p key={i} className="mb-2 last:mb-0 min-h-[1.25rem]">
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={j} className="font-extrabold text-[#1B5E20] border-b border-[#A5D6A7]/30">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith("*") && part.endsWith("*")) {
              return <em key={j} className="italic text-gray-700">{part.slice(1, -1)}</em>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
          isUser
            ? "bg-[#1B5E20] text-[#FAFAFA] rounded-br-sm"
            : "bg-white border border-[#A5D6A7] text-gray-800 rounded-bl-sm"
        }`}
      >
        <div className="text-[15px] leading-relaxed">
          {formatContent(message.content)}
        </div>
      </div>
    </div>
  );
};
