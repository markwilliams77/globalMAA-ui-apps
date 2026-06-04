/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REQUIRE_LOGIN: string;
  readonly VITE_API_BASE_URL: string;
  readonly GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
}

interface Window {
  Razorpay?: new (options: RazorpayOptions) => {
    open: () => void;
  };
}
