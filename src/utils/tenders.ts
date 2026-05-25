import type { CreateTenderPayload, TenderRecord } from "../models";
import { api } from "./api";

export const tendersApi = {
  createTender: async (payload: CreateTenderPayload) => {
    const { data } = await api.post<TenderRecord>("/api/tenders", payload);
    return data;
  },

  getTenders: async () => {
    const { data } = await api.get<TenderRecord[]>("/api/tenders");
    return data;
  },

  getTenderById: async (id: string) => {
    const { data } = await api.get<TenderRecord>(`/api/tenders/${id}`);
    return data;
  },
};

export const createTender = tendersApi.createTender;
export const getTenders = tendersApi.getTenders;
export const getTenderById = tendersApi.getTenderById;
