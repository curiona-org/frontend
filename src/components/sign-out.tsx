"use client";
import Button from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export default function ButtonSignOut() {
  const { signOut } = useAuth();
  return <Button onClick={() => signOut()}>Sign out</Button>;
}
