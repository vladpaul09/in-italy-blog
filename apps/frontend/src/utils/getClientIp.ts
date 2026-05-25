import { headers } from "next/headers";

const getClientIp = async (): Promise<string | null> => {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0] : headersList.get("x-real-ip") || null;
};

export default getClientIp;

