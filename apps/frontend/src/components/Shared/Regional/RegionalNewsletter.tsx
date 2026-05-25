"use client";

import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { staticStrings } from "@/types/staticStrings.type";
import config from "@/config";
import Link from "next/link";
import stripText from "@/utils/stripText";

const NewsletterButton = styled(Button)(({ theme }) => ({
  boxShadow: "none",
  textTransform: "none",
  borderRadius: 4,
  backgroundColor: "#261b21",
  color: "#fff",
  height: "40px",
}));

interface Props {
  staticStrings: staticStrings;
  locale: string;
}

interface IForm {
  email: string;
}

const RegionalNewsletter: FC<Props> = ({ staticStrings, locale }) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { control, handleSubmit, setError, reset } = useForm<IForm>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit(async (data: IForm) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${config.serverNameBackend}/api/website/newsletter-registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 422) {
          const errorData = await res.json();
          Object.keys(errorData.errors).map((item) => {
            setError(item as keyof IForm, { type: "custom", message: errorData.errors[item][0] });
          });
        }
      } else {
        reset({
          email: "",
        });
        setShowSuccessAlert(true);
      }
    } finally {
      setIsLoading(false);
    }
  });

  const handleAlertClose = () => {
    setShowSuccessAlert(false);
  };

  return (
    <Grid
      container
      component="form"
      onSubmit={onSubmit}
      size={12}
      sx={{ backgroundColor: "primary.main", p: { xs: 2.5, xl: 5.2 }, borderRadius: config.borderRadius }}
      spacing={1}
    >
      {/* <Typography
          variant="h4"
          fontWeight={config.fontWeightTitleDefault}
          fontSize={{ xs: config.fontSizeMobileTitleSection, md: config.fontSizeSubtitleSectionDesktop }}
        >
          {stripText(staticStrings.newsletterTitle)}
        </Typography> */}
      {showSuccessAlert && (
        <Grid size={12}>
          <Alert severity="success" onClose={handleAlertClose} sx={{ mb: 1 }}>
            {stripText(staticStrings.newsletterSuccessMessage, false) || "Successfully subscribed to newsletter!"}
          </Alert>
        </Grid>
      )}
      <Grid size={12}>
        <Box sx={{ p: 0, fontWeight: 400 }} dangerouslySetInnerHTML={{ __html: stripText(staticStrings.newsletterDescription, false) }} />
      </Grid>
      <Grid container size={12} spacing={1}>
        <Grid size={{ md: 9, xs: 12 }}>
          <Controller
            name="email"
            control={control}
            rules={{ required: stripText(staticStrings.validationFormInputMessageRequired) }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                value={value}
                onChange={onChange}
                label={stripText(staticStrings.contactFormEmail)}
                variant="outlined"
                size="small"
                fullWidth
                helperText={error?.message}
                error={error !== undefined}
                slotProps={{
                  inputLabel: {
                    sx: {
                      color: "#000",
                      "&.Mui-focused": {
                        color: "#000",
                      },
                    },
                  },
                  input: {
                    sx: {
                      backgroundColor: "white",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ md: 3, xs: 12 }}>
          <NewsletterButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : undefined}
          >
            {stripText(staticStrings.registerButton)}
          </NewsletterButton>
        </Grid>
        <Grid size={12}>
          <Typography component={Link} href={`/${locale}/privacy-policy`} variant="body2" fontWeight={400} sx={{ paddingTop: 1, color: "#000" }}>
            {stripText(staticStrings.newsletterPrivacy, false)}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RegionalNewsletter;
