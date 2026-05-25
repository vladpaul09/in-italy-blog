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
import DateIntervalCalendarForm from "../Widgets/DateIntervalCalendarForm";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  locale: string;
  staticStrings: staticStrings;
}

const MobilePlanYouTripDialog: FC<Props> = ({ open, setOpen, locale, staticStrings }) => {
  const handleClose = () => setOpen(false);

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
        {stripText(staticStrings.homepageHeaderInfoRadioButtonValuePlanYourTrip)}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#fff"
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 4}}>
        <DateIntervalCalendarForm
          locale={locale}
          municipalityInputLabel={stripText(staticStrings.municipalityDateTimeIntervalSeachInputLabel)}
          dateInputLabel={stripText(staticStrings.dateTimeIntervalSeachInputLabel)}
          buttonLabel={stripText(staticStrings.dateIntervalSearchButtonLabel)}
          validationMessageRequired={stripText(staticStrings.validationFormInputMessageRequired)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MobilePlanYouTripDialog;
