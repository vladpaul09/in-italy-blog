"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import config from "@/config";
import SearchInfoPostCard from "@/components/Shared/SearchInfoPostCard";
import { staticStrings } from "@/types/staticStrings.type";
import { searchResult } from "@/types/searchResult.type";

interface Props {
  query?: string;
  locale: string;
  staticStrings: staticStrings;
  results: searchResult[];
  total: number;
  page: number;
  perPage: number;
}

const SearchResults: FC<Props> = ({ query, locale, staticStrings, results, total, page, perPage }) => {
  const router = useRouter();

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set("q", query);
    searchParams.set("page", value.toString());
    searchParams.set("perPage", perPage.toString());
    router.push(`/${locale}/cerca?${searchParams.toString()}`);
  };

  const getResultUrl = (result: searchResult): string => {
    // If url is already provided, use it
    if (result.url) {
      return result.url;
    }

    // Otherwise construct URL based on type
    switch (result.type) {
      case "article":
        return `/${locale}/articolo/${result.slug}`;
      case "event":
        return `/${locale}/evento/${result.slug}`;
      case "podcast":
        return `/${locale}/podcast/${result.slug}`;
      case "category":
        return `/${locale}/categoria/${result.slug}`;
      default:
        return "#";
    }
  };


  if (!query || query.trim() === "") {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight={config.fontWeightTitleDefault}>
          {staticStrings.search_enter_term || "Enter a search term to find articles, events, podcasts, and categories"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight={config.fontWeightTitleDefault}
        fontSize={{ xs: config.fontSizeMobileTitleSection, md: config.fontSizeSubtitleSectionDesktop }}
        sx={{ mb: 3 }}
      >
        {staticStrings.search_results_for || "Risultati per la ricerca"} "{query}"
      </Typography>

      {results.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          {staticStrings.search_no_results || "Nessun risultato trovato per"} "{query}". {staticStrings.search_try_different_keywords || "Prova parole chiave diverse."}
        </Alert>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 3 }} fontWeight={500}>
            {staticStrings.search_found_results || "Trovati"} {total} {total !== 1 ? (staticStrings.search_results || "risultati") : (staticStrings.search_result || "risultato")}
          </Typography>

          <Grid container spacing={{ xs: config.spacingMobile, md: config.spacingDesktop }}>
            {results.map((result, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <SearchInfoPostCard
                  title={result.title}
                  image={result.image}
                  mobileImage={result.mobileImage}
                  url={getResultUrl(result)}
                  locale={locale}
                  type={result.type}
                  staticStrings={staticStrings}
                />
              </Grid>
            ))}
          </Grid>

          {total > perPage && (
            <Box sx={{ mt: 4 }}>
              <Pagination
                variant="outlined"
                showFirstButton
                showLastButton
                count={Math.ceil(total / perPage)}
                page={page}
                onChange={handlePageChange}
                sx={{ display: "flex", justifyContent: "center" }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default SearchResults;
