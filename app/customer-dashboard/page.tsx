'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { CustomerLogin } from '@/components/CustomerLogin';
import { User, MessageCircle, Plus, Clock, CheckCircle2, AlertCircle, ArrowRight, LogOut, Search, X } from 'lucide-react';
import { Conversation } from '@/types';
import { getLoanApplicationsByCustomerId } from '@/utils/mockData';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function CustomerDashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const { conversations, createConversation } = useChat();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');

  // Get user's conversations
  const userConversations = conversations
    .filter(conv => conv.customerId === user?.id)
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  // Check if there's an active ticket (not just any query)
  // Users can have multiple queries (waiting status) but only one active ticket
  const hasActiveTicket = userConversations.some(conv => conv.status === 'active');

  // Get loan applications
  const loanApplications = user ? getLoanApplicationsByCustomerId(user.id) : [];

  const handleCreateNewTicket = () => {
    if (!user) return;
    // Always allow creating new queries (waiting status)
    // Only prevent escalation if there's already an active ticket
    const newConvId = createConversation(user as any);
    router.push(`/customer-chat?conversation=${newConvId}`);
  };

  const handleOpenConversation = (conversationId: string) => {
    // Ensure we're opening the correct conversation by ID
    router.push(`/customer-chat?conversation=${conversationId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'escalated':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'waiting':
        return <MessageCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'escalated':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'active':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'waiting':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Query';
      case 'active':
        return 'Active Ticket';
      case 'resolved':
        return 'Resolved';
      case 'escalated':
        return 'Escalated';
      default:
        return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Search function
  const searchConversations = (query: string, conversations: Conversation[]) => {
    if (!query.trim()) return conversations;
    
    const searchTerm = query.toLowerCase().trim();
    return conversations.filter(conv => {
      // Search in conversation ID
      if (conv.id.toLowerCase().includes(searchTerm)) return true;
      
      // Search in category
      if (conv.category.toLowerCase().includes(searchTerm)) return true;
      
      // Search in status
      if (conv.status.toLowerCase().includes(searchTerm)) return true;
      
      // Search in priority
      if (conv.priority.toLowerCase().includes(searchTerm)) return true;
      
      // Search in assigned agent name
      if (conv.assignedAgentName?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in messages
      const messageMatch = conv.messages.some(msg => 
        msg.content.toLowerCase().includes(searchTerm)
      );
      if (messageMatch) return true;
      
      return false;
    });
  };

  // Apply search filter
  const filteredConversations = searchConversations(searchQuery, userConversations);

  if (!isAuthenticated) {
    return <CustomerLogin />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">K</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">KRUX Finance</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Customer Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
            <ThemeToggle />
            <button
              onClick={logout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* User Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{user?.name}</h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Phone: {user?.phone}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 truncate">ID: {user?.id}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 truncate break-all">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {/* Always show New Query button - users can create multiple queries */}
              <button
                onClick={handleCreateNewTicket}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>New Query</span>
              </button>
              {hasActiveTicket && (
                <div className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg border border-orange-200 dark:border-orange-800">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Active Ticket Exists</span>
                </div>
              )}
            </div>
          </div>

          {/* Loan Applications Summary */}
          {loanApplications.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Loan Applications</h3>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {loanApplications.map(loan => (
                  <div key={loan.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">{loan.type} Loan</span>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                        loan.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        loan.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        loan.status === 'disbursed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {loan.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div className="truncate">Amount: ₹{loan.amount.toLocaleString('en-IN')}</div>
                      <div className="truncate">Application ID: {loan.id}</div>
                      <div className="truncate">Last Updated: {loan.lastUpdated}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Query History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Query History</h2>
            
            {/* Search Input */}
            <div className="w-full sm:w-auto sm:min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search queries..."
                className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {filteredConversations.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleOpenConversation(conversation.id)}
                  className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="flex-shrink-0">
                            {getStatusIcon(conversation.status)}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${getStatusBadgeColor(conversation.status)}`}>
                            {getStatusLabel(conversation.status)}
                          </span>
                        </div>
                        {conversation.assignedAgentName && (
                          <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            Agent: {conversation.assignedAgentName}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1 truncate">
                        {conversation.category.replace('_', ' ').toUpperCase()} - {conversation.priority} Priority
                      </h3>
                      {conversation.messages.length > 0 && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 break-words">
                          {conversation.messages[conversation.messages.length - 1].content}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="whitespace-nowrap">Created: {formatDate(conversation.createdAt)}</span>
                        <span className="whitespace-nowrap">Last: {formatDate(conversation.lastMessageAt)}</span>
                        <span className="whitespace-nowrap">{conversation.messages.length} msgs</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : userConversations.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">No Queries Yet</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-2">Start a new conversation to get support</p>
              <button
                onClick={handleCreateNewTicket}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Raise New Query</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">No Results Found</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-2">
                No queries match your search "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

