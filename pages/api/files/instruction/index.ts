import { NextRequest } from "next/server";
import { NextApiRequest } from "next";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest & NextApiRequest) {
  const { searchParams } = new URL(req.url);

  if (req.method !== "GET" || searchParams.get("path") == null) {
    return new Response(null, { status: 400 });
  }

  const response = await fetch(
    process.env.BACKEND_API_URL + `/ws/file/getInstruction?path=${searchParams.get("path")}`,
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
