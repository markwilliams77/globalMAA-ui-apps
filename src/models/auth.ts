export type UserRole = "admin" | "vendor" | "guest";

export interface AuthProfileResponse {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  location?: string;
  isSimulation?: boolean;
  vendorId?: string;
  createdAt?: string;
}
