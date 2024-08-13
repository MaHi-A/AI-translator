import dotenv from 'dotenv';
dotenv.config();

export const LOG_LEVEL = process.env.LOG_LEVEL
export const OPENAI_API_KEY_GPT_4 = process.env.OPENAI_API_KEY_GPT_4
export const OPENAI_MODEL = process.env.OPENAI_MODEL
export const PORT = process.env.PORT
