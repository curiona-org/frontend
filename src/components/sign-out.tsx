"use client";
import { signOut } from "next-auth/react";

export default function ButtonSignOut() {
  return <button onClick={() => signOut()}>Sign out</button>;
}
