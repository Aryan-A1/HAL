import { Send, Mic, MicOff, Volume2, Square, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { toast } from "sonner";
import { getBaseUrl } from "../../services/apiService";

import { useTranslation } from "@/hooks/useTranslation";

export const ChatInput = () => {
  const [text, setText] = useState("");
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { addMessage, isVoiceMode, setVoiceMode, setIsTyping, isTyping } = useChatStore();
  const { t } = useTranslation();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopResponse = () => {
    // Abort API call
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Stop audio playback
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    setIsTyping(false);
    setIsPlaying(false);
    toast.info("Response stopped");
  };

  const toggleListening = async () => {
    if (isListening) {
      mediaRecorderRef.current?.stop();
      setIsListening(false);
      setVoiceMode(false);
    } else {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Browser does not support mic access or non-secure context");
        toast.error("Microphone access is not supported in this environment. Please ensure you are using HTTPS or localhost.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        
        const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : MediaRecorder.isTypeSupported('audio/ogg') 
            ? 'audio/ogg' 
            : 'audio/wav';

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const fileExtension = mimeType.split('/')[1].split(';')[0];
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          await handleSend(audioBlob, `recording.${fileExtension}`);
          // Stop all tracks to release the microphone
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsListening(true);
        setVoiceMode(true);
        toast.info("Listening...");
      } catch (error: any) {
        console.error("Microphone access error:", error);
        if (error.name === 'NotAllowedError') {
          toast.error("Microphone permission denied.");
        } else {
          toast.error("Could not access microphone: " + error.message);
        }
      }
    }
  };

  const handleSend = async (audioBlob?: Blob, filename: string = "recording.wav") => {
    const messageText = text.trim();
    if (!messageText && !audioBlob) return;

    // Clear any previous audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsPlaying(false);
    }

    let userMsgId = "";
    if (!audioBlob) {
      addMessage({ role: "user", content: messageText });
      setText("");
    } else {
      userMsgId = addMessage({ role: "user", content: "🎤 Sent a voice message" });
    }
    
    setIsTyping(true);
    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      if (audioBlob) {
        formData.append("audio", audioBlob, filename);
      } else {
        formData.append("message", messageText);
      }

      const response = await fetch(`${getBaseUrl()}/api/chat`, {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Backend unavailable");

      const data = await response.json();
      
      // Update user message with transcription if available
      if (audioBlob && data.transcription) {
        useChatStore.getState().updateMessage(userMsgId, `🎤 ${data.transcription}`);
      }

      addMessage({
        role: "bot",
        content: data.reply || "I'm sorry, I couldn't process that.",
      });

      // Handle voice output if speaker is on
      if (isSpeakerOn && data.voice) {
        const audio = new Audio(`${getBaseUrl()}${data.voice}`);
        audio.playbackRate = 1.15;
        currentAudioRef.current = audio;
        setIsPlaying(true);
        audio.play().catch(e => {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
        });
        audio.onended = () => {
          if (currentAudioRef.current === audio) {
            currentAudioRef.current = null;
            setIsPlaying(false);
          }
        };
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log("Fetch aborted");
      } else {
        console.error("Chat error:", error);
        addMessage({
          role: "bot",
          content: "Something went wrong. Please try again.",
        });
        toast.error("Failed to connect to HAL AI.");
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const showStop = isTyping || isPlaying;

  return (
    <div className="p-3 bg-white border-t border-gray-200 rounded-b-xl flex gap-2 items-center">
      <button
        type="button"
        onClick={toggleListening}
        className={`p-2 rounded-full transition-colors ${
          isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#1B5E20]"
        }`}
        aria-label={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={isTyping}
        placeholder={isListening ? t.chatbot.listening : isTyping ? t.chatbot.typing : t.chatbot.placeholder}
        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A5D6A7] focus:border-transparent disabled:opacity-70"
      />

      <button
        type="button"
        onClick={() => setIsSpeakerOn(!isSpeakerOn)}
        className="p-2 text-gray-500 hover:text-[#1B5E20] transition-colors"
        aria-label="Toggle voice output"
      >
        {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <Volume2 className="w-5 h-5 opacity-30" />}
      </button>

      {showStop ? (
        <button
          onClick={stopResponse}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg animate-in fade-in zoom-in duration-200"
          aria-label="Stop response"
        >
          <Square className="w-5 h-5 fill-current" />
        </button>
      ) : (
        <button
          onClick={() => handleSend()}
          disabled={!text.trim() && !isListening}
          className="p-2 bg-[#1B5E20] text-[#FAFAFA] rounded-full hover:bg-[#1B5E20]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};



