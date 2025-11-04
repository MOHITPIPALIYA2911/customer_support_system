import React from 'react';
import { Conversation } from '@/types';
import { Clock, AlertCircle, CheckCircle2, User } from 'lucide-react';

interface TicketCardProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  unreadCount: number;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  conversation,
  isActive,
  onClick,
  unreadCount,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'escalated':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return (
    <div
      onClick={onClick}
      className={`p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 touch-manipulation ${
        isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600 dark:border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{conversation.customerName}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{conversation.customerPhone}</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
            {unreadCount}
          </span>
        )}
      </div>

      {lastMessage && (
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
          {lastMessage.sender === 'bot' ? '🤖 ' : lastMessage.sender === 'agent' ? '👤 ' : ''}
          {lastMessage.content}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(conversation.priority)}`}>
            {conversation.priority}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {getStatusIcon(conversation.status)}
            {conversation.status}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(conversation.lastMessageAt)}</span>
      </div>

      {conversation.assignedAgentName && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          🎧 {conversation.assignedAgentName}
        </div>
      )}
    </div>
  );
};

