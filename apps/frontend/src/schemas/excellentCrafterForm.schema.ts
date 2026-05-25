import { z } from "zod";

export const sectorOptions = ["Artigianato", "Alimentare", "Altro"] as const;

export const excellentCrafterFormSchema = z.object({
  activityName: z.string().min(1, "Il nome dell'attività è obbligatorio"),
  companyName: z.string().min(1, "La ragione sociale è obbligatoria"),
  sector: z
    .string()
    .min(1, "Il settore è obbligatorio")
    .refine((val) => sectorOptions.includes(val as (typeof sectorOptions)[number]), {
      message: "Seleziona un settore valido",
    }),
  activityDescription: z.string().min(1, "La descrizione dell'attività è obbligatoria"),
  name: z.string().min(1, "Il nome è obbligatorio"),
  surname: z.string().min(1, "Il cognome è obbligatorio"),
  email: z.string().email("Indirizzo email non valido").min(1, "L'email è obbligatoria"),
  phone: z.string().min(1, "Il telefono è obbligatorio"),
  streetAddress: z.string().min(1, "L'indirizzo è obbligatorio"),
  postalCode: z.string().min(1, "Il CAP è obbligatorio"),
  city: z.string().min(1, "La città è obbligatoria"),
  province: z.string().min(1, "La provincia è obbligatoria"),
  message: z.string().optional(),
});

export type ExcellentCrafterFormData = z.infer<typeof excellentCrafterFormSchema>;

