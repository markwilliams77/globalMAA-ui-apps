export interface PatientAuthUser {
  uid: string;
  email?: string;
  phone: string;
  displayName?: string;
  name?: string;
  role?: "guest" | "patient";
  createdAt?: string;
}

export interface SendOtpRequest {
  phone: string;
  mode: "login" | "signup";
  name?: string;
  email?: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface VerifyOtpResponse {
  verified: boolean;
}

export interface ApiErrorResponse {
  error: string;
}
