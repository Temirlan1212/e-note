import { create } from "zustand";
import { useProfileStore } from "./profile";
import {
  IApplication,
  IApplicationQueryParams,
  IApplicationsQueryParamsData,
  SortType,
} from "@/models/applications/applications";

export interface IApplicationState {
  applicationsData: IApplication[] | null;
  applicationsTotal: number | null;
  getApplicationsData: (params: IGetApplicationsDataParams) => Promise<void>;
}

export interface IGetApplicationsDataParams {
  filterValues?: Record<string, (string | number)[]>;
  sortBy?: SortType;
  query?: Partial<IApplicationQueryParams>;
  offset?: number;
  limit?: number;
}

export const useApplicationStore = create<IApplicationState>()((set, get) => ({
  applicationsData: null,
  applicationsTotal: null,
  getApplicationsData: async ({ query, filterValues, sortBy, offset, limit }) => {
    const cookie = useProfileStore.getState().cookie;
    if (cookie == null) return;

    const requestBody: {
      data?: IApplicationsQueryParamsData;
    } = {};

    if (filterValues != null) {
      const _domain = Object.keys(filterValues)
        .map((key) => `self.${key} in :${key.replace(/[.\s]/g, "")}`)
        .join(" and ");
      requestBody.data = {
        _domain,
        _domainContext: filterValues,
      };
    }

    const response = await fetch("/api/applications/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json", "server-cookie": cookie },
      body: JSON.stringify({
        offset: offset ?? 0,
        limit: limit ?? 10,
        sortBy: [sortBy === "asc" ? "creationDate" : "-creationDate"],
        ...requestBody,
        ...query,
      }),
    });

    if (!response.ok) return;

    const applicationsData: { data: IApplication[]; offset: number; total: number } | null = await response.json();

    if (applicationsData != null) {
      if (applicationsData.total != null) set(() => ({ applicationsTotal: applicationsData.total }));

      if (applicationsData.data == null) {
        set(() => ({ applicationsData: [] }));
        return;
      }

      set(() => ({ applicationsData: applicationsData.data }));
    }
  },
}));
