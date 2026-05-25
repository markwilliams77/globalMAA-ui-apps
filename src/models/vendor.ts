export type VendorStatus = "active" | "pending" | "flagged" | string;

export interface VendorStats {
  [key: string]: string;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  category: string;
  image?: string;
  accreditation?: string[];
  startingPrice?: string;
  specialty?: string;
  rating?: number;
  description?: string;
  fullServices?: string[];
  stats?: VendorStats;
  staffCount?: string;
  status?: VendorStatus;
  email?: string;
}

export interface VendorListItem {
  id: string;
  name: string;
  location: string;
  category: string;
  image: string;
  accreditation: string[];
  startingPrice: string;
  specialty: string;
  rating: number;
}

export interface VendorDetails extends VendorListItem {
  description: string;
  fullServices: string[];
  stats: VendorStats;
  staffCount: string;
}

export interface VendorsQuery {
  status?: string;
  category?: string;
  region?: string;
}

export interface DirectoryVendorsQuery {
  search?: string;
  category?: string | null;
  region?: string | null;
  page?: number;
  limit?: number;
}

export interface DirectoryVendorsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface VendorsResponse {
  vendors: Vendor[];
}

export interface DirectoryVendorsResponse {
  data: VendorListItem[];
  pagination: DirectoryVendorsPagination;
}

export interface UpdateVendorRequest {
  id: string;
  status?: "active" | "pending" | "flagged";
  name?: string;
  location?: string;
  category?: string;
  description?: string;
  accreditation?: string[];
  fullServices?: string[];
  stats?: VendorStats;
  staffCount?: string;
}

export interface UpdateVendorResponse {
  success: boolean;
  vendor: Vendor & {
    status: string;
  };
}
