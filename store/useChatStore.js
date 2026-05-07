import { create } from 'zustand';

export const useChatStore = create((set) => ({
  chats: [],
  currentChatId: null,
  messages: [],
  isLoading: false,

  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  removeChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((c) => c._id !== id),
      currentChatId: state.currentChatId === id ? null : state.currentChatId,
    })),
  setCurrentChatId: (id) => set({ currentChatId: id }),
  
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  updateChatTitle: (id, title) => set((state) => ({
     chats: state.chats.map(c => c._id === id ? { ...c, title } : c)
  }))
}));
