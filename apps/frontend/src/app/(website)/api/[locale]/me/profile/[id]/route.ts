import { headers } from "next/headers";
import config from "@/config";
import { NextRequest } from "next/server";
import fetchTextDebug from "@/utils/fetchTextDebug";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ locale: string; id: string }> }
) {
  const { locale, id } = await params;
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/me/profile/${id}`;

  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
  });

  if (!res.ok) {
    console.log(fetchTextDebug(apiUrl, res.status, res.statusText));
  }

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
