import { Mic } from "lucide-react";

interface VoiceRecorderProps {
  isRecording: boolean;
}

export const VoiceRecorder = ({ isRecording }: VoiceRecorderProps) => {
  if (!isRecording) return null;

  return (
    <div className="flex items-center justify-center p-4 bg-[#FAFAFA] border-t border-gray-200">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
          <Mic className="w-6 h-6 text-red-500 animate-bounce" />
        </div>
        <span className="text-sm text-gray-500 font-medium">Recording... Tap mic to stop</span>
      </div>
    </div>
  );
};
