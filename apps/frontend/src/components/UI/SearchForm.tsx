"use client";

import { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import stripText from "@/utils/stripText";
import { staticStrings } from "@/types/staticStrings.type";

interface IForm {
  search: string;
}

interface Props {
  locale: string;
  staticStrings: staticStrings;
  onSearchComplete?: () => void;
}

const SearchForm: FC<Props> = ({ locale, staticStrings, onSearchComplete }) => {
  const router = useRouter();

  const { control, handleSubmit, reset } = useForm<IForm>({
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = handleSubmit((data: IForm) => {
    if (data.search.trim()) {
      // Navigate to search page with query parameter
      router.push(`/${locale}/cerca?q=${encodeURIComponent(data.search)}`);

      // Reset form and call callback
      reset({ search: "" });
      if (onSearchComplete) {
        onSearchComplete();
      }
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ m: 0, p: 0 }}>
      <Controller
        name="search"
        control={control}
        rules={{ required: stripText(staticStrings.searchFieldRequired || "Il campo di ricerca è obbligatorio") }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            autoFocus
            fullWidth
            id="search"
            value={value}
            onChange={onChange}
            label={stripText(staticStrings.searchLabelInput || "Cerca")}
            placeholder={stripText(staticStrings.searchPlaceholderInput || "Cosa stai cercando?")}
            variant="outlined"
            autoComplete="off"
            helperText={error?.message}
            error={error !== undefined}
            slotProps={{
              input: {
                "aria-label": "search input",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="search button" type="submit" edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
          />
        )}
      />
    </Box>
  );
};

export default SearchForm;
