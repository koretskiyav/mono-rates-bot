export const config = () => ({
  appUrl: process.env.APP_URL || '',
  tgToken: process.env.TELEGRAM_TOKEN || '',
});

export type AppConfig = ReturnType<typeof config>;
