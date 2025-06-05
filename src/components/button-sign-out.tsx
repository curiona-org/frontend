"use client";
import Button from "@/components/ui/button";
import { cn } from "@/lib/helpers/common.helper";
import { useAuth } from "@/providers/auth-provider";
import { redirect } from "next/navigation";
interface ButtonSignOutProps {
  className?: string;
}

export default function ButtonSignOut({ className }: ButtonSignOutProps) {
  const { isLoggedIn, signOut, session } = useAuth();
  // const router = useRouter();

  const handleSignOut = async () => {
    if (session?.user?.id) {
      sessionStorage.removeItem(`login_${session.user.id}`);
    }
    await signOut();
    redirect("/");
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
