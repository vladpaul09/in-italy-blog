import { Metadata } from "next";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import { notFound } from "next/navigation";
import getData from "@/data/getMunicipalityEventSearch.data";
import getStaticStrings from "@/data/getStaticStrings.data";
import MunicipalityPageContent from "@/components/PageSrc/MunicipalityPage/MunicipalityPageContent";
import stripText from "@/utils/stripText";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    locale: string;
    regionSlug: string;
    provinceSlug: string;
    municipalitySlug: string;
  }>;
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, regionSlug, provinceSlug, municipalitySlug } = await params;
  const { startDate, endDate } = await searchParams;
  
  // If no dates provided, return basic metadata without fetching data
  if (!startDate || !endDate) {
    return generatePageMetadata({
      title: "Eventi",
      description: "Cerca eventi nella tua destinazione preferita",
      image: "/statics/website/regions/header.jpg",
      url: `/${locale}/destinazione/${regionSlug}/${provinceSlug}/${municipalitySlug}/eventi/cerca`,
    });
  }
  
  const { municipality } = await getData({
    regionSlug,
    provinceSlug,
    municipalitySlug,
    locale,
    startDate,
    endDate,
  });

  return generatePageMetadata({
    title: `Eventi - ${municipality.name}`,
    description: stripText(municipality.description, true, 200),
    image: municipality.image || "/statics/website/regions/header.jpg",
    url: `/${locale}/destinazione/${regionSlug}/${provinceSlug}/${municipalitySlug}/eventi/cerca`,
  });
}

export default async function MunicipalityPageIndex({ params, searchParams }: Props) {
  const { locale, regionSlug, provinceSlug, municipalitySlug } = await params;
  const { startDate, endDate } = await searchParams;

  if (!startDate || !endDate) {
    return notFound();
  }

  const { municipality, categoriesEvents, categoriesArticles, mapPosts } = await getData({
    regionSlug,
    provinceSlug,
    municipalitySlug,
    locale,
    startDate,
    endDate,
  });
  const staticStrings = await getStaticStrings(locale);

  return (
    <>
      <Header staticStrings={staticStrings} bgImage={municipality.image} mobileBgImage={municipality.mobileImage}>
        <HeaderInfo title={municipality.name} subtitle={municipality.province.region.name} />
      </Header>
      <MunicipalityPageContent
        staticStrings={staticStrings}
        locale={locale}
        municipality={municipality}
        categoriesArticles={categoriesArticles}
        categoriesEvents={categoriesEvents}
        mapPosts={mapPosts}
      />
    </>
  );
}
