export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface Message {
  id: string;
  chatId: number;
  text: string;
  timestamp: number;
  isOutgoing: boolean;
  isRead: boolean;
}

export interface Chat {
  id: number;
  user: User;
  messages: Message[];
  isOnline: boolean;
  unreadCount: number;
}

export type TextFormat = 'bold' | 'italic';
