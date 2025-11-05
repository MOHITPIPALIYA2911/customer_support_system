'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = '' }) => {
  const {
    isSupported,
    permissionStatus,
    requestPermission,
    enableNotifications,
    disableNotifications,
    isEnabled,
    soundEnabled,
    setSoundEnabled,
  } = useNotifications();

  if (!isSupported) {
    return null;
  }

  const handleEnableNotifications = async () => {
    if (permissionStatus === 'default') {
      const granted = await requestPermission();
      if (granted) {
        enableNotifications();
      }
    } else {
      enableNotifications();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-1">
        {permissionStatus === 'granted' && isEnabled ? (
          <>
            <button
              onClick={disableNotifications}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Disable notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                soundEnabled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
              }`}
              title={soundEnabled ? 'Mute sound' : 'Enable sound'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </>
        ) : (
          <button
            onClick={handleEnableNotifications}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Enable notifications"
          >
            <BellOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

