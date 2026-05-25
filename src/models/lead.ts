export interface Lead {
  id: string;
  name: string;
  request: string;
  location: string;
  status: string;
  date: string;
  assignedVendorId?: string;
  notes?: string;
  createdAt?: string;
}

export interface LeadsQuery {
  status?: string;
  assignedVendorId?: string;
}

export interface LeadsResponse {
  leads: Lead[];
}
