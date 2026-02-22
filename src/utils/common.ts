import moment from 'moment';

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
