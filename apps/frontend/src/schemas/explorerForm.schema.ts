import { z } from "zod";

export const activityOptions = ["Studente", "Impiegato", "Imprenditore", "Pensionato"] as const;

export const explorerFormSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  surname: z.string().min(1, "Il cognome è obbligatorio"),
  email: z.string().email("Indirizzo email non valido").min(1, "L'email è obbligatoria"),
  phone: z.string().min(1, "Il cellulare è obbligatorio"),
  activity: z
    .string()
    .min(1, "L'attività è obbligatoria")
    .refine((val) => activityOptions.includes(val as (typeof activityOptions)[number]), {
      message: "Seleziona un'attività valida",
    }),
  streetAddress: z.string().min(1, "L'indirizzo è obbligatorio"),
  postalCode: z.string().min(1, "Il CAP è obbligatorio"),
  city: z.string().min(1, "La città è obbligatoria"),
  province: z.string().min(1, "La provincia è obbligatoria"),
  instagramProfile: z.string().optional(),
  socialProfile: z.string().optional(),
  facebookProfile: z.string().optional(),
  whyExplorer: z.string().min(1, "Il campo è obbligatorio"),
});

export type ExplorerFormData = z.infer<typeof explorerFormSchema>;

