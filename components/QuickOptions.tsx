import React from 'react';
import { BotOption } from '@/types';

interface QuickOptionsProps {
  options: BotOption[];
  onOptionClick: (option: BotOption) => void;
}

export const QuickOptions: React.FC<QuickOptionsProps> = ({ options, onOptionClick }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 sm:gap-2.5 mb-4 sm:mb-5 animate-slide-up">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onOptionClick(option)}
          className="bg-white dark:bg-gray-800 border-2 border-blue-500/60 dark:border-blue-600/60 text-blue-600 dark:text-blue-400 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-200 text-left font-semibold text-sm sm:text-base shadow-sm hover:shadow-md active:scale-[0.98] touch-manipulation"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

