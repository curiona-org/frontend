"use client";
import Button from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/helpers/common.helper";
interface ButtonSignOutProps {
  className?: string;
}

export default function ButtonSignOut({ className }: ButtonSignOutProps) {
  const { isLoggedIn, signOut, session } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (session?.user?.id) {
      sessionStorage.removeItem(`login_${session.user.id}`);
    }
    await signOut();
    router.push("/"); // Redirect to sign-in page after signing out
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
