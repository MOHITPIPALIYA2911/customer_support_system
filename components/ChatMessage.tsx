import React from "react";
import { Message } from "@/types";
import { Bot, User, Headphones } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isCustomer?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCustomer = false }) => {
  const isOwnMessage = message.sender === "customer" && isCustomer;
  const isBot = message.sender === "bot";
  const isAgent = message.sender === "agent";

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex items-start gap-2 mb-4 animate-slide-up ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot
            ? "bg-blue-500"
            : isAgent
            ? "bg-green-500"
            : isOwnMessage
            ? "bg-purple-500"
            : "bg-gray-400"
        }`}
      >
        {isBot ? (
          <Bot className="w-5 h-5 text-white" />
        ) : isAgent ? (
          <Headphones className="w-4 h-4 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[75%] ${isOwnMessage ? "items-end" : "items-start"}`}>
        {!isOwnMessage && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">{message.senderName}</div>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm"
          }`}
        >
          <p className={`text-sm whitespace-pre-wrap break-words ${
            isOwnMessage ? "text-white" : "text-gray-900 dark:text-white"
          }`}>{message.content}</p>
        </div>
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
