import Toast, { ToastRef } from "@/components/ui/toast";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormSignIn } from "./form";

export default function SignInPage() {
  const {
    session,
    isLoggedIn,
    signIn,
    signInGoogle,
    authError,
    authIsLoading,
  } = useAuth();
  const { register, handleSubmit } = useFormSignIn();
  const [submitErrCount, setSubmitErrCount] = useState(0);
  const toastRef = useRef<ToastRef>(null);

  useEffect(() => {
    if (authError) {
      // Increment error counter to ensure the effect runs again
      // even if the error message is the same
      setSubmitErrCount((prev) => prev + 1);

      if (toastRef.current?.isOpened) {
        toastRef.current?.close();
      }

      // Short timeout to ensure the toast is closed before opening a new one
      setTimeout(() => {
        toastRef.current?.open({
          type: "error",
          title: "Error",
          description: authError,
        });
      }, 100);
    }
  }, [authError]);

  useEffect(() => {
    if (!authIsLoading && authError && submitErrCount > 0) {
      if (toastRef.current?.isOpened) {
        toastRef.current?.close();
      }
      toastRef.current?.open({
        type: "error",
        title: "Error",
        description: authError,
      });
    }
  }, [authError, authIsLoading, submitErrCount]);

  useEffect(() => {
    if (isLoggedIn && session) {
      redirect("/");
    }
  }, [isLoggedIn, session]);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    if (toastRef.current?.isOpened) {
      toastRef.current?.close();
    }

    await signIn({ email, password });
  });

  return (
    <>
      <Toast ref={toastRef} />
      <div className="flex items-center justify-center min-h-screen px-6 py-28 ">
        <div className="dashedBorder p-5 shadow-lg  flex flex-col gap-3 bg-white-100 rounded-lg w-full max-w-md sm:max-w-lg lg:max-w-md">
          <h1 className="text-mobile-display-2 md:text-display-2">Sign In</h1>
          <p className="text-mobile-body-1-regular md:text-body-1-regular">
            to Create Your Personalized Learning Blueprint
          </p>

          <form className="space-y-3" onSubmit={onSubmit}>
            <input
              type="email"
              className="text-mobile-body-1-medium md:text-body-1-medium w-full px-3 h-[53px] border border-black-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Email"
              {...register("email")}
            />
            <input
              type="password"
              className="text-mobile-body-1-medium md:text-body-1-medium w-full px-3 h-[53px] border border-black-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Password"
              {...register("password")}
            />
            <div className="text-start">
              <Link
                href="#"
                className="text-mobile-body-1-regular md:text-body-1-regular text-blue-500 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={authIsLoading}
              className="text-mobile-body-1-bold md:text-body-1-bold block w-full h-10 text-white-500 bg-blue-500 rounded-lg hover:bg-blue-900 focus:outline-none focus:scale-100 transition-transform duration-300 ease-out hover:scale-105"
            >
              {authIsLoading ? "..." : "Continue"}
            </button>

            <p className="text-center text-sm md:text-base">OR</p>

            {/* sign in with google */}
            <button
              onClick={() => signInGoogle()}
              type="button"
              className="flex gap-1 items-center justify-center w-full h-[43px] text-mobile-body-1-medium md:text-body-1-medium border-2 border-blue-500 rounded-lg focus:outline-none hover:bg-blue-900 hover:border-blue-900 hover:text-white-500 focus:scale-100 transition-transform duration-300 ease-out hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81"
                />
              </svg>
              Sign In with Google
            </button>
            <p className="text-mobile-body-2 md:text-body-2 text-center">
              Don&apos;t have an account?
              <Link href="sign-up" className="text-blue-500 hover:underline">
                {" "}
                Sign Up
              </Link>
            </p>
          </form>
          <p className="text-mobile-body-2 md:text-body-2 max-w-sm">
            By continuing to use our services, you acknowledge that you have
            both read and agree to our
            <Link href="#" className="text-blue-500 underline">
              {" "}
              Terms of Service
            </Link>{" "}
            and
            <Link href="#" className="text-blue-500 underline">
              {" "}
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
