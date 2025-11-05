'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { CustomerLogin } from '@/components/CustomerLogin';
import { ChatMessage } from '@/components/ChatMessage';
import { TypingIndicator } from '@/components/TypingIndicator';
import { QuickOptions } from '@/components/QuickOptions';
import { RatingModal } from '@/components/RatingModal';
import { NotificationSettings } from '@/components/NotificationSettings';
import { Send, LogOut, ArrowLeft, Mic, MicOff, Paperclip, X } from 'lucide-react';
import Link from 'next/link';
import { Customer, BotFlowType, BotOption, FileAttachment } from '@/types';
import { getBotResponse, handleUserSelection, checkApplicationStatus } from '@/utils/botFlows';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useNotifications } from '@/hooks/useNotifications';

export default function CustomerChatPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const { conversations, createConversation, sendMessage, getConversation, updateConversationStatus, updateRating } = useChat();
  const router = useRouter();
  
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<BotOption[]>([]);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<BotFlowType>('greeting');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Track if we've checked for existing conversations
  const [hasCheckedConversations, setHasCheckedConversations] = useState(false);

  // Speech recognition
  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition();

  // Notifications
  const {
    showNotification,
    isEnabled: notificationsEnabled,
  } = useNotifications({ title: 'KRUX Finance - Customer Support' });

  // Track previous messages count to detect new messages
  const previousMessagesCountRef = useRef<number>(0);
  const previousUnreadCountRef = useRef<number>(0);

  // Get current conversation
  const currentConversation = conversationId ? getConversation(conversationId) : null;

  // Check if message indicates resolution
  const checkForResolution = (message: string): boolean => {
    const resolutionKeywords = [
      'thank you', 'thanks', 'thankyou', 'thnx',
      'done', 'resolved', 'solved',
      'got it', 'understand', 'clear', 'understood',
      'no more questions', 'all set', 'fine',
      'okay', 'ok', 'perfect', 'great',
      'no', 'nothing else', 'all good', 'no problem',
      'no thanks', 'no need', 'that\'s all'
    ];
    const lowerMessage = message.toLowerCase().trim();
    return resolutionKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Check if message requests agent
  const checkForAgentRequest = (message: string): boolean => {
    const agentKeywords = [
      'talk to agent', 'speak with agent', 'connect to agent',
      'human agent', 'talk to human', 'speak to person',
      'agent', 'representative', 'support person',
      'escalate', 'transfer'
    ];
    const lowerMessage = message.toLowerCase().trim();
    return agentKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Check if bot response asks if user needs anything else
  const checkBotAsksForMore = (botMessage: string): boolean => {
    const prompts = [
      'anything else', 'something else', 'any other',
      'help you with', 'can help', 'else i can'
    ];
    const lowerMessage = botMessage.toLowerCase();
    return prompts.some(prompt => lowerMessage.includes(prompt));
  };

  // Send bot message function
  const sendBotMessage = useCallback((flowType: BotFlowType, userInput?: string) => {
    if (!conversationId) return;
    setIsTyping(true);

    setTimeout(() => {
      let botResponse;
      
      if (flowType === 'status_check' && userInput) {
        botResponse = checkApplicationStatus(userInput);
      } else {
        botResponse = getBotResponse(flowType, userInput);
      }

      // Send bot response
      if (conversationId) {
        sendMessage(conversationId, botResponse.message, 'bot', 'bot-1', 'KRUX Bot');
        
        // Check if bot asks if user needs anything else - this is a resolution prompt
        if (checkBotAsksForMore(botResponse.message)) {
          // If bot asks and user hasn't responded yet, wait for user response
          // The resolution will be handled in handleSendMessage when user responds
        }
      }

      setCurrentOptions(botResponse.options || []);
      setWaitingForInput(botResponse.requiresInput || false);
      setIsTyping(false);
      
      if (botResponse.nextFlow) {
        setCurrentFlow(botResponse.nextFlow);
      }
    }, 1000 + Math.random() * 1000); // Simulate typing delay
  }, [conversationId, sendMessage]);

  // Check URL params for conversation ID first - this is the only way to load conversations
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated && !conversationId) {
      const params = new URLSearchParams(window.location.search);
      const convId = params.get('conversation');
      if (convId) {
        const conv = getConversation(convId);
        if (conv && conv.customerId === user?.id) {
          setConversationId(convId);
          setHasCheckedConversations(true);
          
          // Show rating modal if ticket is resolved, has an agent, and hasn't been rated
          if (
            conv.status === 'resolved' &&
            conv.assignedAgentId &&
            !conv.rating
          ) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => {
              setShowRatingModal(true);
            }, 500);
          }
          return;
        }
      } else {
        // No conversation ID in URL - redirect to dashboard
        setHasCheckedConversations(true);
        router.push('/customer-dashboard');
      }
    }
  }, [isAuthenticated, conversationId, getConversation, user, router]);

  // Check if rating modal should be shown when conversation changes
  useEffect(() => {
    if (
      currentConversation &&
      currentConversation.status === 'resolved' &&
      currentConversation.assignedAgentId &&
      !currentConversation.rating &&
      !showRatingModal
    ) {
      // Small delay to ensure user sees the resolved conversation first
      const timer = setTimeout(() => {
        setShowRatingModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentConversation, showRatingModal]);

  // Send greeting message when a new conversation is loaded (with no messages)
  useEffect(() => {
    if (conversationId && currentConversation && currentConversation.messages.length === 0 && !isTyping) {
      // Check if greeting was already sent (to prevent duplicate greetings)
      const hasGreeting = currentConversation.messages.some(
        msg => msg.sender === 'bot' && msg.content.includes('Welcome') || msg.content.includes('Hello')
      );
      
      if (!hasGreeting) {
        const timer = setTimeout(() => {
          sendBotMessage('greeting');
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [conversationId, currentConversation, sendBotMessage, isTyping]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, isTyping]);

  // Check for new messages and show notifications
  useEffect(() => {
    if (!currentConversation || !notificationsEnabled || !user) return;

    const currentMessagesCount = currentConversation.messages.length;
    const unreadCount = currentConversation.messages.filter(
      msg => !msg.read && msg.sender !== 'customer'
    ).length;

    // Check if new message arrived (not from current user viewing their own conversation)
    if (
      currentMessagesCount > previousMessagesCountRef.current &&
      previousMessagesCountRef.current > 0 // Don't notify on initial load
    ) {
      const lastMessage = currentConversation.messages[currentConversation.messages.length - 1];
      
      // Only notify if:
      // 1. Message is not from customer (customer sent it themselves)
      // 2. Message is unread
      // 3. Page is hidden (user is not actively viewing the chat) OR it's a different conversation
      const isPageHidden = typeof document !== 'undefined' && document.hidden;
      
      if (
        lastMessage.sender !== 'customer' &&
        lastMessage.senderId !== user.id &&
        !lastMessage.read &&
        isPageHidden // Only notify if page is in background
      ) {
        const senderName = lastMessage.sender === 'bot' ? 'KRUX Bot' : lastMessage.senderName;
        const messagePreview = lastMessage.content.length > 50 
          ? lastMessage.content.substring(0, 50) + '...' 
          : lastMessage.content;

        showNotification(
          `New message from ${senderName}`,
          {
            body: messagePreview,
            tag: currentConversation.id,
          }
        );
      }
    }

    previousMessagesCountRef.current = currentMessagesCount;
    previousUnreadCountRef.current = unreadCount;
  }, [currentConversation?.messages, notificationsEnabled, user, showNotification]);

  // Update page title with unread count
  useEffect(() => {
    if (!notificationsEnabled || !currentConversation) {
      document.title = 'KRUX Finance - Customer Support';
      return;
    }

    const unreadCount = currentConversation.messages.filter(
      msg => !msg.read && msg.sender !== 'customer'
    ).length;

    if (unreadCount > 0) {
      document.title = `(${unreadCount}) KRUX Finance - Customer Support`;
    } else {
      document.title = 'KRUX Finance - Customer Support';
    }
  }, [currentConversation?.messages, notificationsEnabled]);

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
    if ((!inputMessage.trim() && selectedFiles.length === 0) || !conversationId || !user) return;

    // Stop listening if active
    if (isListening) {
      stopListening();
    }

    const messageText = inputMessage.trim();
    const attachments: FileAttachment[] = selectedFiles.map(convertFileToAttachment);
    
    // Check previous bot message to see if it asked for more
    const lastBotMessage = currentConversation?.messages
      .filter(msg => msg.sender === 'bot')
      .pop();
    const botAskedForMore = lastBotMessage ? checkBotAsksForMore(lastBotMessage.content) : false;
    
    // Check if user wants to resolve/resolve query
    if (checkForResolution(messageText)) {
      // Auto-resolve conversation if bot solved it (no agent assigned)
      if (currentConversation && currentConversation.status !== 'resolved' && !currentConversation.assignedAgentId) {
        updateConversationStatus(conversationId, 'resolved');
      }
      // Also resolve if bot asked "anything else" and user says no/thanks
      if (botAskedForMore && (messageText.toLowerCase().includes('no') || messageText.toLowerCase().includes('thank'))) {
        if (currentConversation && currentConversation.status !== 'resolved' && !currentConversation.assignedAgentId) {
          updateConversationStatus(conversationId, 'resolved');
        }
      }
    }

    // Check if user requests agent - convert query to active ticket
    if (checkForAgentRequest(messageText)) {
      // Check if user already has an active ticket
      const userActiveTickets = conversations.filter(
        conv => conv.customerId === user.id && conv.status === 'active' && conv.id !== conversationId
      );
      
      if (userActiveTickets.length > 0) {
        // User already has an active ticket, don't allow escalation
        sendMessage(conversationId, `You already have an active ticket. Please wait for it to be resolved before creating a new one.`, 'bot', 'bot-1', 'KRUX Bot');
        setInputMessage('');
        setSelectedFiles([]);
        return;
      }
      
      // Mark as active ticket when user requests agent/executive
      if (currentConversation && currentConversation.status !== 'active') {
        updateConversationStatus(conversationId, 'active');
      }
    }

    // Send user message with attachments
    sendMessage(conversationId, messageText || (attachments.length > 0 ? '📎 Attached file(s)' : ''), 'customer', user.id, user.name, attachments.length > 0 ? attachments : undefined);

    // Clear input and files
    setInputMessage('');
    setSelectedFiles([]);

    // Check if waiting for specific input (like application ID)
    if (waitingForInput && currentFlow === 'status_check') {
      const userInput = messageText;
      setWaitingForInput(false);
      sendBotMessage('status_check', userInput);
    } else {
      // For general messages, provide general query response
      sendBotMessage('general_query');
    }
  };

  const handleOptionClick = (option: BotOption) => {
    if (!conversationId || !user) return;

    // Send user selection as message
    sendMessage(conversationId, option.label, 'customer', user.id, user.name);

    // Clear current options
    setCurrentOptions([]);

    // Handle escalation - convert query to active ticket when user requests agent
    if (option.value === 'agent' || option.nextFlow === 'escalation') {
      // Check if user already has an active ticket
      const userActiveTickets = conversations.filter(
        conv => conv.customerId === user.id && conv.status === 'active' && conv.id !== conversationId
      );
      
      if (userActiveTickets.length > 0) {
        // User already has an active ticket, don't allow escalation
        setIsTyping(true);
        setTimeout(() => {
          sendMessage(conversationId, `You already have an active ticket. Please wait for it to be resolved before creating a new one.`, 'bot', 'bot-1', 'KRUX Bot');
          setIsTyping(false);
        }, 500);
        return;
      }
      
      // Mark as active ticket when user explicitly requests agent/executive
      if (currentConversation && currentConversation.status !== 'active') {
        updateConversationStatus(conversationId, 'active');
      }
      sendBotMessage('escalation');
      return;
    }

    // Handle bot flow
    if (option.nextFlow) {
      sendBotMessage(option.nextFlow);
    } else {
      // Handle specific selections
      const response = handleUserSelection(option.value);
      setIsTyping(true);
      
      setTimeout(() => {
        if (conversationId) {
          sendMessage(conversationId, response.message, 'bot', 'bot-1', 'KRUX Bot');
          
          // Check if bot response indicates resolution (like "Is there anything else")
          // and conversation has no agent assigned, user might resolve
          if (response.message.includes('anything else') && !currentConversation?.assignedAgentId) {
            // Don't auto-resolve here, wait for user confirmation
          }
        }
        setCurrentOptions(response.options || []);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRatingSubmit = (rating: { score: number; comment?: string }) => {
    if (conversationId) {
      updateRating(conversationId, rating);
    }
  };

  if (!isAuthenticated) {
    return <CustomerLogin />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link
              href="/customer-dashboard"
              className="inline-flex items-center gap-1 sm:gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors p-1.5 sm:p-2 -ml-1 sm:-ml-2 flex-shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">K</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">KRUX Finance</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Customer Support</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <NotificationSettings />
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

      {/* Main Container */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-6 overflow-hidden min-h-0">
        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden min-h-0">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 custom-scrollbar min-h-0">
            {currentConversation?.messages.map((message) => (
              <ChatMessage key={message.id} message={message} isCustomer={true} />
            ))}
            
            {isTyping && <TypingIndicator />}
            
            {!isTyping && currentOptions.length > 0 && (
              <QuickOptions options={currentOptions} onOptionClick={handleOptionClick} />
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Sticky Footer */}
          <div className="sticky bottom-0 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900">
            {speechError && (
              <div className="mb-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-xs text-red-600 dark:text-red-400">{speechError}</p>
              </div>
            )}
            {isListening && (
              <div className="mb-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Listening...</p>
              </div>
            )}
            {selectedFiles.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-sm"
                  >
                    <span className="text-blue-700 dark:text-blue-300 truncate max-w-[150px]">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
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
                disabled={isTyping}
                className="p-2.5 sm:p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {isSpeechSupported && (
                <button
                  onClick={handleToggleListening}
                  disabled={isTyping}
                  className={`p-2.5 sm:p-3 rounded-full transition-colors flex-shrink-0 ${
                    isListening
                      ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              )}
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={waitingForInput ? "Enter your response..." : "Type your message..."}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && selectedFiles.length === 0) || isTyping}
                className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        agentName={currentConversation?.assignedAgentName}
      />
    </div>
  );
}

