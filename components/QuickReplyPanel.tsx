import React, { useState } from 'react';
import { QuickReply } from '@/types';
import { MOCK_QUICK_REPLIES } from '@/utils/mockData';
import { Zap, X } from 'lucide-react';

interface QuickReplyPanelProps {
  onSelectReply: (content: string) => void;
}

export const QuickReplyPanel: React.FC<QuickReplyPanelProps> = ({ onSelectReply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(MOCK_QUICK_REPLIES.map(qr => qr.category)))];

  const filteredReplies = selectedCategory === 'all'
    ? MOCK_QUICK_REPLIES
    : MOCK_QUICK_REPLIES.filter(qr => qr.category === selectedCategory);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
      >
        <Zap className="w-4 h-4" />
        Quick Replies
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-20 dark:bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden flex flex-col">
            <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Quick Replies</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 touch-manipulation"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 p-2 md:p-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 md:py-1 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors touch-manipulation ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2">
              {filteredReplies.map(reply => (
                <button
                  key={reply.id}
                  onClick={() => {
                    onSelectReply(reply.content);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2.5 md:p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 active:bg-purple-50 dark:active:bg-purple-900/30 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 touch-manipulation"
                >
                  <div className="font-medium text-gray-900 dark:text-white mb-1 text-xs md:text-sm">{reply.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{reply.content}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

