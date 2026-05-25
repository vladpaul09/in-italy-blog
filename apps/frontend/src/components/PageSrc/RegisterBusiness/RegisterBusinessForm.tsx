"use client";

import React, { FC, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import { staticStrings } from "@/types/staticStrings.type";
import config from "@/config";
import stripText from "@/utils/stripText";

const SubmitButton = styled(Button)(({ theme }) => ({
  boxShadow: "none",
  textTransform: "none",
  borderRadius: 8,
  backgroundColor: "primary.main",
  fontSize: 18,
}));

interface IForm {
  company: string;
  fiscalCode: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  note: string;
}

interface Props {
  staticStrings: staticStrings;
}

const RegisterBusinessForm: FC<Props> = ({ staticStrings }) => {
  const { control, handleSubmit, setError, reset } = useForm<IForm>({
    defaultValues: {
      company: "",
      fiscalCode: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      note: "",
    },
  });

  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data: IForm) => {
    const res = await fetch(`${config.serverNameBackend}/api/website/business-registration-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      if (res.status === 422) {
        const data = await res.json();
        Object.keys(data.errors).map((item) => {
          setError(item as keyof IForm, { type: "custom", message: data.errors[item][0] });
        });
      }
    } else {
      setAlertMsg("Registration successful!");
      reset({
        company: "",
        fiscalCode: "",
        name: "",
        surname: "",
        email: "",
        phone: "",
        note: "",
      });
    }
  });

  return (
    <Grid component="form" onSubmit={onSubmit} container size={{ xs: 12, lg: 8 }} spacing={2}>
      {alertMsg && (
        <Grid size={12}>
          <Alert severity="success" onClose={() => setAlertMsg(null)} sx={{ mb: 2 }}>
            {alertMsg}
          </Alert>
        </Grid>
      )}
      
      {/* Company and Fiscal Code fields at the top */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="company"
          control={control}
          rules={{ required: stripText(staticStrings.validationFormInputMessageRequired) }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              label={stripText(staticStrings.registerBusinessCompanyName)}
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="fiscalCode"
          control={control}
          rules={{ required: stripText(staticStrings.validationFormInputMessageRequired) }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              label={stripText(staticStrings.registerBusinessFiscalCode)}
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
            />
          )}
        />
      </Grid>
      
      {/* Original contact form fields */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="name"
          control={control}
          rules={{ required: stripText(staticStrings.validationFormInputMessageRequired) }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              label={stripText(staticStrings.contactFormName)}
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="surname"
          control={control}
          rules={{ required: stripText(staticStrings.validationFormInputMessageRequired) }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              label={stripText(staticStrings.contactFormSurname)}
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
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
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="phone"
          control={control}
          rules={{ required: stripText(staticStrings.validationFormInputMessageRequired) }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              label={stripText(staticStrings.contactFormPhone)}
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
            />
          )}
        />
      </Grid>
      <Grid size={12}>
        <Controller
          name="note"
          control={control}
          rules={{ required: stripText(staticStrings.validationFormInputMessageRequired) }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              label={stripText(staticStrings.contactFormNote)}
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              multiline={true}
              rows={6}
            />
          )}
        />
      </Grid>
      <Grid size={12}>
        <SubmitButton type="submit" variant="contained" fullWidth>
          {stripText(staticStrings.registerBusinessFormButton)}
        </SubmitButton>
      </Grid>
    </Grid>
  );
};

export default RegisterBusinessForm;