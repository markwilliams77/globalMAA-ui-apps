export type TenderStatus = "open" | "negotiating" | "closed" | string;

export interface Tender {
  id: string;
  service: string;
  region: string;
  category: string;
  budget: string;
  deadline?: string;
  description?: string;
  requirements?: string[];
  status: TenderStatus;
  bids?: number;
  patientId?: string;
  createdAt?: string;
}

export interface TendersQuery {
  vendorId?: string;
  status?: string;
  region?: string;
}

export interface TendersResponse {
  tenders: Tender[];
}

export interface CreateTenderData {
  service: string;
  region: string;
  category: string;
  budget: string;
  deadline?: string;
  description?: string;
  requirements?: string[];
  patientId?: string;
}

export interface CreateTenderRequest {
  tenderData: CreateTenderData;
  vendorEmails: string[];
}

export interface CreateTenderResponse {
  success: boolean;
  message: string;
  tenderId?: string;
  simulated?: boolean;
}

export interface TenderRecord {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateTenderPayload {
  title: string;
  description: string;
}
