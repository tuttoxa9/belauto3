declare namespace CloudflareEnv {
  interface Env {
    TELEGRAM_BOT_TOKEN: string
    TELEGRAM_CHAT_ID: string
    NEXT_PUBLIC_FIREBASE_API_KEY: string
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
    NEXT_PUBLIC_FIREBASE_APP_ID: string
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: string
    NEXT_PUBLIC_IMAGE_CACHE_WORKER_URL: string
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY: string
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends CloudflareEnv.Env {}
  }
}

export {}
