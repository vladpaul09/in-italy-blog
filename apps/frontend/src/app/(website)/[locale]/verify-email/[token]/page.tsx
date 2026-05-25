import { Metadata } from "next";
import { generatePageMetadata } from "@/utils/generateMetadata.util";
import config from "@/config";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Props {
  params: Promise<{
    locale: string;
    token: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    title: "Verifica Email",
    description: "Verifica il tuo indirizzo email per completare la registrazione su inItaly.",
    image: "/statics/website/regions/header.jpg",
    url: `/${locale}/verify-email`,
  });
}

export default async function VerifyEmailPage({ params }: Props) {
  const { locale, token } = await params;

  // Verify token on server side
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/verify-email/${token}`;
  let verificationResult: {
    success: boolean;
    message: string;
    error?: string;
  };

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok && response.status >= 200 && response.status < 300) {
      verificationResult = {
        success: true,
        message: data.message || "Email verificata con successo.",
      };
    } else {
      const errorMessage =
        data.errors?.token && Array.isArray(data.errors.token)
          ? data.errors.token[0]
          : data.errors?.token || data.message || "Il token di verifica non è valido o è scaduto.";

      verificationResult = {
        success: false,
        message: data.message || "Si è verificato un errore durante la verifica.",
        error: errorMessage,
      };
    }
  } catch (error) {
    verificationResult = {
      success: false,
      message: "Si è verificato un errore. Riprova.",
      error: "Errore di connessione al server.",
    };
  }

  if (verificationResult.success) {
    return (
      <div className="container flex-[1_1_auto] md:max-w-2xl mt-25 mb-10">
        <div className="grid grid-cols-12">
          <div className="col-span-12 grid grid-cols-subgrid gap-4">
            <div className="col-span-12">
              <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 64 }} />
              </Box>

              <Typography variant="h5" component="h1" gutterBottom textAlign="center" fontWeight={600}>
                Email Verificata con Successo!
              </Typography>

              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                Il tuo account è stato verificato con successo. Verrai reindirizzato alla pagina di login tra pochi secondi...
              </Typography>

              <Box display="flex" justifyContent="center">
                <Button component="a" href={`/${locale}/login`} variant="contained" size="large">
                  Vai al Login
                </Button>
              </Box>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex-[1_1_auto] md:max-w-2xl mt-25 mb-10">
      <div className="grid grid-cols-12">
        <div className="col-span-12 grid grid-cols-subgrid gap-4">
          <div className="col-span-12">
            <Typography variant="h5" component="h1" gutterBottom textAlign="center" fontWeight={600}>
              Errore di Verifica
            </Typography>

            {verificationResult.error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {verificationResult.error}
              </Alert>
            )}

            {verificationResult.message && !verificationResult.error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {verificationResult.message}
              </Alert>
            )}

            <Box display="flex" justifyContent="center" gap={2}>
              <Button component="a" href={`/${locale}/login`} variant="contained" size="large">
                Vai al Login
              </Button>
              <Button component="a" href={`/${locale}/sign-up`} variant="outlined" size="large">
                Torna alla Registrazione
              </Button>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}
