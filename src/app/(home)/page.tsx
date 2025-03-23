import { auth } from "@/lib/auth";
import HomeAuthenticated from "@/screens/home/authenticated";
import HomeGuest from "@/screens/home/guest";

export default async function Page() {
  const session = await auth();

  if (session) {
    return <HomeAuthenticated />;
  }

  return <HomeGuest />;
}
