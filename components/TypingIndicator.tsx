import React from "react";
import { Bot } from "lucide-react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-5">
      {/* Bot Avatar */}
      <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>

      {/* Typing Animation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl rounded-bl-sm px-3 sm:px-4 py-2 sm:py-3 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex gap-1 sm:gap-1.5">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-500 rounded-full typing-dot"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-500 rounded-full typing-dot"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-500 rounded-full typing-dot"></div>
        </div>
      </div>
    </div>
  );
};
