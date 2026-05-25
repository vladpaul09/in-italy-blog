import { Metadata } from "next";
import getStaticStrings from "@/data/getStaticStrings.data";
import LoginForm from "@/components/PageSrc/Login/LoginForm";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    title: "Login",
    description: "Accedi al tuo account inItaly per personalizzare la tua esperienza di viaggio in Italia.",
    image: "/statics/website/regions/header.jpg",
    url: `/${locale}/login`,
  });
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;

  const staticStrings = await getStaticStrings(locale);

  return (
    <div className="container flex-[1_1_auto] md:max-w-2xl mt-25 mb-10">
      <div className="grid grid-cols-12">
        <LoginForm locale={locale} staticStrings={staticStrings} />
      </div>
    </div>
  );
}
