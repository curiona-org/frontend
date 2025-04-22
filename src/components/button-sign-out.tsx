"use client";
import Button from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export default function ButtonSignOut() {
  const { isLoggedIn, signOut } = useAuth();

  if (!isLoggedIn) {
    return null;
  }

  return (
    // temporary style button
    <Button
      onClick={signOut}
      className='w-32 py-3 bg-red-500 hover:bg-red-900 text-white-500 rounded-lg mt-4'
    >
      Sign Out
    </Button>
  );
}
