import { headers } from "next/headers";
import config from "@/config";
import { NextRequest } from "next/server";
import fetchTextDebug from "@/utils/fetchTextDebug";
import getClientIp from "@/utils/getClientIp";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const body = await request.json();
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/me/profile`;
  const userIp = await getClientIp();

  const res = await fetch(apiUrl, {
    method: "PUT",
    body: JSON.stringify(userIp ? { ...body, userIp: userIp, userAgent: request.headers.get("user-agent") } : { ...body }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
  });
  if (!res.ok) console.log(fetchTextDebug(apiUrl, res.status, res.statusText));

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
