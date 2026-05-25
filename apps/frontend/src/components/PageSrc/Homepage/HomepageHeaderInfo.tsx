"use client";

import { FC, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TypographyWithBackground from "@/components/Shared/TypographyWithBackground";
import config from "@/config";
import { staticStrings } from "@/types/staticStrings.type";
import stripText from "@/utils/stripText";
import MainContainer from "@/components/Containers/MainContainer";
import DateIntervalCalendarForm from "@/components/Shared/Widgets/DateIntervalCalendarForm";
import HomepageAroundYouHeaderForm from "./HomepageAroundYouHeaderForm";
import userLocationCoordinatesEventBus from "@/rxjs/userLocationCoordinates.eventbus";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface Props {
  staticStrings: staticStrings;
  locale: string;
}

const HomepageHeaderInfo: FC<Props> = ({ staticStrings, locale }) => {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [showAroundYouFormCheckbox, setShowAroundYouFormCheckbox] = useState<boolean>(false);
  const [homepageHeaderInfoRadioButtonValue, setHomepageHeaderInfoRadioButtonValue] = useState<"around-you" | "plan-your-trip">("plan-your-trip");

  useEffect(() => {
    const subscription = userLocationCoordinatesEventBus.subscribe((coords) => {
      if (coords.latitude && coords.longitude) {
        setCoords([coords.latitude, coords.longitude]);
        setShowAroundYouFormCheckbox(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [setCoords, setShowAroundYouFormCheckbox]);

  return (
    <MainContainer sx={{ height: "100%" }}>
      <Grid container spacing={2} direction="column" sx={{ height: "inherit", paddingBottom: 5, justifyContent: "end" }}>
        <Grid size={12} sx={{ overflow: "none" }}>
          <TypographyWithBackground
            variant="h1"
            sx={{ color: "#fff" }}
            fontWeight={config.fontWeightTitleDefault}
            fontSize={{ xs: config.fontSizeMobileTitleSection, md: config.fontSizeDesktopTitleSection }}
          >
            {stripText(staticStrings.homepageTitle)}
          </TypographyWithBackground>
        </Grid>
        <Grid size={12}>
          <TypographyWithBackground variant="h6" color="#fff">
            {stripText(staticStrings.homepageSubtitle)}
          </TypographyWithBackground>
        </Grid>
        <Grid size={12}>
          <Stack spacing={2} direction="row">
            <Tooltip
              title={!showAroundYouFormCheckbox ? stripText(staticStrings.homepageHeaderInfoRadioButtonValueAroundYouDisabledTooltip) : undefined}
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
            >
              <Button
                variant="contained"
                startIcon={homepageHeaderInfoRadioButtonValue === "around-you" ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
                color="primary"
                onClick={() => {
                  if (showAroundYouFormCheckbox) {
                    setHomepageHeaderInfoRadioButtonValue("around-you");
                  }
                }}
                sx={{
                  color: "#000",
                  height: "40px",
                  "&.Mui-disabled": { color: "#000", backgroundColor: "primary.main", opacity: 0.8, cursor: "not-allowed" },
                }}
              >
                {stripText(staticStrings.homepageHeaderInfoRadioButtonValueAroundYou)}
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={homepageHeaderInfoRadioButtonValue === "plan-your-trip" ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
              color="primary"
              onClick={() => {
                setHomepageHeaderInfoRadioButtonValue("plan-your-trip");
              }}
              sx={{
                color: "#000",
                height: "40px",
              }}
            >
              {stripText(staticStrings.homepageHeaderInfoRadioButtonValuePlanYourTrip)}
            </Button>
          </Stack>
        </Grid>
        {homepageHeaderInfoRadioButtonValue === "plan-your-trip" && (
          <Grid container size={12}>
            <DateIntervalCalendarForm
              locale={locale}
              municipalityInputLabel={stripText(staticStrings.municipalityDateTimeIntervalSeachInputLabel)}
              dateInputLabel={stripText(staticStrings.dateTimeIntervalSeachInputLabel)}
              buttonLabel={stripText(staticStrings.dateIntervalSearchButtonLabel)}
              validationMessageRequired={stripText(staticStrings.validationFormInputMessageRequired)}
            />
          </Grid>
        )}
        {homepageHeaderInfoRadioButtonValue === "around-you" && (
          <Grid container size={12}>
            <HomepageAroundYouHeaderForm staticStrings={staticStrings} locale={locale} coords={coords} />
          </Grid>
        )}
      </Grid>
    </MainContainer>
  );
};

export default HomepageHeaderInfo;
