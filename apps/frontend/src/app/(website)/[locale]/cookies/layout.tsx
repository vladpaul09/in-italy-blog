import { ReactNode } from "react";
import PageBackground from "@/components/UI/PageBackground";
import Footer from "@/components/UI/Footer";
import getStaticStrings from "@/data/getStaticStrings.data";

interface IParams {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function RootLayout({ children, params }: IParams) {
  const { locale } = await params;
  const staticStrings = await getStaticStrings(locale);

  return (
    <>
      <PageBackground>{children}</PageBackground>
      <Footer locale={locale} staticStrings={staticStrings} />
    </>
  );
}
