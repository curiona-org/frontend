import { auth } from "@/lib/auth";
import { AuthProvider } from "@/providers/auth-provider";
import { Toast } from "radix-ui";

export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <AuthProvider initialSession={session}>
      <Toast.Provider swipeDirection="right" duration={5 * 1000}>
        {children}
        <Toast.Viewport className="fixed top-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
      </Toast.Provider>
    </AuthProvider>
  );
}
