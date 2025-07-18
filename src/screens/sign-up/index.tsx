import RotatingLoader from "@/components/loader/rotating-loader";
import Button from "@/components/ui/button";
import { toast, toastDismissAll } from "@/components/ui/toast-sonner";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  useEffect(() => {
    toastDismissAll();
  }, []);

  useEffect(() => {
    if (authError) {
      // Increment error counter to ensure the effect runs again
      // even if the error message is the same
      setSubmitErrCount((prev) => prev + 1);

      // Short timeout to ensure the toast is closed before opening a new one
      setTimeout(() => {
        toast({
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

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    toastDismissAll();
    const success = await signUp({ name, email, password });
    if (success) {
      window.location.reload();
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-6 lg:px-72 py-32">
      <div className="dashedBorder p-5 shadow-lg  flex flex-col gap-3 bg-white-100 rounded-lg w-full max-w-md sm:max-w-lg lg:max-w-md">
        <h1 className="text-mobile-display-2 lg:text-display-2">Sign Up</h1>
        <p className="text-mobile-body-1-regular lg:text-body-1-regular">
          To Create Your Personalized Learning Blueprint
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="text-mobile-body-1-medium lg:text-body-1-medium flex flex-col gap-2">
            {/* Full Name */}
            <label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              className="w-full px-3 h-[53px] border border-black-200 rounded-lg focus:outline-none focus:ring focus:border-blue-500 focus:ring-blue-500"
              placeholder="John Doe"
              aria-invalid={errors.name ? "true" : "false"}
              {...register("name", { required: true })}
              required
              maxLength={40}
            />
            {errors.name && (
              <p className="text-red-500 text-mobile-body-1-regular lg:text-body-1-regular">
                Please enter your name.
              </p>
            )}
          </div>
          <div className="text-mobile-body-1-medium lg:text-body-1-medium flex flex-col gap-2">
            {/* Email */}
            <label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 h-[53px] border border-black-200 rounded-lg focus:outline-none focus:ring focus:border-blue-500 focus:ring-blue-500"
              placeholder="john.doe@gmail.com"
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email")}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-mobile-body-1-regular lg:text-body-1-regular">
                Please enter a valid email address.
              </p>
            )}
          </div>
          <div className="text-mobile-body-1-medium lg:text-body-1-medium flex flex-col gap-2">
            {/* Password */}
            <label htmlFor="password" className="font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-3 h-[53px] border border-black-200 rounded-lg focus:outline-none focus:ring focus:border-blue-500 focus:ring-blue-500"
                aria-invalid={errors.password ? "true" : "false"}
                placeholder="******"
                {...register("password")}
                onChange={(e) => {
                  setPasswordValue(e.target.value);
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none ${
                  !passwordValue ? "opacity-50 cursor-not-allowed" : ""
                }`}
                tabIndex={-1}
                disabled={!passwordValue}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none">
                      <path
                        fill="currentColor"
                        d="M9 12a3 3 0 0 0 5.121 2.121l3.36 3.36A10.44 10.44 0 0 1 12 19c-4.664 0-8.4-2.903-10-7c.901-2.307 2.48-4.236 4.52-5.48l3.359 3.359A3 3 0 0 0 9 12"
                        opacity="0.16"
                      />
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.73 5.073A11 11 0 0 1 12 5c4.664 0 8.4 2.903 10 7a11.6 11.6 0 0 1-1.555 2.788M6.52 6.519C4.48 7.764 2.9 9.693 2 12c1.6 4.097 5.336 7 10 7a10.44 10.44 0 0 0 5.48-1.52m-7.6-7.6a3 3 0 1 0 4.243 4.243"
                      />
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="m4 4l16 16"
                      />
                    </g>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-mobile-body-1-regular lg:text-body-1-regular">
                Password must be at least 6 characters long.
              </p>
            )}
          </div>
          <div className="text-mobile-body-1-medium lg:text-body-1-medium flex flex-col gap-2">
            {/* Confirm Password */}
            <label htmlFor="confirmPassword" className="font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-3 h-[53px] border border-black-200 rounded-lg focus:outline-none focus:ring focus:border-blue-500 focus:ring-blue-500"
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                placeholder="******"
                {...register("confirmPassword")}
                onChange={(e) => {
                  setConfirmPasswordValue(e.target.value);
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 focus:outline-none ${
                  !confirmPasswordValue ? "opacity-50 cursor-not-allowed" : ""
                }`}
                tabIndex={-1}
                disabled={!confirmPasswordValue}
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none">
                      <path
                        fill="currentColor"
                        d="M9 12a3 3 0 0 0 5.121 2.121l3.36 3.36A10.44 10.44 0 0 1 12 19c-4.664 0-8.4-2.903-10-7c.901-2.307 2.48-4.236 4.52-5.48l3.359 3.359A3 3 0 0 0 9 12"
                        opacity="0.16"
                      />
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.73 5.073A11 11 0 0 1 12 5c4.664 0 8.4 2.903 10 7a11.6 11.6 0 0 1-1.555 2.788M6.52 6.519C4.48 7.764 2.9 9.693 2 12c1.6 4.097 5.336 7 10 7a10.44 10.44 0 0 0 5.48-1.52m-7.6-7.6a3 3 0 1 0 4.243 4.243"
                      />
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="m4 4l16 16"
                      />
                    </g>
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-mobile-body-1-regular lg:text-body-1-regular">
                Passwords do not match.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="text-mobile-body-1-bold lg:text-body-1-bold w-full h-10 text-white-500 bg-blue-500 rounded-lg hover:bg-blue-900 flex justify-center items-center"
            >
              {authIsLoading ? (
                <RotatingLoader className="size-4 border-[3px] border-white-500" />
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-center text-mobile-body-1-regular lg:text-body-1-regular">
              OR
            </p>

            <Button
              onClick={() => signInGoogle()}
              type="button"
              className="flex gap-1 items-center justify-center w-full h-[43px] text-mobile-body-1-medium lg:text-body-1-medium border-2 border-blue-500 rounded-lg hover:bg-blue-900 hover:border-blue-900 hover:text-white-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81"
                />
              </svg>
              Sign Up with Google
            </Button>
            <p className="text-mobile-body-1-regular lg:text-body-1-regular text-center">
              Already have an account?
              <Link href="sign-in" className="text-blue-500 hover:underline">
                {" "}
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
