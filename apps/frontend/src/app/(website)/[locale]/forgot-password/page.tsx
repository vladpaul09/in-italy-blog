import { Metadata } from "next";
import getStaticStrings from "@/data/getStaticStrings.data";
import ForgotPasswordForm from "@/components/PageSrc/ForgotPassword/ForgotPasswordForm";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    title: "Password Dimenticata",
    description: "Reimposta la password del tuo account inItaly.",
    image: "/statics/website/regions/header.jpg",
    url: `/${locale}/forgot-password`,
  });
}

export default async function ForgotPasswordPage({ params }: Props) {
  const { locale } = await params;

  const staticStrings = await getStaticStrings(locale);

  return (
    <div className="container flex-[1_1_auto] md:max-w-2xl mt-25 mb-10">
      <div className="grid grid-cols-12">
        <ForgotPasswordForm locale={locale} staticStrings={staticStrings} />
      </div>
    </div>
  );
}
