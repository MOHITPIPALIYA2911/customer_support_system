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
import { Send, LogOut, ArrowLeft, Mic, MicOff, Paperclip, X, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Customer, BotFlowType, BotOption, FileAttachment } from '@/types';
import { getBotResponse, handleUserSelection, checkApplicationStatus } from '@/utils/botFlows';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

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
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link
              href="/customer-dashboard"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-200 p-1.5 sm:p-2 -ml-1 sm:-ml-2 flex-shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
              <span className="text-white font-bold text-base sm:text-lg">K</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate tracking-tight">KRUX Finance</h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate font-medium">Customer Support</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <ThemeToggle />
            <button
              onClick={logout}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-4 md:py-6 overflow-hidden min-h-0">
        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden min-h-0">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 custom-scrollbar min-h-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-900/30 dark:to-transparent">
            {currentConversation?.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start a conversation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                  Your messages will appear here. Ask questions or type your query to get started.
                </p>
              </div>
            )}
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
          <div className="sticky bottom-0 border-t border-gray-200/80 dark:border-gray-800/80 p-2.5 sm:p-4 md:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            {speechError && (
              <div className="mb-2 sm:mb-3 px-3 sm:px-4 py-1.5 sm:py-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg sm:rounded-xl shadow-sm">
                <p className="text-xs font-medium text-red-700 dark:text-red-400">{speechError}</p>
              </div>
            )}
            {isListening && (
              <div className="mb-2 sm:mb-3 px-3 sm:px-4 py-1.5 sm:py-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-lg sm:rounded-xl shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-500/50"></div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Listening...</p>
              </div>
            )}
            {selectedFiles.length > 0 && (
              <div className="mb-2 sm:mb-3 flex flex-wrap gap-1.5 sm:gap-2 max-h-20 sm:max-h-none overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-md sm:rounded-lg text-xs sm:text-sm shadow-sm"
                  >
                    <span className="text-blue-700 dark:text-blue-300 truncate max-w-[100px] sm:max-w-[150px] font-medium">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors flex-shrink-0 touch-manipulation"
                      aria-label="Remove file"
                    >
                      <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
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
                className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 hover:shadow-sm touch-manipulation"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </button>
              {isSpeechSupported && (
                <button
                  onClick={handleToggleListening}
                  disabled={isTyping}
                  className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation ${
                    isListening
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  ) : (
                    <Mic className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
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
                className="flex-1 min-w-0 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-sm sm:text-sm md:text-base border border-gray-300 dark:border-gray-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-600 outline-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && selectedFiles.length === 0) || isTyping}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 sm:p-2.5 md:p-3.5 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 disabled:shadow-none touch-manipulation"
              >
                <Send className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
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

