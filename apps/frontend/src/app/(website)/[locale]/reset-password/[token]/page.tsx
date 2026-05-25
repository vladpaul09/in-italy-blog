import { Metadata } from "next";
import getStaticStrings from "@/data/getStaticStrings.data";
import ResetPasswordForm from "@/components/PageSrc/ResetPassword/ResetPasswordForm";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
    token: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    title: "Reimposta Password",
    description: "Reimposta la password del tuo account inItaly.",
    image: "/statics/website/regions/header.jpg",
    url: `/${locale}/reset-password`,
  });
}

export default async function ResetPasswordPage({ params }: Props) {
  const { locale, token } = await params;

  const staticStrings = await getStaticStrings(locale);

  return (
    <div className="container flex-[1_1_auto] md:max-w-2xl mt-25 mb-10">
      <div className="grid grid-cols-12">
        <ResetPasswordForm locale={locale} staticStrings={staticStrings} token={token} />
      </div>
    </div>
  );
}

