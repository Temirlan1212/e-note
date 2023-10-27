import { useState } from "react";
import { useRouter } from "next/router";
import useEffectOnce from "./useEffectOnce";
import { useProfileStore } from "@/stores/profile";
import useNotificationStore from "@/stores/notification";

export interface FetchError {
  status: number;
  message: string;
}

export interface FetchResponseBody<D = any> {
  status: number;
  offset: number;
  total: number;
  data?: D;
}

export default function useFetch<T = FetchResponseBody>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS",
  options?: {
    headers?: HeadersInit;
    body?: FormData | Record<string, any> | null | undefined;
    returnResponse?: boolean;
  }
) {
  const router = useRouter();
  const profile = useProfileStore.getState();
  const setNotification = useNotificationStore((state) => state.setNotification);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FetchError | null>(null);
  const [data, setData] = useState<T | null>(null);

  useEffectOnce(() => {
    if (url) {
      handleFetching(url);
    }
  }, [url, options?.body, router.route]);

  const handleFetching = (fetchUrl = url, fetchBody = options?.body) => {
    const headers: HeadersInit = { "server-cookie": profile.cookie ?? "" };

    if (!(fetchBody instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    setLoading(true);
    return fetch(fetchUrl, {
      headers: {
        ...headers,
        ...options?.headers,
      },
      method,
      body: fetchBody instanceof FormData ? fetchBody : JSON.stringify(fetchBody),
    })
      .then((res) => {
        if (!res.ok) {
          const error: FetchError = { status: res.status, message: res.statusText };
          throw new Error(JSON.stringify(error));
        }

        return options?.returnResponse === true ? res : res.json();
      })
      .then((res) => {
        setData(res);
        return res;
      })
      .catch((e: Error) => {
        let error: FetchError | null = null;

        try {
          error = JSON.parse(e?.message);
        } catch (e: any) {
          return;
        }

        setError(error);

        if (error?.status === 401) {
          return profile.logOut();
        }

        setNotification(error?.message ?? null);
      })
      .finally(() => setLoading(false));
  };

  return { data, loading, error, update: handleFetching };
}
