import { create } from 'zustand';

export type ChatRole = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  language?: string;
  isAudio?: boolean;
}

interface ChatStore {
  messages: ChatMessage[];
  isOpen: boolean;
  language: string;
  isVoiceMode: boolean;
  isTyping: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setLanguage: (lang: string) => void;
  setVoiceMode: (mode: boolean) => void;
  setIsTyping: (typing: boolean) => void;
  addMessage: (msg: Omit<ChatMessage, 'id'>) => void;
  clearMessages: () => void;
}

// Initial welcome message
const initialMessages: ChatMessage[] = [
  {
    id: 'welcome-msg',
    role: 'bot',
    content: 'Hello! I am HAL AI, your farming assistant. Ask me anything about crops, irrigation, or diseases.',
    language: 'en'
  }
];

export const useChatStore = create<ChatStore>((set) => ({
  messages: initialMessages,
  isOpen: false,
  language: 'en',
  isVoiceMode: false,
  isTyping: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  setLanguage: (language) => set({ language }),
  setVoiceMode: (isVoiceMode) => set({ isVoiceMode }),
  setIsTyping: (isTyping) => set({ isTyping }),
  addMessage: (msg) => 
    set((state) => ({
      messages: [...state.messages, { ...msg, id: crypto.randomUUID() }]
    })),
  clearMessages: () => set({ messages: initialMessages }),
}));
