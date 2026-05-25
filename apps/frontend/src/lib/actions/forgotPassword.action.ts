"use server";

import config from "@/config";

interface ForgotPasswordResult {
  data: { message: string };
  errors?: { email?: string[] };
  status: number;
}

export async function forgotPasswordAction(locale: string, formData: { email: string }): Promise<ForgotPasswordResult> {
  // Call backend API to send password reset email
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/me/forgot-password`;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      data: { message: data.message || "Si è verificato un errore. Riprova." },
      errors: data.errors,
      status: response.status,
    };
  }

  return {
    data: data.message,
    errors: data.errors,
    status: response.status,
  };
}
