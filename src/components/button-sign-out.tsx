"use client";
import Button from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation"; // Import useRouter

export default function ButtonSignOut() {
  const { isLoggedIn, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in"); // Redirect to sign-in page after signing out
  };

  if (!isLoggedIn) {
    return null;
  }

  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
