import { useState } from "react";
import { useRouter } from "next/router";
import useEffectOnce from "./useEffectOnce";
import { useProfileStore } from "@/stores/profile";

export default function useFetch<T = any>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS",
  initialData: T,
  headers?: HeadersInit,
  body?: BodyInit
) {
  const router = useRouter();
  const profile = useProfileStore.getState();

  const [data, setData] = useState<T>(initialData);

  useEffectOnce(async () => {
    if (profile.cookie == null) {
      return router.push("/login");
    }

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "server-cookie": profile.cookie ?? "", ...headers },
      body,
    });

    if (response.status === 401) {
      profile.logOut();
      return router.push("/login");
    }

    if (!response.ok) return;

    const responseData = await response.json();

    if (responseData == null || responseData.data == null) return;

    setData(responseData.data);
  }, [url, router.route]);

  return data;
}
