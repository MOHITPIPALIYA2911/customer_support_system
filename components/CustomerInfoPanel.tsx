import React from 'react';
import { Conversation } from '@/types';
import { User, Phone, Mail, Calendar, FileText, DollarSign } from 'lucide-react';
import { getLoanApplicationsByCustomerId } from '@/utils/mockData';

interface CustomerInfoPanelProps {
  conversation: Conversation;
}

export const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({ conversation }) => {
  const loanApplications = getLoanApplicationsByCustomerId(conversation.customerId);

  return (
    <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 w-full md:w-80 overflow-y-auto custom-scrollbar">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white text-base md:text-lg truncate">{conversation.customerName}</h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Customer</p>
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300 truncate">{conversation.customerPhone}</span>
          </div>
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300 truncate">{conversation.customerId}@example.com</span>
          </div>
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">
              Joined {new Date(conversation.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm md:text-base">
          <FileText className="w-4 h-4 flex-shrink-0" />
          Conversation Details
        </h3>
        <div className="space-y-2 text-xs md:text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">{conversation.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Priority:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">{conversation.priority}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Category:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {conversation.category.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Messages:</span>
            <span className="font-medium text-gray-900 dark:text-white">{conversation.messages.length}</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm md:text-base">
          <DollarSign className="w-4 h-4 flex-shrink-0" />
          Loan Applications
        </h3>
        {loanApplications.length > 0 ? (
          <div className="space-y-2 md:space-y-3">
            {loanApplications.map(loan => (
              <div key={loan.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 md:p-3 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-xs md:text-sm text-gray-900 dark:text-white truncate flex-1">{loan.type} Loan</span>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                    loan.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    loan.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                    loan.status === 'disbursed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {loan.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="truncate">ID: {loan.id}</div>
                  <div>Amount: ₹{loan.amount.toLocaleString('en-IN')}</div>
                  <div>Applied: {loan.appliedDate}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">No loan applications found.</p>
        )}
      </div>

      {conversation.internalNotes && conversation.internalNotes.length > 0 && (
        <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-xs md:text-sm">Internal Notes</h3>
          <div className="space-y-2">
            {conversation.internalNotes.map(note => (
              <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg p-2.5 md:p-3 border border-yellow-200 dark:border-yellow-800">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {note.agentName} • {new Date(note.timestamp).toLocaleString()}
                </div>
                <p className="text-xs md:text-sm text-gray-800 dark:text-gray-300">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

