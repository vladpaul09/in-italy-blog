"use client";

import { FC, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { staticStrings } from "@/types/staticStrings.type";
import { resetPasswordAction } from "@/lib/actions/resetPassword.action";
import { useRouter } from "next/navigation";

interface Props {
  locale: string;
  staticStrings: staticStrings;
  token: string;
}

interface FormData {
  password: string;
  password_confirmation: string;
}

const ResetPasswordForm: FC<Props> = ({ locale, staticStrings, token }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const password = watch("password");

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowPasswordConfirmation = () => {
    setShowPasswordConfirmation((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async (data: FormData) => {
    setSubmitError("");
    setSubmitSuccess("");

    startTransition(async () => {
      try {
        const result = await resetPasswordAction(locale, {
          token,
          password: data.password,
          password_confirmation: data.password_confirmation,
        });

        if (result.status >= 200 && result.status < 300) {
          setSubmitSuccess(result.data?.message || "Password reimpostata con successo.");
          setTimeout(() => {
            router.push(`/${locale}/login`);
          }, 4000);
        } else if (result.status === 422) {
          if (result.errors) {
            if (result.errors.password) {
              const passwordError = Array.isArray(result.errors.password) ? result.errors.password[0] : result.errors.password;
              setError("password", {
                type: "custom",
                message: passwordError,
              });
            }
            if (result.errors.token) {
              const tokenError = Array.isArray(result.errors.token) ? result.errors.token[0] : result.errors.token;
              setSubmitError(tokenError || "Il token di reset non è valido o è scaduto.");
            }
            if (!result.errors.token && !result.errors.password) {
              setSubmitError("Si sono verificati errori di validazione. Controlla i campi evidenziati.");
            }
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
          Reimposta Password
        </Typography>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Inserisci la tua nuova password.
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
          name="password"
          control={control}
          rules={{
            required: "La password è obbligatoria",
            minLength: {
              value: 8,
              message: "La password deve contenere almeno 8 caratteri",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Nuova Password"
              type={showPassword ? "text" : "password"}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isPending}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      tabIndex={0}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Controller
          name="password_confirmation"
          control={control}
          rules={{
            required: "La conferma password è obbligatoria",
            validate: (value) => value === password || "Le password non corrispondono",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Conferma Password"
              type={showPasswordConfirmation ? "text" : "password"}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation?.message}
              disabled={isPending}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password confirmation visibility"
                      onClick={handleClickShowPasswordConfirmation}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      tabIndex={0}
                    >
                      {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>

      <div className="col-span-12">
        <Button type="submit" variant="contained" fullWidth disabled={isPending} size="large">
          {isPending ? "Reimpostazione in corso..." : "Reimposta Password"}
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

export default ResetPasswordForm;

