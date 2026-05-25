/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REQUIRE_LOGIN: string;
  readonly GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
