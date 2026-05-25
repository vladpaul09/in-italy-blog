import config from "@/config";
import fetchTextDebug from "@/utils/fetchTextDebug";
import getClientIp from "@/utils/getClientIp";

export async function POST(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const body = await request.json();

  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/push-notifications/subscribe`;
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
  return new Response(JSON.stringify(data), {
    status: res.status,
  });
}
