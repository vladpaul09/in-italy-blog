import { ReactNode } from "react";
import Footer from "@/components/UI/Footer";
import getStaticStrings from "@/data/getStaticStrings.data";
import PageLayoutFlexColumn from "@/components/UI/PageLayoutFlexColumn";

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
    <PageLayoutFlexColumn>
      {children}
      <Footer locale={locale} staticStrings={staticStrings} />
    </PageLayoutFlexColumn>
  );
}
