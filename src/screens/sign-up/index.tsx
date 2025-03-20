import Toast, { ToastRef } from "@/components/ui/toast";
import { useRef } from "react";
import { signUp } from "./actions";
import { useFormSignUp } from "./form";
import Link from "next/link";

export default function SignUpPage() {
  const { register, handleSubmit } = useFormSignUp();
  const toastRef = useRef<ToastRef>(null);

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    const result = await signUp("credentials", { name, email, password });
    if (result && result.error) {
      toastRef.current?.open({
        type: "error",
        title: "Error",
        description: result.error,
      });
      return;
    }

    if (toastRef.current?.isOpened) {
      toastRef.current?.close();
    }
  });
  return (
    <>
      <Toast ref={toastRef} />
      <div className=" flex items-center justify-center min-h-screen px-6">
        <div className="flex flex-col gap-6 p-6 bg-white-100 dashedBorder rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-md">
          <div className="text-start flex flex-col gap-2">
            <h1 className="text-5xl font-bold">Sign Up</h1>
            <p className="text-black-500">
              to Create Your Personalized Learning Blueprint
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <input
                className="w-full px-4 py-2 border border-black-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="Full Name"
                {...register("name")}
              />
              <input
                type="email"
                className="w-full px-4 py-2 border border-black-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="Email"
                {...register("email")}
              />
            </div>
            <div className="space-y-2">
              <input
                type="password"
                className="w-full px-4 py-2 border border-black-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="Password"
                {...register("password")}
              />
            </div>
            <div className="space-y-2">
              <input
                type="password"
                className="w-full px-4 py-2 border border-black-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="w-full px-4 py-2 text-white-500 bg-blue-500 hover:bg-blue-900 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              >
                Sign up
              </button>

              <p className="text-center">OR</p>

              {/* sign up with google */}
              <button
                onClick={() => signUp("google")}
                type="button"
                className="flex gap-1 items-center justify-center w-full px-4 py-2 text-black-500 border-2 border-blue-500 hover:border-blue-900 hover:bg-blue-900 hover:text-white-500 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
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
                Sign up with Google
              </button>
              <p className="text-sm text-center">
                Already have an account?
                <Link href="sign-in" className="text-blue-500 hover:underline">
                  {" "}
                  Sign In
                </Link>
              </p>
            </div>
          </form>

          <p className="text-gray-500 text-xs mt-2 max-w-sm">
            By continuing to use our services, you acknowledge that you have
            both read and agree to our
            <Link href="#" className="text-blue-500 hover:underline">
              {" "}
              Terms of Service
            </Link>{" "}
            and
            <Link href="#" className="text-blue-500 hover:underline">
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
