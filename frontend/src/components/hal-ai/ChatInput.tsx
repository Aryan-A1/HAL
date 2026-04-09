import { Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../../store/useChatStore";

export const ChatInput = () => {
  const [text, setText] = useState("");
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const { addMessage, isVoiceMode, setVoiceMode, setIsTyping } = useChatStore();

  const handleSend = () => {
    if (!text.trim() && !isVoiceMode) return;
    
    // If we're simply stopping recording, simulate a voice transcript
    if (isVoiceMode) {
      addMessage({
        role: "user",
        content: "How much water does my wheat crop need this week?",
      });
      setVoiceMode(false);
      simulateBotResponse();
      return;
    }

    // Normal text message Send
    addMessage({ role: "user", content: text.trim() });
    setText("");
    simulateBotResponse();
  };

  const simulateBotResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage({
        role: "bot",
        content: "Based on the recent weather, your wheat needs about 1-1.5 inches of water this week. Ensure the soil remains moist but not waterlogged.",
      });
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="p-3 bg-white border-t border-gray-200 rounded-b-xl flex gap-2 items-center">
      <button
        type="button"
        onClick={() => setVoiceMode(!isVoiceMode)}
        className={`p-2 rounded-full transition-colors ${
          isVoiceMode ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#1B5E20]"
        }`}
        aria-label="Toggle voice input"
      >
        {isVoiceMode ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder={isVoiceMode ? "Listening..." : "Ask about crops, irrigation, disease..."}
        disabled={isVoiceMode}
        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A5D6A7] focus:border-transparent disabled:opacity-50"
      />

      <button
        type="button"
        onClick={() => setIsSpeakerOn(!isSpeakerOn)}
        className="p-2 text-gray-500 hover:text-[#1B5E20] transition-colors"
        aria-label="Toggle voice output"
      >
        {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      <button
        onClick={handleSend}
        disabled={(!text.trim() && !isVoiceMode)}
        className="p-2 bg-[#1B5E20] text-[#FAFAFA] rounded-full hover:bg-[#1B5E20]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};
