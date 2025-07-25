import dotenv from "dotenv"

import { IServerConfig } from "../types"

dotenv.config()

export const serverConfig: IServerConfig = {
  PORT: process.env.PORT,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  MONGO_URI: process.env.MONGO_URI ?? "",
  MONGO_LOCAL_URI: process.env.MONGO_LOCAL_URI ?? "",
  ELEVEN_API_KEY: process.env.ELEVENLABS_API_KEY ?? "",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? "your-access-token-secret",
  HCAPTCHA_SECRET_KEY: process.env.HCAPTCHA_SECRET_KEY ?? "",
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME ?? "",
  GCS_VOCABULARY_BUCKET_NAME: process.env.GCS_VOCABULARY_BUCKET_NAME ?? "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
  PADDLE_API_KEY: process.env.PADDLE_API_KEY ?? "",
  PADDLE_WEBHOOK_SECRET: process.env.PADDLE_WEBHOOK_SECRET ?? "",
}
