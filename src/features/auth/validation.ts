import { z } from "zod";
export const emailSchema = z.string().trim().email("Informe um e-mail válido.");
export const passwordSchema = z.string().min(8, "Use pelo menos 8 caracteres.").max(72);
export const credentialsSchema = z.object({ email: emailSchema, password: passwordSchema });
