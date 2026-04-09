import { useChatStore } from "../../store/useChatStore";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी (Hindi)" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useChatStore();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="bg-transparent text-sm text-[#FAFAFA] border border-[#A5D6A7]/30 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#A5D6A7]"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code} className="text-[#1B5E20]">
          {lang.label}
        </option>
      ))}
    </select>
  );
};
