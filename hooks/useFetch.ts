import { useState } from "react";
import { useRouter } from "next/router";
import useEffectOnce from "./useEffectOnce";
import { useProfileStore } from "@/stores/profile";

export interface FetchError {
  status: number;
  message: string;
}

export interface FetchResponseBody {
  status: number;
  offset: number;
  total: number;
  data: any;
}

export default function useFetch<T = FetchResponseBody>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS",
  options?: {
    headers?: HeadersInit;
    body?: FormData | Record<string, any> | null | undefined;
    useEffectOnce?: boolean;
    returnResponse?: boolean;
  }
) {
  const router = useRouter();
  const profile = useProfileStore.getState();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FetchError | null>(null);
  const [data, setData] = useState<T | null>(null);

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

        return options?.returnResponse != null ? res : res.json();
      })
      .then((res) => {
        setData(res);
      })
      .catch((e: Error) => {
        const error: FetchError = JSON.parse(e.message);
        setError(error);

        if (error.status === 401) {
          profile.logOut();
          return router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  };

  if (options?.useEffectOnce !== false) {
    useEffectOnce(() => {
      if (url) {
        handleFetching(url);
      }
    }, [url, options?.body, router.route]);
  }

  return { data, loading, error, update: handleFetching };
}
