import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  if (req.method !== "POST" && searchParams.get("id") == null) {
    return new Response(null, { status: 400 });
  }

  const response = await fetch(
    process.env.BACKEND_OPEN_API_URL + "/com.axelor.auth.db.User/image/" + searchParams.get("id"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
