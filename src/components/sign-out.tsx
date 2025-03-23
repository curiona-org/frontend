"use client";
import { useAuth } from "@/components/providers/auth-provider";
import Button from "@/components/ui/button";

export default function ButtonSignOut() {
  const { signOut } = useAuth();
  return <Button onClick={() => signOut()}>Sign out</Button>;
}
