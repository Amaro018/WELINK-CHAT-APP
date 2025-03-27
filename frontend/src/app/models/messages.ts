// models/message.ts (or define it in ChatApp)
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
  isRead?: boolean;
  createdAt: string;
}
