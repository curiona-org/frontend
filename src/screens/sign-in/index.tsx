import Toast, { ToastRef } from "@/components/ui/toast";
import { ERROR_MESSAGES } from "@/shared/helpers/error.helper";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { signIn } from "./actions";
import { useFormSignIn } from "./form";

const signInErrorMap: Record<string, string> = {
  AccessDenied: ERROR_MESSAGES.SIGNUP_DIFFERENT_METHOD,
};

export default function SignInPage() {
  const { register, handleSubmit } = useFormSignIn();

  const { status } = useSession();
  if (status === "authenticated") {
    redirect("/");
  }

  const search = useSearchParams();
  const error = search.get("error");
  const toastRef = useRef<ToastRef>(null);

  useEffect(() => {
    if (error) {
      toastRef.current?.open({
        type: "error",
        title: "Error",
        description: signInErrorMap[error] || ERROR_MESSAGES.INTERNAL_ERROR,
      });
    }
  }, [error]);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    const result = await signIn("credentials", { email, password });
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
      <div className="relative w-screen h-screen overflow-y-auto">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="w-full max-w-md p-4 space-y-4 bg-white-100 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center">Sign In</h1>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="w-96 space-y-2">
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  placeholder="Email"
                  {...register("email")}
                />
              </div>
              <div className="w-96 space-y-10">
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  placeholder="Password"
                  {...register("password")}
                />
              </div>
              <button
                type="submit"
                className="w-96 px-4 py-2 text-white-500 bg-blue-500 rounded-md hover:bg-blue-900 focus:outline-none focus:ring focus:ring-blue-900"
              >
                Sign In
              </button>

              <p className="text-center">OR</p>

              {/* sign in with google */}
              <button
                onClick={() => signIn("google")}
                type="button"
                className="flex items-center justify-center w-96 px-4 py-2 text-white-500 bg-blue-500 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              >
                Sign In with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
