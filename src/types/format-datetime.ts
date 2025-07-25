export function formatDateTime(
    dateInput: Date | string | number,
    locale: string = 'vi-VN',
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }
  ): string {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
  
    return date.toLocaleString(locale, options);
  }
  