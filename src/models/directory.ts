import type { VendorStats } from "./vendor";

export interface DirectoryProvider {
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
}

export interface DirectoryProviderDetails extends DirectoryProvider {
  fullServices?: string[];
  stats?: VendorStats;
  staffCount?: string;
}

export interface DirectoryCategory {
  id: number;
  title: string;
  subcategories: string[];
  specialized?: string[];
}

export interface DirectoryQuery {
  search?: string;
  category?: string;
  region?: string;
}

export interface DirectoryResponse {
  providers: DirectoryProvider[];
  services: string[];
  regions: string[];
  categories: DirectoryCategory[];
}

export interface DirectoryProviderResponse {
  provider: DirectoryProviderDetails;
}
