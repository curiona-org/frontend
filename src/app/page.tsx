import HomeAuthenticated from "@/screens/home/authenticated";
import HomeGuest from "@/screens/home/guest";
import { auth } from "@/shared/auth";

export default async function Page() {
  const session = await auth();

  return session ? <HomeAuthenticated /> : <HomeGuest />;
}
