"use client";
import Button from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/helpers/common.helper";
interface ButtonSignOutProps {
  className?: string;
}

export default function ButtonSignOut({ className }: ButtonSignOutProps) {
  const { isLoggedIn, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in"); // Redirect to sign-in page after signing out
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Button
      disableEffects
      onClick={handleSignOut}
      className={cn("w-full text-start", className)}
    >
      Sign Out
    </Button>
  );
}
