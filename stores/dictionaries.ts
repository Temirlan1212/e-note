import { IActionType, IActionTypeQueryParams } from "@/models/dictionaries/action-type";
import { create } from "zustand";
import { useProfileStore } from "./profile";
import { IStatus, IStatusQueryParams } from "@/models/dictionaries/status";
import { IDocumentType, IDocumentTypeQueryParams } from "@/models/dictionaries/document-type";

export interface IProfileState {
  actionTypeData: IActionType[] | null;
  statusData: IStatus[] | null;
  documentTypeData: IDocumentType[] | null;
  getActionTypeData: (query?: Partial<IActionTypeQueryParams>) => Promise<void>;
  getStatusData: (query?: Partial<IStatusQueryParams>) => Promise<void>;
  getDocumentTypeData: (query?: Partial<IDocumentTypeQueryParams>) => Promise<void>;
}

export const useDictionaryStore = create<IProfileState>()((set, get) => ({
  actionTypeData: null,
  statusData: null,
  documentTypeData: null,
  getActionTypeData: async (query) => {
    const cookie = useProfileStore.getState().cookie;
    if (cookie == null) return;

    const response = await fetch("/api/dictionaries/action-type", {
      method: "POST",
      headers: { "Content-Type": "application/json", "server-cookie": cookie },
      body: JSON.stringify(query),
    });

    const actionTypeData: { data: IActionType[] } | null = await response.json();

    if (!response.ok || actionTypeData == null || actionTypeData.data == null) return;
    set(() => ({ actionTypeData: actionTypeData.data }));
  },

  getStatusData: async (query) => {
    const cookie = useProfileStore.getState().cookie;
    if (cookie == null) return;

    const response = await fetch("/api/dictionaries/status", {
      method: "POST",
      headers: { "Content-Type": "application/json", "server-cookie": cookie },
      body: JSON.stringify(query),
    });

    const statusData: { data: IActionType[] } | null = await response.json();

    if (!response.ok || statusData == null || statusData.data == null) return;
    set(() => ({ statusData: statusData.data }));
  },

  getDocumentTypeData: async (query) => {
    const cookie = useProfileStore.getState().cookie;
    if (cookie == null) return;

    const response = await fetch("/api/dictionaries/document-type", {
      method: "POST",
      headers: { "Content-Type": "application/json", "server-cookie": cookie },
      body: JSON.stringify(query),
    });

    const documentTypeData: { data: IDocumentType[] } | null = await response.json();

    if (!response.ok || documentTypeData == null || documentTypeData.data == null) return;
    set(() => ({ documentTypeData: documentTypeData.data }));
  },
}));
