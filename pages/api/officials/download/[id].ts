import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  if (req.method !== "GET" || searchParams.get("id") == null) {
    return new Response(null, { status: 400 });
  }

  const response = await fetch(
    process.env.BACKEND_API_URL + "/ws/rest/com.axelor.apps.base.db.Partner/export/" + searchParams.get("id"),
    {
      method: "GET",
      headers: {
        Cookie: req.headers.get("server-cookie")?.toString() ?? "",
      },
    }
  );

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  const res = new Response(response.body);

  response.headers.forEach((value, key) => {
    res.headers.append(key, value);
  });

  return res;
}
