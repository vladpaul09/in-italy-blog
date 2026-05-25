"use client";

import { FC, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import stripText from "@/utils/stripText";
import { staticStrings } from "@/types/staticStrings.type";

const SubmitButton = styled(Button)(({ theme }) => ({
  boxShadow: "none",
  textTransform: "none",
  borderRadius: 8,
  backgroundColor: theme.palette.primary.main,
  fontSize: 18,
  padding: "12px 24px",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

interface ILoginForm {
  email: string;
  password: string;
}

interface Props {
  locale: string;
  staticStrings: staticStrings;
}

const LoginForm: FC<Props> = ({ locale, staticStrings }) => {
  const router = useRouter();
  const { control, handleSubmit, setError } = useForm<ILoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setAlertMsg(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        locale: locale,
        redirect: false,
      });

      if (result) {
        if (result.ok) {
          setAlertMsg({
            type: "success",
            message: stripText(staticStrings.loginFormSuccessMessage || "Accesso effettuato con successo! Reindirizzamento..."),
          });
          router.push(`/${locale}/profile`);
          return;
        } else {
          if (result.error) {
            console.log(result.error);
            
            // Try to parse validation errors from the error message
            try {
              const parsedError = JSON.parse(result.error);
              if (parsedError.errors && typeof parsedError.errors === 'object') {
                // Handle validation errors - set field-specific errors
                Object.keys(parsedError.errors).forEach((field) => {
                  const fieldErrors = parsedError.errors[field];
                  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                    setError(field as keyof ILoginForm, {
                      type: "custom",
                      message: fieldErrors[0],
                    });
                  }
                });
                
                // Show alert with general message if available
                if (parsedError.message) {
                  setAlertMsg({
                    type: "error",
                    message: stripText(parsedError.message || staticStrings.loginFormInvalidCredentials || "Email o password non valide"),
                  });
                }
                return;
              }
            } catch {
              // If parsing fails, treat as regular error message
            }
            
            // Handle different error types
            if (result.error.includes("Invalid credentials") || result.error.includes("401") || result.error.includes("Email o password non valida")) {
              setAlertMsg({ type: "error", message: stripText(staticStrings.loginFormInvalidCredentials || "Email o password non valide") });
            } else {
              setAlertMsg({
                type: "error",
                message: stripText(staticStrings.loginFormGenericError || "Si è verificato un errore. Riprova."),
              });
            }
          }
        }
      }
    } catch (error) {
      setAlertMsg({ type: "error", message: stripText(staticStrings.loginFormNetworkError || "Errore di rete. Riprova.") });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form className="col-span-12 grid grid-cols-subgrid gap-4" onSubmit={onSubmit}>
      <div className="col-span-12">
        <Typography variant="h4" fontWeight={600} sx={{ textAlign: "center" }}>
          {stripText(staticStrings.loginFormTitle || "Accedi")}
        </Typography>
      </div>
      <div className="col-span-12">
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
          {stripText(staticStrings.loginFormSubtitle || "Bentornato! Accedi al tuo account")}
        </Typography>
      </div>

      {alertMsg && (
        <div className="col-span-12">
          <Alert severity={alertMsg.type} onClose={() => setAlertMsg(null)} sx={{ mb: 3 }}>
            {alertMsg.message}
          </Alert>
        </div>
      )}

      <div className="col-span-12">
        <Controller
          name="email"
          control={control}
          rules={{
            required: stripText(staticStrings.loginFormEmailRequired || "L'email è obbligatoria"),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: stripText(staticStrings.loginFormEmailInvalid || "Indirizzo email non valido"),
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              label={stripText(staticStrings.loginFormEmailLabel || "Email")}
              variant="outlined"
              fullWidth
              type="email"
              helperText={error?.message}
              error={error !== undefined}
              disabled={isLoading}
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Controller
          name="password"
          control={control}
          rules={{
            required: stripText(staticStrings.loginFormPasswordRequired || "La password è obbligatoria"),
            minLength: {
              value: 6,
              message: stripText(staticStrings.loginFormPasswordMinLength || "La password deve essere di almeno 6 caratteri"),
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              label={stripText(staticStrings.loginFormPasswordLabel || "Password")}
              variant="outlined"
              fullWidth
              type="password"
              helperText={error?.message}
              error={error !== undefined}
              disabled={isLoading}
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <SubmitButton type="submit" variant="contained" fullWidth disabled={isLoading}>
          {isLoading ? stripText(staticStrings.loginFormLoading || "Caricamento...") : stripText(staticStrings.loginFormSubmitButton || "Accedi")}
        </SubmitButton>
      </div>

      <div className="col-span-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <Typography variant="body2" color="text.secondary">
            {stripText(staticStrings.loginFormNoAccount || "Non hai un account?")}{" "}
            <Link href={`/${locale}/sign-up`} style={{ color: "inherit", fontWeight: 600 }}>
              {stripText(staticStrings.loginFormSignUp || "Registrati")}
            </Link>
          </Typography>
          <Link href={`/${locale}/forgot-password`} style={{ color: "inherit", fontSize: "0.875rem" }}>
            {stripText(staticStrings.loginFormForgotPassword || "Password dimenticata?")}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
