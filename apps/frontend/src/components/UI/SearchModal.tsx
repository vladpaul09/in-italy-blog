"use client";

import { FC } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { staticStrings } from "@/types/staticStrings.type";
import SearchForm from "./SearchForm";

interface Props {
  open: boolean;
  onClose: () => void;
  locale: string;
  staticStrings: staticStrings;
}

const SearchModal: FC<Props> = ({ open, onClose, staticStrings, locale }) => {

  const handleSearchComplete = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <img
              src="/statics/website/logo.png"
              width="125"
              height="25"
              alt="in-italy.it"
            />
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <SearchForm
          locale={locale}
          staticStrings={staticStrings}
          onSearchComplete={handleSearchComplete}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;

