import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchemaSignUp = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormTypeSignUp = z.infer<typeof formSchemaSignUp>;

export const useFormSignUp = () =>
  useForm<FormTypeSignUp>({
    resolver: zodResolver(formSchemaSignUp),
  });
