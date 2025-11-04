// User Types
export type UserRole = 'customer' | 'agent';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  username?: string;
  email?: string;
  avatar?: string;
}

export interface Customer extends User {
  role: 'customer';
  phone: string;
  loanApplications?: LoanApplication[];
}

export interface Agent extends User {
  role: 'agent';
  username: string;
  status: 'online' | 'offline' | 'busy';
}

// Loan Types
export type LoanType = 'Business' | 'Personal' | 'MSME';
export type LoanStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed';

export interface LoanApplication {
  id: string;
  customerId: string;
  type: LoanType;
  amount: number;
  status: LoanStatus;
  appliedDate: string;
  lastUpdated: string;
  documents: string[];
}

// Message Types
export type MessageSender = 'customer' | 'bot' | 'agent';

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  senderName: string;
  senderId?: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

// Conversation Types
export type ConversationStatus = 'active' | 'waiting' | 'resolved' | 'escalated';

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  status: ConversationStatus;
  priority: 'low' | 'medium' | 'high';
  category: 'loan_application' | 'document_query' | 'status_check' | 'general' | 'escalation';
  assignedAgentId?: string;
  assignedAgentName?: string;
  messages: Message[];
  createdAt: Date;
  lastMessageAt: Date;
  resolvedAt?: Date;
  tags?: string[];
  internalNotes?: InternalNote[];
}

export interface InternalNote {
  id: string;
  agentId: string;
  agentName: string;
  content: string;
  timestamp: Date;
}

// Ticket Types
export interface Ticket {
  id: string;
  conversationId: string;
  customerId: string;
  customerName: string;
  subject: string;
  status: ConversationStatus;
  priority: 'low' | 'medium' | 'high';
  category: string;
  assignedAgentId?: string;
  createdAt: Date;
  lastUpdated: Date;
  unreadCount: number;
}

// Quick Reply Template
export interface QuickReply {
  id: string;
  title: string;
  content: string;
  category: string;
}

// Bot Flow Types
export type BotFlowType = 
  | 'greeting'
  | 'loan_application'
  | 'document_requirements'
  | 'status_check'
  | 'escalation'
  | 'general_query';

export interface BotResponse {
  message: string;
  options?: BotOption[];
  requiresInput?: boolean;
  inputType?: 'text' | 'number' | 'phone';
  nextFlow?: BotFlowType;
}

export interface BotOption {
  id: string;
  label: string;
  value: string;
  nextFlow?: BotFlowType;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  login: (phone: string, role: UserRole) => Promise<boolean>;
  loginCustomer: (username: string, password: string) => Promise<boolean>;
  loginAgent: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  sendMessage: (conversationId: string, content: string, sender: MessageSender, senderId?: string, senderName?: string) => void;
  createConversation: (customer: Customer) => string;
  getConversation: (conversationId: string) => Conversation | undefined;
  updateConversationStatus: (conversationId: string, status: ConversationStatus) => void;
  assignAgent: (conversationId: string, agentId: string, agentName: string) => void;
  setActiveConversation: (conversationId: string | null) => void;
  addInternalNote: (conversationId: string, note: string, agentId: string, agentName: string) => void;
  markMessagesAsRead: (conversationId: string) => void;
  getUnreadCount: (conversationId: string) => number;
}

