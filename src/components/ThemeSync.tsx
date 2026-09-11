'use client';

import { useEffect } from 'react';

interface ThemeConfig {
  primaryColor: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  accentColor: string;
}

export function ThemeSync() {
  useEffect(() => {
    const applyThemeToDOM = (theme: ThemeConfig) => {
      if (!theme) return;
      const root = document.documentElement;
      if (theme.primaryColor) root.style.setProperty('--primary-color', theme.primaryColor);
      if (theme.primaryHover) root.style.setProperty('--primary-hover', theme.primaryHover);
      if (theme.primaryLight) root.style.setProperty('--primary-light', theme.primaryLight);
      if (theme.primaryDark) root.style.setProperty('--primary-dark', theme.primaryDark);
      if (theme.accentColor) root.style.setProperty('--accent-color', theme.accentColor);
    };

    // Load initial theme from localStorage
    try {
      const stored = localStorage.getItem('metrobazar_theme_config');
      if (stored) {
        applyThemeToDOM(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load theme in frontend', e);
    }

    // Listen for storage events (changes from Admin Dashboard in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'metrobazar_theme_config' && e.newValue) {
        try {
          applyThemeToDOM(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for BroadcastChannel messages
    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel('metrobazar_theme_channel');
      channel.onmessage = (event) => {
        if (event.data) {
          applyThemeToDOM(event.data);
        }
      };
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
    };
  }, []);

  return null;
}
