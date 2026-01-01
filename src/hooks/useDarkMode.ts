import { useState, useEffect, useCallback } from 'react';
import { saveSettings, getSettings } from '../utils/storage';

export function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState(() => {
    const settings = getSettings();
    return settings.darkMode;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveSettings({ darkMode: isDark });
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return [isDark, toggle];
}
