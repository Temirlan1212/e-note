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
    process.env.BACKEND_API_URL +
      `/ws/rest/com.axelor.meta.db.MetaFile/${searchParams.get(
        "id"
      )}/content/download?image=true&v=0&parentId=${searchParams.get("id")}&parentModel=com.axelor.meta.db.MetaFile`,
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
