import getData from "@/data/languages.data";
import { permanentRedirect } from "next/navigation";

export default async function Home() {
  const locales = await getData();
  const defaultLocale = locales.find(locale => locale.default === true);
  return (
    permanentRedirect(defaultLocale ?  `/${defaultLocale.id}` : '/it')
  )
}
