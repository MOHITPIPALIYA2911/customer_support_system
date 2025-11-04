"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Conversation,
  Message,
  ChatContextType,
  Customer,
  MessageSender,
  ConversationStatus,
} from "@/types";
import { saveConversations, getConversations } from "@/utils/localStorage";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = getConversations();
    if (savedConversations && savedConversations.length > 0) {
      // Convert date strings back to Date objects
      const parsedConversations = savedConversations.map((conv) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        lastMessageAt: new Date(conv.lastMessageAt),
        resolvedAt: conv.resolvedAt ? new Date(conv.resolvedAt) : undefined,
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        internalNotes:
          conv.internalNotes?.map((note: any) => ({
            ...note,
            timestamp: new Date(note.timestamp),
          })) || [],
      }));
      setConversations(parsedConversations);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations]);

  const createConversation = (customer: Customer): string => {
    const conversationId = `conv-${Date.now()}`;
    const now = new Date();

    const newConversation: Conversation = {
      id: conversationId,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      status: "waiting", // Start as query, not active ticket
      priority: "medium",
      category: "general",
      messages: [],
      createdAt: now,
      lastMessageAt: now,
      internalNotes: [],
    };

    setConversations((prev) => [...prev, newConversation]);
    return conversationId;
  };

  const sendMessage = (
    conversationId: string,
    content: string,
    sender: MessageSender,
    senderId?: string,
    senderName?: string
  ): void => {
    const messageId = `msg-${Date.now()}-${Math.random()}`;
    const now = new Date();

    const newMessage: Message = {
      id: messageId,
      conversationId,
      sender,
      senderName: senderName || (sender === "bot" ? "KRUX Bot" : sender),
      senderId,
      content,
      timestamp: now,
      read: sender === "customer", // Customer's own messages are marked as read
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessageAt: now,
          };
        }
        return conv;
      })
    );

    // Update active conversation if it's the one being messaged
    if (activeConversation?.id === conversationId) {
      setActiveConversationState((prev) => {
        if (prev) {
          return {
            ...prev,
            messages: [...prev.messages, newMessage],
            lastMessageAt: now,
          };
        }
        return prev;
      });
    }
  };

  const getConversation = (conversationId: string): Conversation | undefined => {
    return conversations.find((conv) => conv.id === conversationId);
  };

  const updateConversationStatus = (conversationId: string, status: ConversationStatus): void => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            status,
            resolvedAt: status === "resolved" ? new Date() : conv.resolvedAt,
          };
        }
        return conv;
      })
    );

    if (activeConversation?.id === conversationId) {
      setActiveConversationState((prev) => {
        if (prev) {
          return {
            ...prev,
            status,
            resolvedAt: status === "resolved" ? new Date() : prev.resolvedAt,
          };
        }
        return prev;
      });
    }
  };

  const assignAgent = (conversationId: string, agentId: string, agentName: string): void => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            assignedAgentId: agentId,
            assignedAgentName: agentName,
            status: "active",
            category: conv.category === "general" ? "escalation" : conv.category,
          };
        }
        return conv;
      })
    );

    if (activeConversation?.id === conversationId) {
      setActiveConversationState((prev) => {
        if (prev) {
          return {
            ...prev,
            assignedAgentId: agentId,
            assignedAgentName: agentName,
            status: "active",
          };
        }
        return prev;
      });
    }
  };

  const setActiveConversation = (conversationId: string | null): void => {
    if (conversationId) {
      const conversation = getConversation(conversationId);
      setActiveConversationState(conversation || null);
    } else {
      setActiveConversationState(null);
    }
  };

  const addInternalNote = (
    conversationId: string,
    note: string,
    agentId: string,
    agentName: string
  ): void => {
    const noteId = `note-${Date.now()}`;
    const now = new Date();

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const newNote = {
            id: noteId,
            agentId,
            agentName,
            content: note,
            timestamp: now,
          };
          return {
            ...conv,
            internalNotes: [...(conv.internalNotes || []), newNote],
          };
        }
        return conv;
      })
    );
  };

  const markMessagesAsRead = (conversationId: string): void => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map((msg) => ({ ...msg, read: true })),
          };
        }
        return conv;
      })
    );

    if (activeConversation?.id === conversationId) {
      setActiveConversationState((prev) => {
        if (prev) {
          return {
            ...prev,
            messages: prev.messages.map((msg) => ({ ...msg, read: true })),
          };
        }
        return prev;
      });
    }
  };

  const getUnreadCount = (conversationId: string): number => {
    const conversation = getConversation(conversationId);
    if (!conversation) return 0;
    return conversation.messages.filter((msg) => !msg.read && msg.sender !== "customer").length;
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        sendMessage,
        createConversation,
        getConversation,
        updateConversationStatus,
        assignAgent,
        setActiveConversation,
        addInternalNote,
        markMessagesAsRead,
        getUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
