"use client";

import { FC, Dispatch, SetStateAction } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { staticStrings } from "@/types/staticStrings.type";
import stripText from "@/utils/stripText";
import HomepageAroundYouHeaderForm from "@/components/PageSrc/Homepage/HomepageAroundYouHeaderForm";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<{ openAroundYouDialog: boolean; coords: [number, number] | null }>>;
  locale: string;
  staticStrings: staticStrings;
  coords: [number, number] | null;
}

const MobileAroundYouDialog: FC<Props> = ({ open, setOpen, locale, staticStrings, coords }) => {
  
  const handleClose = () => setOpen({ openAroundYouDialog: false, coords: null });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slots={{
        transition: Slide,
      }}
      fullScreen
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: "primary.main", color: "#fff" }}>
        {stripText(staticStrings.homepageHeaderInfoRadioButtonValueAroundYou)}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#fff",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 4 }}>
        <HomepageAroundYouHeaderForm staticStrings={staticStrings} locale={locale} coords={coords} />
      </DialogContent>
    </Dialog>
  );
};

export default MobileAroundYouDialog;
