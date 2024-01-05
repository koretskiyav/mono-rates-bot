const buildNumberFormatter = (style: string, showSign: boolean) =>
  new Intl.NumberFormat('uk', {
    style,
    signDisplay: showSign ? 'always' : 'auto',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function formatMoney(value: number, showSign = false) {
  return buildNumberFormatter('decimal', showSign).format(value);
}

export function formatPercent(value: number, showSign = false) {
  return buildNumberFormatter('percent', showSign).format(value);
}

const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

export function formatDateTime(timestamp: number) {
  return new Date(timestamp).toLocaleString('uk-UA', dateOptions);
}
