"use client";
import Button from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation"; // Import useRouter

export default function ButtonSignOut() {
  const { isLoggedIn, signOut } = useAuth();
  const router = useRouter(); // Inisialisasi useRouter untuk navigasi

  const handleSignOut = async () => {
    await signOut(); // Lakukan sign out
    router.push("/"); // Redirect ke halaman home setelah sign out
  };

  if (!isLoggedIn) {
    return null;
  }

  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
