'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { AgentLogin } from '@/components/AgentLogin';
import { TicketCard } from '@/components/TicketCard';
import { ChatMessage } from '@/components/ChatMessage';
import { CustomerInfoPanel } from '@/components/CustomerInfoPanel';
import { QuickReplyPanel } from '@/components/QuickReplyPanel';
import { Send, LogOut, CheckCircle2, AlertTriangle, StickyNote, Filter, Menu, X, ArrowLeft, User, Mic, MicOff, Paperclip, Search } from 'lucide-react';
import { Agent } from '@/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { FileAttachment } from '@/types';

export default function SupportDashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const {
    conversations,
    activeConversation,
    sendMessage,
    updateConversationStatus,
    assignAgent,
    setActiveConversation,
    addInternalNote,
    markMessagesAsRead,
    getUnreadCount,
  } = useChat();

  const [inputMessage, setInputMessage] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [mobileView, setMobileView] = useState<'tickets' | 'chat'>('tickets');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech recognition
  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition();

  // Handle window resize to reset mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // On desktop, always show both panels if conversation is active
        if (activeConversation && mobileView === 'chat') {
          // Keep the view as is, but ensure both panels are visible on desktop
        }
      } else {
        // On mobile, if no conversation is active, show tickets
        if (!activeConversation && mobileView === 'chat') {
          setMobileView('tickets');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeConversation, mobileView]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (activeConversation) {
      markMessagesAsRead(activeConversation.id);
    }
  }, [activeConversation?.id]);

  // Switch back to tickets view on mobile when conversation is closed
  useEffect(() => {
    if (!activeConversation && window.innerWidth < 768) {
      setMobileView('tickets');
    }
  }, [activeConversation]);

  // Update input message when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  // Handle speech recognition toggle
  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove file from selection
  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Convert File to FileAttachment
  const convertFileToAttachment = (file: File): FileAttachment => {
    const fileId = `file-${Date.now()}-${Math.random()}`;
    // Create mock URL for preview (using FileReader for images)
    let url: string | undefined;
    if (file.type.startsWith('image/')) {
      url = URL.createObjectURL(file);
    }
    return {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      url,
    };
  };

  const handleSendMessage = () => {
    if ((!inputMessage.trim() && selectedFiles.length === 0) || !activeConversation || !user) return;

    // Stop listening if active
    if (isListening) {
      stopListening();
    }

    // Assign agent to conversation if not already assigned
    if (!activeConversation.assignedAgentId) {
      assignAgent(activeConversation.id, user.id, user.name);
    }

    const attachments: FileAttachment[] = selectedFiles.map(convertFileToAttachment);
    sendMessage(
      activeConversation.id, 
      inputMessage.trim() || (attachments.length > 0 ? '📎 Attached file(s)' : ''), 
      'agent', 
      user.id, 
      user.name,
      attachments.length > 0 ? attachments : undefined
    );
    setInputMessage('');
    setSelectedFiles([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResolveTicket = () => {
    if (!activeConversation) return;
    updateConversationStatus(activeConversation.id, 'resolved');
  };

  const handleEscalateTicket = () => {
    if (!activeConversation) return;
    updateConversationStatus(activeConversation.id, 'escalated');
  };

  const handleAddNote = () => {
    if (!noteText.trim() || !activeConversation || !user) return;
    addInternalNote(activeConversation.id, noteText, user.id, user.name);
    setNoteText('');
    setShowNoteInput(false);
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    const conv = conversations.find(c => c.id === conversationId);

    // Auto-assign agent if conversation is not assigned
    if (conv && !conv.assignedAgentId && user) {
      assignAgent(conversationId, user.id, user.name);
    }

    // Switch to chat view on mobile
    if (window.innerWidth < 768) {
      setMobileView('chat');
    }
  };

  const handleQuickReply = (content: string) => {
    setInputMessage(content);
  };

  if (!isAuthenticated) {
    return <AgentLogin />;
  }

  // Search function
  const searchConversations = (query: string, conversations: any[]) => {
    if (!query.trim()) return conversations;
    
    const searchTerm = query.toLowerCase().trim();
    return conversations.filter(conv => {
      // Search in customer name
      if (conv.customerName.toLowerCase().includes(searchTerm)) return true;
      
      // Search in customer phone
      if (conv.customerPhone.toLowerCase().includes(searchTerm)) return true;
      
      // Search in conversation ID
      if (conv.id.toLowerCase().includes(searchTerm)) return true;
      
      // Search in category
      if (conv.category.toLowerCase().includes(searchTerm)) return true;
      
      // Search in status
      if (conv.status.toLowerCase().includes(searchTerm)) return true;
      
      // Search in assigned agent name
      if (conv.assignedAgentName?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in messages
      const messageMatch = conv.messages.some((msg: any) => 
        msg.content.toLowerCase().includes(searchTerm)
      );
      if (messageMatch) return true;
      
      return false;
    });
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'assigned') return conv.assignedAgentId === user?.id;
    return conv.status === filterStatus;
  });

  // Apply search filter
  const searchedConversations = searchConversations(searchQuery, filteredConversations);

  // Sort by last message time
  const sortedConversations = [...searchedConversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  return (
    <div className="h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base md:text-lg">K</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Support Dashboard</h1>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Welcome, {user?.name}</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold text-gray-900 dark:text-white">
                {mobileView === 'chat' ? 'Chat' : 'Tickets'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Panel - Ticket Queue */}
        <div
          className={`${
            mobileView === 'tickets' ? 'flex' : 'hidden'
          } md:flex w-full md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col min-h-0 overflow-hidden`}
        >
          <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 bg-white dark:bg-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm md:text-base">Tickets Queue</h2>
            
            {/* Search Input */}
            <div className="mb-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tickets..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['all', 'active', 'assigned', 'resolved'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 md:py-1 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors touch-manipulation ${
                    filterStatus === status
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'assigned' ? 'My Tickets' : status}
                </button>
              ))}
            </div>
            {searchQuery && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Found {sortedConversations.length} ticket{sortedConversations.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {sortedConversations.length > 0 ? (
              sortedConversations.map(conv => (
                <TicketCard
                  key={conv.id}
                  conversation={conv}
                  isActive={activeConversation?.id === conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  unreadCount={getUnreadCount(conv.id)}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                {searchQuery ? (
                  <>
                    <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">No tickets found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      No tickets match your search "{searchQuery}"
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Clear Search
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 dark:text-gray-400">No tickets found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      {filterStatus === 'all' 
                        ? 'Waiting for customer inquiries...'
                        : `No ${filterStatus} tickets`}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - Chat */}
        <div
          className={`${
            mobileView === 'chat' ? 'flex' : 'hidden'
          } md:flex flex-1 flex-col bg-gray-50 dark:bg-gray-900 relative min-h-0 overflow-hidden`}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 md:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => setMobileView('tickets')}
                    className="md:hidden flex-shrink-0 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Back to tickets"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">
                      {activeConversation.customerName}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {activeConversation.customerPhone}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCustomerInfo(!showCustomerInfo)}
                    className="md:hidden flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Customer info"
                  >
                    <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
                <div className="hidden md:flex gap-2">
                  <button
                    onClick={handleEscalateTicket}
                    disabled={activeConversation.status === 'resolved'}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Escalate
                  </button>
                  <button
                    onClick={handleResolveTicket}
                    disabled={activeConversation.status === 'resolved'}
                    className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Resolve
                  </button>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex gap-2">
                <button
                  onClick={handleEscalateTicket}
                  disabled={activeConversation.status === 'resolved'}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Escalate
                </button>
                <button
                  onClick={handleResolveTicket}
                  disabled={activeConversation.status === 'resolved'}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Resolve
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 md:py-6 custom-scrollbar">
                {activeConversation.messages.map(message => (
                  <ChatMessage key={message.id} message={message} isCustomer={false} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 md:p-4">
                {showNoteInput ? (
                  <div className="mb-3">
                    <div className="flex items-start gap-2">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add internal note (not visible to customer)..."
                        className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                      />
                      <button
                        onClick={handleAddNote}
                        className="px-3 md:px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium touch-manipulation"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowNoteInput(false)}
                        className="px-3 md:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium touch-manipulation"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center gap-2 mb-2">
                  <QuickReplyPanel onSelectReply={handleQuickReply} />
                  <button
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    className="flex items-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors text-xs md:text-sm font-medium touch-manipulation"
                  >
                    <StickyNote className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Add Note</span>
                    <span className="sm:hidden">Note</span>
                  </button>
                </div>

                {speechError && (
                  <div className="mb-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-xs text-red-600 dark:text-red-400">{speechError}</p>
                  </div>
                )}
                {isListening && (
                  <div className="mb-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-green-600 dark:text-green-400">Listening...</p>
                  </div>
                )}
                {selectedFiles.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg text-sm"
                      >
                        <span className="text-green-700 dark:text-green-300 truncate max-w-[150px]">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
                          aria-label="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={activeConversation.status === 'resolved'}
                    className="p-2.5 md:p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex-shrink-0"
                    title="Attach file"
                  >
                    <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  {isSpeechSupported && (
                    <button
                      onClick={handleToggleListening}
                      disabled={activeConversation.status === 'resolved'}
                      className={`p-2.5 md:p-3 rounded-full transition-colors flex-shrink-0 touch-manipulation ${
                        isListening
                          ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                      {isListening ? (
                        <MicOff className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        <Mic className="w-4 h-4 md:w-5 md:h-5" />
                      )}
                    </button>
                  )}
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={activeConversation.status === 'resolved'}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={(!inputMessage.trim() && selectedFiles.length === 0) || activeConversation.status === 'resolved'}
                    className="bg-green-600 text-white p-2.5 md:p-3 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex-shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 md:w-12 md:h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">No Conversation Selected</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Select a ticket from the queue to start chatting</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Customer Info */}
        {activeConversation && (
          <>
            {/* Desktop Customer Info Panel (independent scroll) */}
            <div className="hidden md:block w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
              <CustomerInfoPanel conversation={activeConversation} />
            </div>

            {/* Mobile Customer Info Panel - Overlay */}
            {showCustomerInfo && (
              <div className="md:hidden fixed inset-0 z-50">
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setShowCustomerInfo(false)}
                />
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
                    <h2 className="font-semibold text-gray-900 dark:text-white">Customer Info</h2>
                    <button
                      onClick={() => setShowCustomerInfo(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                  <CustomerInfoPanel conversation={activeConversation} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
