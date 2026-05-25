import { Metadata } from "next";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import getData from "@/data/getMunicipality.data";
import config from "@/config";
import { regionResponse } from "@/types/region.type";
import { provinceResponse } from "@/types/province.type";
import { municipalityResponse } from "@/types/municipality.type";
import getStaticStrings from "@/data/getStaticStrings.data";
import fetchTextDebug from "@/utils/fetchTextDebug";
import MunicipalityPageContent from "@/components/PageSrc/MunicipalityPage/MunicipalityPageContent";
import stripText from "@/utils/stripText";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
    regionSlug: string;
    provinceSlug: string;
    municipalitySlug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, regionSlug, provinceSlug, municipalitySlug } = await params;
  const { municipality } = await getData({ regionSlug, provinceSlug, municipalitySlug, locale });

  return generatePageMetadata({
    title: municipality.name,
    description: stripText(municipality.description, true, 200),
    image: municipality.image || "/statics/website/regions/header.jpg",
    url: `/${locale}/destinazione/${regionSlug}/${provinceSlug}/${municipalitySlug}`,
  });
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const apiUrl = `${config.serverNameBackend}/api/website/regions/all`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  const data = await res.json();

  const paths: Array<{
    municipalitySlug: string;
  }> = [];

  data.forEach((region: regionResponse) => {
    region.provincesSlugs.forEach((province: provinceResponse) => {
      province.municipalitiesSlugs.forEach((municipality: municipalityResponse) => {
        paths.push({
          municipalitySlug: municipality.municipalitySlug,
        });
      });
    });
  });

  return [...paths];
}

export default async function MunicipalityPageIndex({ params }: Props) {
  const { locale, regionSlug, provinceSlug, municipalitySlug } = await params;

  const { municipality, categoriesArticles, categoriesEvents, mapPosts } = await getData({ regionSlug, provinceSlug, municipalitySlug, locale });
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
