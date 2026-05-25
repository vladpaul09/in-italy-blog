import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import Grid from "@mui/material/Grid";
import MainContainer from "@/components/Containers/MainContainer";
import RegionalNewsletter from "@/components/Shared/Regional/RegionalNewsletter";
import RegionalRestaurantSection from "@/components/Shared/Regional/RegionalRestaurantSection";
import getStaticStrings from "@/data/getStaticStrings.data";
import Typography from "@mui/material/Typography";
import config from "@/config";
import RelatedNew from "@/components/Shared/Widgets/RelatedNew";
import { getLatestStaticArticles } from "@/data/getStaticArticles";
import stripText from "@/utils/stripText";
import SearchResults from "@/components/PageSrc/Search/SearchResults";
import { searchResponse } from "@/types/searchResult.type";
import fetchTextDebug from "@/utils/fetchTextDebug";
import SearchForm from "@/components/UI/SearchForm";
import { Metadata } from "next";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    q?: string;
    page?: string;
    perPage?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const staticStrings = await getStaticStrings(locale);
  return generatePageMetadata({
    title: "Cerca",
    description: "Cerca articoli, eventi, podcast e destinazioni su inItaly. Scopri l'Italia autentica attraverso i nostri contenuti.",
    image: "/statics/website/regions/header.jpg",
    url: `/${locale}/cerca`,
  });
}

const getSearchData = async (locale: string, query: string, page: number, perPage: number): Promise<searchResponse> => {
  if (!query || query.trim() === "") {
    return { results: [], total: 0 };
  }
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${perPage}`;
  const res = await fetch(apiUrl, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(fetchTextDebug(apiUrl, res.status, res.statusText));
  return res.json();
};

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q, page, perPage } = await searchParams;
  const pageNumber = page ? Number(page) : 1;
  const perPageNumber = perPage ? Number(perPage) : config.perPageCategoryArticles;

  const staticStrings = await getStaticStrings(locale);

  const searchData = await getSearchData(locale, q || "", pageNumber, perPageNumber);

  return (
    <>
      <Header staticStrings={staticStrings}>
        <HeaderInfo title="">
          {/* <SearchForm locale={locale} staticStrings={staticStrings} /> */}
        </HeaderInfo>
      </Header>
      <MainContainer
        fillHeight
        sx={{ pt: { xs: config.spacingMobile * config.spacingRowColumnRatio, md: config.spacingDesktop * config.spacingRowColumnRatio } }}
      >
        <Grid
          container
          columnSpacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}
          rowSpacing={{ xs: config.spacingRowColumnRatio * config.spacingMobile, md: config.spacingRowColumnRatio * config.spacingDesktop }}
        >
          <Grid size={12} sx={{ alignItems: "start" }}>
            <SearchResults
              query={q}
              locale={locale}
              staticStrings={staticStrings}
              results={searchData.results}
              total={searchData.total}
              page={pageNumber}
              perPage={perPageNumber}
            />
          </Grid>
          <RegionalNewsletter staticStrings={staticStrings} locale={locale} />
        </Grid>
        <br />
      </MainContainer>
    </>
  );
}
