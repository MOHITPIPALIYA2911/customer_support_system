import React from 'react';
import { BotOption } from '@/types';

interface QuickOptionsProps {
  options: BotOption[];
  onOptionClick: (option: BotOption) => void;
}

export const QuickOptions: React.FC<QuickOptionsProps> = ({ options, onOptionClick }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-4 animate-slide-up">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onOptionClick(option)}
          className="bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left font-medium shadow-sm"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

