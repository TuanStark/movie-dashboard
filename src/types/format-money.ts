export default function formatMoney(amount: number, locale = 'vi-VN', currency = 'VND'): string {
    return amount.toLocaleString(locale, {
      style: 'currency',
      currency,
    });
  }
  