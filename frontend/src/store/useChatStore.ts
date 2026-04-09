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
  isExpanded: boolean;
  language: string;
  isVoiceMode: boolean;
  isTyping: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsExpanded: (isExpanded: boolean) => void;
  setLanguage: (lang: string) => void;
  setVoiceMode: (mode: boolean) => void;
  setIsTyping: (typing: boolean) => void;
  addMessage: (msg: Omit<ChatMessage, 'id'>) => string;
  updateMessage: (id: string, content: string) => void;
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

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: initialMessages,
  isOpen: false,
  isExpanded: false,
  language: 'en',
  isVoiceMode: false,
  isTyping: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  setIsExpanded: (isExpanded) => set({ isExpanded }),
  setLanguage: (language) => set({ language }),
  setVoiceMode: (isVoiceMode) => set({ isVoiceMode }),
  setIsTyping: (isTyping) => set({ isTyping }),
  addMessage: (msg) => {
    const id = generateId();
    set((state) => ({
      messages: [...state.messages, { ...msg, id }]
    }));
    return id;
  },
  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content } : m
      )
    })),
  clearMessages: () => set({ messages: initialMessages }),
}));
