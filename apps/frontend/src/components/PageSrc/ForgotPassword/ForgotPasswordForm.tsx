"use client";

import { FC, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { staticStrings } from "@/types/staticStrings.type";
import { forgotPasswordAction } from "@/lib/actions/forgotPassword.action";

interface Props {
  locale: string;
  staticStrings: staticStrings;
}

interface FormData {
  email: string;
}

const ForgotPasswordForm: FC<Props> = ({ locale, staticStrings }) => {
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError("");
    setSubmitSuccess("");

    startTransition(async () => {
      try {
        const result = await forgotPasswordAction(locale, { email: data.email });

        if (result.status >= 200 && result.status < 300) {
          setSubmitSuccess(result.data?.message || "Le istruzioni per reimpostare la password sono state inviate alla tua email.");
          reset();
        } else if (result.status === 422) {
          if (result.errors) {
            if (result.errors.email) {
              const emailError = Array.isArray(result.errors.email) ? result.errors.email[0] : result.errors.email;
              setError("email", {
                type: "custom",
                message: emailError,
              });
            }
            setSubmitError("Si sono verificati errori di validazione. Controlla i campi evidenziati.");
          }
        } else {
          setSubmitError(result.data?.message || "Si è verificato un errore. Riprova.");
        }
      } catch (error) {
        setSubmitError("Si è verificato un errore. Riprova.");
      }
    });
  };

  return (
    <form className="col-span-12 grid grid-cols-subgrid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-span-12">
        <Typography variant="h5" component="h1" gutterBottom textAlign="center" fontWeight={600}>
          Password Dimenticata
        </Typography>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Inserisci il tuo indirizzo email e ti invieremo le istruzioni per reimpostare la password.
        </Typography>
      </div>

      {submitError && (
        <div className="col-span-12">
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        </div>
      )}

      {submitSuccess && (
        <div className="col-span-12">
          <Alert severity="success" sx={{ mb: 2 }}>
            {submitSuccess}
          </Alert>
        </div>
      )}

      <div className="col-span-12">
        <Controller
          name="email"
          control={control}
          rules={{
            required: "L'email è obbligatoria",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Formato email non valido",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email Address"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isPending}
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Button type="submit" variant="contained" fullWidth disabled={isPending} size="large">
          {isPending ? "Invio in corso..." : "Invia Istruzioni di Reset"}
        </Button>
      </div>

      <div className="col-span-12">
        <div className="text-center">
          <Button component="a" href={`/${locale}/login`} variant="text" size="small">
            Torna al Login
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
