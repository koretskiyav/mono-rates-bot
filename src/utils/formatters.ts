const buildNumberFormatter = (style: string) =>
  new Intl.NumberFormat('uk', {
    style,
    signDisplay: 'never',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function formatMoney(value: number) {
  return buildNumberFormatter('decimal').format(value);
}

export function formatPercent(value: number) {
  return buildNumberFormatter('percent').format(value);
}

const dateOptions: Intl.DateTimeFormatOptions = {
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZone: 'Europe/Kiev',
};

export function formatDateTime(timestamp: number) {
  return new Date(timestamp).toLocaleString('uk-UA', dateOptions);
}
