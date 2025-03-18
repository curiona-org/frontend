"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toast } from "radix-ui";

export default function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      <Toast.Provider swipeDirection='right' duration={5 * 1000}>
        {children}
        <Toast.Viewport className='fixed top-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]' />
      </Toast.Provider>
    </SessionProvider>
  );
}
