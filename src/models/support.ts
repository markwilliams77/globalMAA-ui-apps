export type SupportThreadStatus = "open" | "closed" | "pending" | string;
export type SupportSenderRole = "admin" | "vendor" | "patient" | string;

export interface SupportMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderRole: SupportSenderRole;
  text: string;
  time?: string;
  createdAt?: string;
}

export interface SupportThread {
  id: string;
  userId: string;
  subject: string;
  status: SupportThreadStatus;
  lastUpdated: string;
  messages?: SupportMessage[];
}

export interface SupportQuery {
  userId?: string;
  threadId?: string;
}

export interface SupportResponse {
  threads: SupportThread[];
}

export interface CreateSupportThreadRequest {
  userId: string;
  subject: string;
  initialMessage: string;
  type?: string;
  priority?: string;
}

export interface CreateSupportThreadResponse {
  success: boolean;
  threadId?: string;
}

export interface CreateSupportMessageRequest {
  threadId: string;
  senderId: string;
  senderRole: SupportSenderRole;
  text: string;
}

export interface CreateSupportMessageResponse {
  success: boolean;
  messageId?: string;
}
