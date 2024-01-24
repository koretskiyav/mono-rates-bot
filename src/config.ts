export const config = () => ({
  appUrl: process.env.APP_URL || '',
  tgToken: process.env.TELEGRAM_TOKEN || '',
  dbOptions: {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST || '',
    port: +(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USER || '',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DATABASE || '',
    synchronize: true,
    autoLoadModels: true,
  },
});

export type AppConfig = ReturnType<typeof config>;
