'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseNotificationsOptions {
  enabled?: boolean;
  soundEnabled?: boolean;
  title?: string;
}

interface UseNotificationsReturn {
  requestPermission: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => void;
  playSound: () => void;
  isSupported: boolean;
  permissionStatus: NotificationPermission;
  enableNotifications: () => void;
  disableNotifications: () => void;
  isEnabled: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const useNotifications = (options: UseNotificationsOptions = {}): UseNotificationsReturn => {
  const { enabled: initialEnabled = true, soundEnabled: initialSoundEnabled = true, title = 'KRUX Finance' } = options;
  
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [soundEnabled, setSoundEnabled] = useState(initialSoundEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastNotificationRef = useRef<number>(0);

  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  // Initialize permission status
  useEffect(() => {
    if (isSupported) {
      setPermissionStatus(Notification.permission);
    }
    
    // Load saved preferences
    const savedEnabled = localStorage.getItem('notificationsEnabled');
    if (savedEnabled !== null) {
      setIsEnabled(savedEnabled === 'true');
    }
    
    const savedSound = localStorage.getItem('notificationSoundEnabled');
    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }
  }, [isSupported]);

  // Initialize audio context for sound notifications
  useEffect(() => {
    if (typeof window !== 'undefined' && soundEnabled) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('AudioContext not supported');
      }
    }
  }, [soundEnabled]);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false;
    
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const playSound = useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      
      // Resume audio context if suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Create a pleasant notification sound (beep)
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  }, [soundEnabled]);

  const showNotification = useCallback((title: string, options: NotificationOptions = {}) => {
    if (!isEnabled || !isSupported || permissionStatus !== 'granted') return;

    // Throttle notifications (max one per second)
    const now = Date.now();
    if (now - lastNotificationRef.current < 1000) return;
    lastNotificationRef.current = now;

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'krux-notification',
        requireInteraction: false,
        ...options,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Play sound
      playSound();

      // Focus window when notification is clicked
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, [isEnabled, isSupported, permissionStatus, playSound]);

  const enableNotifications = () => {
    setIsEnabled(true);
    localStorage.setItem('notificationsEnabled', 'true');
    if (permissionStatus === 'default') {
      requestPermission();
    }
  };

  const disableNotifications = () => {
    setIsEnabled(false);
    localStorage.setItem('notificationsEnabled', 'false');
  };

  const handleSetSoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('notificationSoundEnabled', String(enabled));
  };

  return {
    requestPermission,
    showNotification,
    playSound,
    isSupported,
    permissionStatus,
    enableNotifications,
    disableNotifications,
    isEnabled,
    soundEnabled,
    setSoundEnabled: handleSetSoundEnabled,
  };
};

