import config from "@/config";
import { NextRequest } from "next/server";
import fetchTextDebug from "@/utils/fetchTextDebug";
import getClientIp from "@/utils/getClientIp";

export async function POST(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const body = await request.json();
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/explorer-form`;
  const userIp = await getClientIp();

  const res = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(userIp ? { ...body, userIp: userIp, userAgent: request.headers.get("user-agent") } : { ...body }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!res.ok) console.log(fetchTextDebug(apiUrl, res.status, res.statusText));

  const data = await res.json();

  return new Response(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

