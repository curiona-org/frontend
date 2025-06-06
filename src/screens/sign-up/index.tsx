import RotatingLoader from "@/components/loader/rotating-loader";
import Button from "@/components/ui/button";
import Toast, { ToastRef } from "@/components/ui/toast";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormSignUp } from "./form";

export default function SignUpPage() {
  const {
    session,
    isLoggedIn,
    signUp,
    signInGoogle,
    authError,
    authIsLoading,
    clearAuthError,
  } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormSignUp();
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

    return () => {
      // Clear the error when the component unmounts or when authError changes
      clearAuthError();
      setSubmitErrCount(0);
    };
  }, [authError, clearAuthError]);

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

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    if (toastRef.current?.isOpened) {
      toastRef.current?.close();
    }

    await signUp({ name, email, password });
  });

  return (
    <>
      <Toast ref={toastRef} />
      <div className='flex items-center justify-center min-h-screen px-6 lg:px-72 py-32'>
        <div className='dashedBorder p-5 shadow-lg  flex flex-col gap-3 bg-white-100 rounded-lg w-full max-w-md sm:max-w-lg lg:max-w-md'>
          <h1 className='text-mobile-display-2 lg:text-display-2'>Sign Up</h1>
          <p className='text-mobile-body-1-regular lg:text-body-1-regular'>
            To Create Your Personalized Learning Blueprint
          </p>

          <form className='space-y-4' onSubmit={onSubmit}>
            <input
              className='text-mobile-body-1-medium lg:text-body-1-medium w-full px-3 h-[53px] border border-black-200 rounded-lg focus:outline-none focus:ring focus:border-blue-500 focus:ring-blue-500'
              placeholder='Full Name'
              aria-invalid={errors.name ? "true" : "false"}
              {...register("name")}
              required
            />
            {errors.name && (
              <p className='text-red-500 text-mobile-body-1-regular lg:text-body-1-regular'>
                Please enter your name.
              </p>
            )}
            <input
              type='email'
              className='text-mobile-body-1-medium lg:text-body-1-medium w-full px-3 h-[53px] border border-black-200 rounded-lg focus:outline-none focus:ring focus:border-blue-500 focus:ring-blue-500'
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
            <input
              type='password'
              className='text-mobile-body-1-medium lg:text-body-1-medium w-full px-3 h-[53px] border border-black-200 rounded-lg focus:outline-none focus:ring focus:border-blue-500 focus:ring-blue-500'
              placeholder='Confirm Password'
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              {...register("confirmPassword")}
              required
            />
            {errors.confirmPassword && (
              <p className='text-red-500 text-mobile-body-1-regular lg:text-body-1-regular'>
                Passwords do not match.
              </p>
            )}

            <div className='flex flex-col gap-2'>
              <Button
                type='submit'
                className='text-mobile-body-1-bold lg:text-body-1-bold w-full h-10 text-white-500 bg-blue-500 rounded-lg hover:bg-blue-900 flex justify-center items-center'
              >
                {authIsLoading ? (
                  <RotatingLoader className='size-4 border-[3px] border-white-500' />
                ) : (
                  "Sign Up"
                )}
              </Button>

              <p className='text-center text-mobile-body-1-regular lg:text-body-1-regular'>
                OR
              </p>

              <Button
                onClick={() => signInGoogle()}
                type='button'
                className='flex gap-1 items-center justify-center w-full h-[43px] text-mobile-body-1-medium lg:text-body-1-medium border-2 border-blue-500 rounded-lg hover:bg-blue-900 hover:border-blue-900 hover:text-white-500'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81'
                  />
                </svg>
                Sign Up with Google
              </Button>
              <p className='text-mobile-body-1-regular lg:text-body-1-regular text-center'>
                Already have an account?
                <Link href='sign-in' className='text-blue-500 hover:underline'>
                  {" "}
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
