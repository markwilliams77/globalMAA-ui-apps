export type BidStatus = "submitted" | "accepted" | "rejected" | string;

export interface Bid {
  id: string;
  tenderId: string;
  vendorId: string;
  price: number;
  margin?: number;
  surgeon?: string;
  inclusions?: string[];
  experience?: string;
  status: BidStatus;
  createdAt?: string;
}

export interface BidsQuery {
  vendorId?: string;
  tenderId?: string;
}

export interface BidsResponse {
  bids: Bid[];
}

export interface CreateBidRequest {
  tenderId: string;
  vendorId: string;
  price: number;
  margin?: number;
  surgeon?: string;
  inclusions?: string[];
  experience?: string;
  notes?: string;
}

export interface CreateBidResponse {
  success: boolean;
  message: string;
  bidId?: string;
}
