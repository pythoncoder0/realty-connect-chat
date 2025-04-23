
import { create } from 'zustand';
import { Property, User, Message } from '@/lib/types';

interface AppState {
  properties: Property[];
  filteredProperties: Property[];
  selectedProperty: Property | null;
  user: User | null;
  messages: Record<string, Message[]>;
  
  // Actions
  setProperties: (properties: Property[]) => void;
  setFilteredProperties: (properties: Property[]) => void;
  selectProperty: (property: Property | null) => void;
  setUser: (user: User | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  properties: [],
  filteredProperties: [],
  selectedProperty: null,
  user: null,
  messages: {},
  
  setProperties: (properties) => set({ properties, filteredProperties: properties }),
  setFilteredProperties: (properties) => set({ filteredProperties: properties }),
  selectProperty: (property) => set({ selectedProperty: property }),
  setUser: (user) => set({ user }),
  addMessage: (chatId, message) => 
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message]
      }
    })),
  logout: () => set({ user: null }),
}));
