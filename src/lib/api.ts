import axios from 'axios';
import { Property, User, PropertyFilter, Message, MessageConversation } from '@/lib/types';
import { mockProperties, mockUsers, mockMessages } from '@/lib/mockData';

// This is a mock API service that simulates API calls
// In a real application, these would make actual HTTP requests to a backend server

// Create axios instance for real API calls when ready
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication
export const login = async (email: string, password: string): Promise<User> => {
  // In a real app, this would make an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      if (user && password === 'password') { // Simple password check for demo
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500);
  });
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
  // In a real app, this would make an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers.some(u => u.email === email)) {
        reject(new Error('Email already in use'));
      } else {
        const newUser: User = {
          id: `user${mockUsers.length + 1}`,
          name,
          email,
          role: 'user',
        };
        // In a real app, we would save this user to the database
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve(newUser);
      }
    }, 500);
  });
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

export const logout = () => {
  localStorage.removeItem('user');
};

// Properties
export const getProperties = async (): Promise<Property[]> => {
  // In a real app, this would make an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProperties);
    }, 500);
  });
};

export const getPropertyById = async (id: string): Promise<Property> => {
  // In a real app, this would make an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const property = mockProperties.find(p => p.id === id);
      if (property) {
        resolve(property);
      } else {
        reject(new Error('Property not found'));
      }
    }, 300);
  });
};

export const filterProperties = (properties: Property[], filters: PropertyFilter): Property[] => {
  return properties.filter(property => {
    // Filter by type
    if (filters.type && filters.type !== 'all' && property.type !== filters.type) {
      return false;
    }
    
    // Filter by price range
    if (filters.minPrice !== undefined && property.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && property.price > filters.maxPrice) {
      return false;
    }
    
    // Filter by bedrooms
    if (filters.bedrooms !== undefined && property.bedrooms < filters.bedrooms) {
      return false;
    }
    
    // Filter by bathrooms
    if (filters.bathrooms !== undefined && property.bathrooms < filters.bathrooms) {
      return false;
    }
    
    // Filter by search query (title, description, address)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.location.address.toLowerCase().includes(query) ||
        property.location.city.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
};

// Messages
export const getMessages = async (chatId: string): Promise<Message[]> => {
  // In a real app, this would make an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMessages[chatId] || []);
    }, 300);
  });
};

export const sendMessage = async (
  chatId: string, 
  text: string, 
  senderId: string, 
  senderName: string,
  receiverId: string
): Promise<Message> => {
  // In a real app, this would make an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        text,
        senderId,
        senderName,
        receiverId,
        timestamp: new Date().toISOString(),
      };
      
      // In a real app, the backend would handle storing the message
      if (!mockMessages[chatId]) {
        mockMessages[chatId] = [];
      }
      mockMessages[chatId].push(newMessage);
      
      resolve(newMessage);
    }, 200);
  });
};

// User Conversations
export const getUserConversations = async (userId: string): Promise<MessageConversation[]> => {
  // In a real app, this would make an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create mock conversations based on the existing messages
      const conversations: MessageConversation[] = [];
      const processedChatIds = new Set();
      
      // Process all chat IDs to find unique conversations
      Object.entries(mockMessages).forEach(([chatId, messages]) => {
        if (messages.length === 0 || processedChatIds.has(chatId)) return;
        
        const lastMessage = messages[messages.length - 1];
        
        // Check if the user is part of this conversation
        const isUserSender = lastMessage.senderId === userId;
        const isUserReceiver = lastMessage.receiverId === userId;
        
        if (!isUserSender && !isUserReceiver) return;
        
        // Find the property related to this chat
        const [propertyId] = chatId.split('_');
        const property = mockProperties.find(p => p.id === propertyId);
        if (!property) return;
        
        // Determine the other user in the conversation
        const otherUserId = isUserSender ? lastMessage.receiverId : lastMessage.senderId;
        const otherUser = mockUsers.find(u => u.id === otherUserId);
        if (!otherUser) return;
        
        conversations.push({
          id: chatId,
          propertyId: property.id,
          propertyTitle: property.title,
          otherUserId: otherUser.id,
          otherUserName: otherUser.name,
          lastMessageText: lastMessage.text,
          lastMessageAt: lastMessage.timestamp,
          unreadCount: Math.floor(Math.random() * 3) // Random unread count for demo
        });
        
        processedChatIds.add(chatId);
      });
      
      resolve(conversations);
    }, 800);
  });
};

// New function to publish a property
export const publishProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
  // In a real app, this would make an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProperty: Property = {
        ...propertyData,
        id: `property${mockProperties.length + 1}`,
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, we would save this to the database
      mockProperties.unshift(newProperty);
      
      resolve(newProperty);
    }, 800);
  });
};
