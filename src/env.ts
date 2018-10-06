require('dotenv').config();
export const DEBUG = process.env.DEBUG === 'true';
export const PERSONAL_TOKEN = process.env.PERSONAL_TOKEN;
export const ORGANIZATION = process.env.ORGANIZATION as string;
export const ONLY_NEW_EVENTS = process.env.ONLY_NEW_EVENTS === 'true';