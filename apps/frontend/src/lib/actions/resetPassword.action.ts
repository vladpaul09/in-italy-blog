"use server";

import config from "@/config";

interface ResetPasswordResult {
  data: { message: string };
  errors?: { password?: string[]; token?: string[] };
  status: number;
}

export async function resetPasswordAction(
  locale: string,
  formData: { token: string; password: string; password_confirmation: string }
): Promise<ResetPasswordResult> {
  // Call backend API to reset password with token
  const apiUrl = `${config.serverNameBackend}/api/website/${locale}/me/reset-password/${formData.token}`;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ password: formData.password, confirmPassword: formData.password_confirmation }),
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
    data: { message: data.message || "Password reimpostata con successo." },
    errors: data.errors,
    status: response.status,
  };
}

