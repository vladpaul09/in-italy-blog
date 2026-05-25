"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@mui/material/Pagination";

interface Props {
  total: number;
  page: number;
  perPage: number;
  locale: string;
  url: string;
}

const CustomPagination: FC<Props> = ({ total, page, perPage, locale, url }) => {
  const router = useRouter();
  return (
    <Pagination
      variant="outlined"
      showFirstButton
      showLastButton
      count={Math.ceil(total / Number(perPage))}
      page={Number(page)}
      onChange={(event, value) => {
        router.push(`${url}?page=${value}&perPage=${perPage}`);
      }}
      sx={{ display: "flex", justifyContent: "center" }}
    />
  );
};

export default CustomPagination;
