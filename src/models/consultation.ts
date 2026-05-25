export interface Consultation {
  id: string;
  name: string;
  service: string;
  email: string;
  phone: string;
  region: string;
  createdAt: string;
}

export interface ConsultationsResponse {
  consultations: Consultation[];
}

export interface CreateConsultationRequest {
  name: string;
  service: string;
  email: string;
  phone: string;
  region: string;
}

export interface CreateConsultationResponse {
  success: boolean;
  consultationId?: string;
}
