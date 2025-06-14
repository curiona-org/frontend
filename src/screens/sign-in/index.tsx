import RotatingLoader from "@/components/loader/rotating-loader";
import Button from "@/components/ui/button";
import { toast, toastDismissAll } from "@/components/ui/toast-sonner";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormSignIn } from "./form";

export default function SignInPage() {
  const {
    session,
    isLoggedIn,
    signIn,
    signInGoogle,
    authError,
    authIsLoading,
    clearAuthError,
  } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormSignIn();
  const [submitErrCount, setSubmitErrCount] = useState(0);

  useEffect(() => {
    toastDismissAll();
  }, []);

  useEffect(() => {
    if (authError) {
      // Increment error counter to ensure the effect runs again
      // even if the error message is the same
      setSubmitErrCount((prev) => prev + 1);

      toast({
        type: "error",
        title: "Error",
        description: authError,
      });
    }

    return () => {
      // Clear the error when the component unmounts or when authError changes
      clearAuthError();
      setSubmitErrCount(0);
    };
  }, [authError, clearAuthError]);

  useEffect(() => {
    if (!authIsLoading && authError && submitErrCount > 0) {
      toast({
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
    toastDismissAll();
    const success = await signIn({ email, password });

    if (success) {
      window.location.reload();
    }
  });

  return (
    <div className='flex items-center justify-center min-h-screen px-6 lg:px-72 py-32'>
      <div className='flex flex-col gap-2 dashedBorder p-5 shadow-lg bg-white-100 rounded-lg w-full max-w-md sm:max-w-lg lg:max-w-md'>
        <h1 className='text-mobile-display-2 lg:text-display-2'>Sign In</h1>
        <p className='text-mobile-body-1-regular lg:text-body-1-regular'>
          To Create Your Personalized Learning Blueprint
        </p>

        <form className='space-y-2' onSubmit={onSubmit}>
          <input
            type='email'
            className='text-mobile-body-1-medium lg:text-body-1-medium w-full px-3 h-[53px] border border-black-200 rounded-lg focus:outline-none focus:ring focus:border-blue-500  focus:ring-blue-500'
            placeholder='Email'
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
            required
          />
          {errors.email && (
            <p className='text-red-500 text-mobile-body-1-regular lg:text-body-1-regular'>
              Please enter a valid email address.
            </p>
          )}
          <input
            type='password'
            className='text-mobile-body-1-medium lg:text-body-1-medium w-full px-3 h-[53px] border border-black-200 rounded-lg focus:outline-none focus:ring focus:border-blue-500 focus:ring-blue-500'
            placeholder='Password'
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password")}
            required
          />
          {errors.password && (
            <p className='text-red-500 text-mobile-body-1-regular lg:text-body-1-regular'>
              Password must be at least 6 characters long.
            </p>
          )}

          <Button
            type='submit'
            disabled={authIsLoading}
            className='text-mobile-body-1-bold lg:text-body-1-bold w-full h-11 text-white-500 bg-blue-500 hover:bg-blue-900 flex justify-center items-center'
          >
            {authIsLoading ? (
              <RotatingLoader className='size-4 border-[3px] border-white-500' />
            ) : (
              "Sign In"
            )}
          </Button>

          <p className='text-center text-mobile-body-1-regular lg:text-body-1-regular'>
            OR
          </p>

          <Button
            onClick={() => signInGoogle()}
            type='button'
            className='flex gap-1 items-center justify-center w-full h-11 text-mobile-body-1-medium lg:text-body-1-medium border-2 border-blue-500 hover:bg-blue-900 hover:border-blue-900 hover:text-white-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
            >
              <path
                fill='currentColor'
                d='M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81'
              />
            </svg>
            Sign In with Google
          </Button>
          <p className='text-mobile-body-1-regular lg:text-body-1-regular text-center'>
            Don&apos;t have an account?
            <Link href='sign-up' className='text-blue-500 hover:underline'>
              {" "}
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
