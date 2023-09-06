import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.url != null ? new URL(req.url) : { searchParams: null };
  const url = searchParams?.get("url") as string;
  const token = searchParams?.get("token") as string;

  if (req.method !== "GET" || !url || !token) {
    return new Response(null, { status: 400 });
  }

  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });
}
