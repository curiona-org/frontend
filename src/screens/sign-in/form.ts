import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchemaSignIn = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type FormTypeSignIn = z.infer<typeof formSchemaSignIn>;

export const useFormSignIn = () =>
  useForm<FormTypeSignIn>({
    resolver: zodResolver(formSchemaSignIn),
  });
