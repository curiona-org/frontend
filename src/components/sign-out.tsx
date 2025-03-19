"use client";
import Button from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function ButtonSignOut() {
  return <Button onClick={() => signOut()}>Sign out</Button>;
}
