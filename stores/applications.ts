import { create } from "zustand";
import { useProfileStore } from "./profile";
import {
  IApplication,
  IApplicationQueryParams,
  IApplicationsQueryParamsData,
} from "@/models/applications/applications";

export interface IApplicationState {
  applicationsData: IApplication[] | null;
  getApplicationsData: (params: IGetApplicationsDataParams) => Promise<void>;
}

export interface ISQLRequest {
  field: keyof IApplication;
  value: (string | number)[];
}

export interface IGetApplicationsDataParams {
  filter?: ISQLRequest;
  sortBy?: "asc" | "desc";
  query?: Partial<IApplicationQueryParams>;
}

export const useApplicationStore = create<IApplicationState>()((set, get) => ({
  applicationsData: null,
  getApplicationsData: async ({ query, filter, sortBy }) => {
    const cookie = useProfileStore.getState().cookie;
    if (cookie == null) return;

    const requestBody: {
      data?: IApplicationsQueryParamsData;
    } = {};

    if (filter?.value != null && filter?.value.length > 0) {
      requestBody.data = {
        _domain: `self.${filter?.field} in :notaryAction`,
        _domainContext: {
          notaryAction: filter.value,
        },
      };
    }

    const response = await fetch("/api/applications/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json", "server-cookie": cookie },
      body: JSON.stringify({
        sortBy: [sortBy === "asc" ? "creationDate" : "-creationDate"],
        ...requestBody,
        ...query,
      }),
    });

    if (!response.ok) return;

    const applicationsData: { data: IApplication[] } | null = await response.json();

    if (applicationsData == null || applicationsData.data == null) {
      set(() => ({ applicationsData: [] }));
      return;
    }

    set(() => ({ applicationsData: applicationsData.data }));
  },
}));
