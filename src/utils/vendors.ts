import type { DirectoryVendorsQuery, DirectoryVendorsResponse, VendorDetails } from "../models";
import { api } from "./api";

const cleanParams = (query: DirectoryVendorsQuery) => {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
};

const noCacheConfig = {
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
};

export const vendorsApi = {
  getDirectoryVendors: async (query: DirectoryVendorsQuery = {}, signal?: AbortSignal) => {
    const { data } = await api.get<DirectoryVendorsResponse>("/api/registry/vendors", {
      ...noCacheConfig,
      params: {
        ...cleanParams(query),
        _ts: Date.now(),
      },
      signal,
    });

    return data;
  },

  getVendorDetails: async (id: string, signal?: AbortSignal) => {
    const { data } = await api.get<VendorDetails>(`/api/registry/vendors/${id}`, {
      ...noCacheConfig,
      params: {
        _ts: Date.now(),
      },
      signal,
    });

    return data;
  },
};

export const getDirectoryVendors = vendorsApi.getDirectoryVendors;
export const getVendorDetails = vendorsApi.getVendorDetails;
