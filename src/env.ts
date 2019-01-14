require('dotenv').config();
export const DEBUG = process.env.DEBUG === 'true';
export const PERSONAL_TOKEN = process.env.PERSONAL_TOKEN;
export const BOT_NAME = process.env.BOT_NAME;
export const ORGANIZATION = process.env.ORGANIZATION as string;
export const MIN_POLLING_TIME_SECONDS = parseInt(process.env.MIN_POLLING_TIME_SECONDS, 10);
export const PORT = process.env.PORT;
export const ONLY_NEW_EVENTS = process.env.ONLY_NEW_EVENTS === 'true';
export const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;