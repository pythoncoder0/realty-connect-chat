
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  images: string[];
  featured: boolean;
  type: 'sale' | 'rent';
  createdAt: string;
  ownerId: string;
  ownerName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'agent' | 'admin';
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  timestamp: string;
}

export interface MessageConversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  otherUserId: string;
  otherUserName: string;
  lastMessageText: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface PropertyFilter {
  type?: 'sale' | 'rent' | 'all';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  searchQuery?: string;
}
