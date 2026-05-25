"use client";

import { FC, useState } from "react";
import { useForm, Controller, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { staticStrings } from "@/types/staticStrings.type";
import stripText from "@/utils/stripText";
import { excellentCrafterFormSchema, sectorOptions, type ExcellentCrafterFormData } from "@/schemas/excellentCrafterForm.schema";

const SubmitButton = styled(Button)(({ theme }) => ({
  boxShadow: "none",
  textTransform: "none",
  borderRadius: 16,
  backgroundColor: "#2C2C2C",
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "bold",
  padding: "16px 32px",
  "&:hover": {
    backgroundColor: "#1A1A1A",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 8,
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
    "& input": {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    "& textarea": {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    "& input::placeholder": {
      color: "#FFFFFF",
      opacity: 0.7,
      fontWeight: "bold",
    },
    "& textarea::placeholder": {
      color: "#FFFFFF",
      opacity: 0.7,
      fontWeight: "bold",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#FFFFFF",
    fontWeight: "bold",
    "&.Mui-focused": {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
  },
}));

interface Props {
  staticStrings: staticStrings;
  locale: string;
}

const ExcellentCrafterForm: FC<Props> = ({ staticStrings, locale }) => {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ExcellentCrafterFormData>({
    resolver: zodResolver(excellentCrafterFormSchema),
    defaultValues: {
      activityName: "",
      companyName: "",
      sector: "",
      activityDescription: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      streetAddress: "",
      postalCode: "",
      city: "",
      province: "",
      message: "",
    },
  });

  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/${locale}/website/excellent-crafter-form`, {
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
          Object.keys(errorData.errors || {}).forEach((item) => {
            setError(item as Path<ExcellentCrafterFormData>, {
              type: "custom",
              message: errorData.errors[item][0],
            });
          });
          setAlertMsg({
            type: "error",
            message: "Si sono verificati errori di validazione. Controlla i campi evidenziati.",
          });
        } else {
          setAlertMsg({
            type: "error",
            message: "Si è verificato un errore durante l'invio del form. Riprova più tardi.",
          });
        }
      } else {
        setAlertMsg({
          type: "success",
          message: "Form inviato con successo! Ti ricontatteremo al più presto.",
        });
        reset({
          activityName: "",
          companyName: "",
          sector: "",
          activityDescription: "",
          name: "",
          surname: "",
          email: "",
          phone: "",
          streetAddress: "",
          postalCode: "",
          city: "",
          province: "",
          message: "",
        });
      }
    } catch (error) {
      setAlertMsg({
        type: "error",
        message: "Errore di rete. Controlla la tua connessione e riprova.",
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <Typography variant="body1" className="text-center mb-4">
          Compila il form con i tuoi dati aziendali per diventare partner. Saremo lieti di ricontattarti per inserirti nel marketplace delle
          Eccellenze italiane.
        </Typography>
      </div>

      {alertMsg && (
        <div className="col-span-12">
          <Alert severity={alertMsg.type} onClose={() => setAlertMsg(null)} sx={{ mb: 2 }}>
            {alertMsg.message}
          </Alert>
        </div>
      )}

      <div className="col-span-12">
        <Controller
          name="activityName"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="Nome dell'attività *"
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              placeholder="Nome dell'attività"
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Controller
          name="companyName"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="Ragione sociale *"
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              placeholder="Ragione sociale"
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Controller
          name="sector"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl error={error !== undefined} fullWidth>
              <FormLabel component="legend">Settore *</FormLabel>
              <RadioGroup value={value || ""} onChange={(e) => onChange(e.target.value)} row>
                {sectorOptions.map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </div>

      <div className="col-span-12">
        <Controller
          name="activityDescription"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="Breve descrizione dell'attività *"
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              placeholder="Breve descrizione dell'attività"
              multiline
              rows={4}
            />
          )}
        />
      </div>

      {/* Contact Information Section */}
      <div className="col-span-12 mt-2">
        <Typography variant="h6" fontWeight="bold" className="mb-2">
          Informazioni di contatto
        </Typography>
      </div>

      <div className="col-span-12 md:col-span-6">
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="Nome *"
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              placeholder="Nome"
            />
          )}
        />
      </div>

      <div className="col-span-12 md:col-span-6">
        <Controller
          name="surname"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="Cognome *"
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              placeholder="Cognome"
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="Email *"
              variant="outlined"
              fullWidth
              type="email"
              helperText={error?.message}
              error={error !== undefined}
              placeholder="Email"
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Controller
          name="phone"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="Telefono *"
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              placeholder="Telefono"
            />
          )}
        />
      </div>

      {/* Address Section */}
      <div className="col-span-12 mt-2">
        <Typography variant="h6" fontWeight="bold" className="mb-2">
          Indirizzo
        </Typography>
      </div>

      <div className="col-span-12 md:col-span-8">
        <Controller
          name="streetAddress"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="Via e numero civico *"
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              placeholder="Via e numero civico"
            />
          )}
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Controller
          name="postalCode"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="CAP *"
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              placeholder="CAP"
            />
          )}
        />
      </div>

      <div className="col-span-12 md:col-span-6">
        <Controller
          name="city"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="Città *"
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              placeholder="Città"
            />
          )}
        />
      </div>

      <div className="col-span-12 md:col-span-6">
        <Controller
          name="province"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="Provincia *"
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              placeholder="Provincia"
            />
          )}
        />
      </div>

      {/* Message Section */}
      <div className="col-span-12 mt-2">
        <Controller
          name="message"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledTextField
              value={value}
              onChange={onChange}
              label="Lascia un messaggio..."
              variant="outlined"
              fullWidth
              helperText={error?.message}
              error={error !== undefined}
              placeholder="Lascia un messaggio..."
              multiline
              rows={6}
            />
          )}
        />
      </div>

      {/* Privacy Disclaimer */}
      <div className="col-span-12">
        <Typography variant="body2" className="text-gray-600 mb-4">
          InITALY ha bisogno delle tue informazioni di contatto per inviarti comunicazioni su prodotti e servizi. Puoi annullare l&apos;iscrizione in
          qualsiasi momento. Per ulteriori informazioni su come eseguire questa operazione, consultare le nostre normative sulla privacy e altre
          indicazioni su protezione e rispetto della privacy, leggi la nostra Informativa sulla privacy.
        </Typography>
      </div>

      {/* Submit Button */}
      <div className="col-span-12 flex justify-end mt-2">
        <SubmitButton
          type="submit"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? "Invio in corso..." : "INVIA"}
        </SubmitButton>
      </div>
    </form>
  );
};

export default ExcellentCrafterForm;
