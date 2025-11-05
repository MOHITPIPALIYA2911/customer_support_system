import React from "react";
import { Message, FileAttachment } from "@/types";
import { Bot, User, Headphones, File, Image, FileText, Download } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isCustomer?: boolean;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return <Image className="w-5 h-5" />;
  }
  if (type.includes('pdf') || type.includes('document')) {
    return <FileText className="w-5 h-5" />;
  }
  return <File className="w-5 h-5" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const FileAttachmentDisplay: React.FC<{ attachment: FileAttachment; isOwnMessage: boolean }> = ({ attachment, isOwnMessage }) => {
  const isImage = attachment.type.startsWith('image/');
  
  return (
    <div className={`mt-2 rounded-xl overflow-hidden border shadow-sm ${
      isOwnMessage 
        ? 'border-blue-400/40 bg-blue-500/15 backdrop-blur-sm' 
        : 'border-gray-300/50 dark:border-gray-700/50 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm'
    }`}>
      {isImage && attachment.url ? (
        <div className="relative">
          <img 
            src={attachment.url} 
            alt={attachment.name}
            className="w-full max-w-xs h-auto object-cover"
          />
        </div>
      ) : null}
      <div className={`p-3 flex items-center gap-3 ${isImage ? 'border-t border-gray-200/50 dark:border-gray-700/50' : ''}`}>
        <div className={`flex-shrink-0 ${
          isOwnMessage ? 'text-blue-200' : 'text-gray-600 dark:text-gray-400'
        }`}>
          {getFileIcon(attachment.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${
            isOwnMessage ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            {attachment.name}
          </p>
          <p className={`text-xs mt-0.5 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {formatFileSize(attachment.size)}
          </p>
        </div>
        <a
          href={attachment.url || '#'}
          download={attachment.name}
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
            isOwnMessage 
              ? 'text-blue-100 hover:bg-blue-500/30' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Download file"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

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
      className={`flex items-start gap-3 mb-5 animate-slide-up ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
          isBot
            ? "bg-gradient-to-br from-blue-500 to-blue-600"
            : isAgent
            ? "bg-gradient-to-br from-green-500 to-green-600"
            : isOwnMessage
            ? "bg-gradient-to-br from-purple-500 to-purple-600"
            : "bg-gradient-to-br from-gray-400 to-gray-500"
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
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1.5 font-semibold px-1">{message.senderName}</div>
        )}
        <div
          className={`rounded-2xl px-4 py-2.5 shadow-sm ${
            isOwnMessage
              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-blue-500/20"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm border border-gray-200/50 dark:border-gray-700/50 shadow-gray-200/50 dark:shadow-gray-900/50"
          }`}
        >
          {message.content && (
            <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
              isOwnMessage ? "text-white" : "text-gray-900 dark:text-white"
            }`}>{message.content}</p>
          )}
          {message.attachments && message.attachments.length > 0 && (
            <div className="space-y-2 mt-2">
              {message.attachments.map((attachment) => (
                <FileAttachmentDisplay 
                  key={attachment.id} 
                  attachment={attachment} 
                  isOwnMessage={isOwnMessage}
                />
              ))}
            </div>
          )}
        </div>
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
