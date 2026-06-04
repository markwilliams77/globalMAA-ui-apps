import { api } from "./api";

export type VendorPlan = "Standard" | "Pro" | "Premium";
export type VendorOrgType = "Hospital" | "Diagnostic Center" | "Specialty Clinic";
export type VendorDocumentType = "business_license" | "moh_accreditation" | "tax_identification";

export interface VendorOnboardingPayload {
  orgName: string;
  address: string;
  email: string;
  contactPerson: string;
  contactNumber: string;
  orgType: VendorOrgType;
  specialties: string[];
  plan: VendorPlan;
}

export interface VendorOnboardingDraft extends VendorOnboardingPayload {
  id: string;
  status?: string;
  paymentStatus?: string;
}

export interface PresignDocumentRequest {
  documentType: VendorDocumentType;
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface PresignDocumentResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl?: string;
}

export interface CompleteDocumentRequest extends PresignDocumentRequest {
  fileKey: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  razorpayKeyId: string;
}

export interface RazorpayVerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VendorOnboardingStatus {
  status: string;
  paymentStatus: string;
  plan: VendorPlan;
  orgName: string;
}

export const vendorOnboardingApi = {
  createDraft: async (payload: VendorOnboardingPayload) => {
    const { data } = await api.post<VendorOnboardingDraft>("/api/vendors/onboarding", payload);
    return data;
  },

  updateDraft: async (vendorId: string, payload: Partial<VendorOnboardingPayload>) => {
    const { data } = await api.patch<VendorOnboardingDraft>(`/api/vendors/${vendorId}/onboarding`, payload);
    return data;
  },

  presignDocument: async (vendorId: string, payload: PresignDocumentRequest) => {
    const { data } = await api.post<PresignDocumentResponse>(
      `/api/vendors/${vendorId}/documents/presign`,
      payload,
    );
    return data;
  },

  completeDocument: async (vendorId: string, payload: CompleteDocumentRequest) => {
    const { data } = await api.post(`/api/vendors/${vendorId}/documents/complete`, payload);
    return data;
  },

  createRazorpayOrder: async (vendorId: string) => {
    const { data } = await api.post<RazorpayOrderResponse>(
      `/api/vendors/${vendorId}/payments/razorpay/order`,
    );
    return data;
  },

  verifyRazorpayPayment: async (vendorId: string, payload: RazorpayVerifyPayload) => {
    const { data } = await api.post(
      `/api/vendors/${vendorId}/payments/razorpay/verify`,
      payload,
    );
    return data;
  },

  submit: async (vendorId: string) => {
    const { data } = await api.post(`/api/vendors/${vendorId}/submit`);
    return data;
  },

  getStatus: async (vendorId: string) => {
    const { data } = await api.get<VendorOnboardingStatus>(`/api/vendors/${vendorId}/status`);
    return data;
  },
};
