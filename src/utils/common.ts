import moment from 'moment';
import Clipboard from '@react-native-clipboard/clipboard';

// Thin wrapper over the clipboard so callers don't depend on the library
// directly. Guarded so it degrades gracefully if the native module is missing.
export const copyToClipboard = (text: string): void => {
  try {
    Clipboard.setString(text);
  } catch {
    // Clipboard unavailable in this environment — no-op.
  }
};

export const debouncedFn = (fn: Function, delay: number) => {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const formatDate = (date: Date) => {
  return moment(date).format('dddd, MMMM Do YYYY, hh:mm:ss A');
};
