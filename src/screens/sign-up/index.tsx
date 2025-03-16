import {
  CurionaErrorCodes,
  defaultCurionaErrorMessages,
} from "@/shared/helpers/error";
import Toast, { ToastRef } from "@/ui/toast";
import { useRef } from "react";
import { signUp } from "./actions";
import { useFormSignUp } from "./form";

export default function SignUpPage() {
  const { register, handleSubmit } = useFormSignUp();
  const toastRef = useRef<ToastRef>(null);

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    const result = await signUp("credentials", { name, email, password });
    if (result && result.error) {
      toastRef.current?.open({
        type: "error",
        title: "Error",
        description:
          result.error ||
          defaultCurionaErrorMessages[
            result.code || CurionaErrorCodes.INVALID_CREDENTIALS
          ],
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
      <div className='relative w-screen h-screen overflow-y-auto'>
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <div className='w-full max-w-md p-4 space-y-4 bg-white rounded-lg shadow-lg'>
            <h1 className='text-2xl font-bold text-center'>Sign up</h1>
            <form className='space-y-4' onSubmit={onSubmit}>
              <div className='space-y-2'>
                <label htmlFor='name' className='block'>
                  Name
                </label>
                <input
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500'
                  {...register("name")}
                />
                <label htmlFor='email' className='block'>
                  Email
                </label>
                <input
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500'
                  type='email'
                  {...register("email")}
                />
              </div>
              <div className='space-y-2'>
                <label htmlFor='password' className='block'>
                  Password
                </label>
                <input
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500'
                  type='password'
                  {...register("password")}
                />
              </div>
              <div className='space-y-2'>
                <label htmlFor='confirmPassword' className='block'>
                  Confirm password
                </label>
                <input
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500'
                  type='password'
                  {...register("confirmPassword")}
                />
              </div>
              <button
                type='submit'
                className='w-full px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none focus:ring focus:ring-blue-500'
              >
                Sign up
              </button>

              {/* sign up with google */}
              <button
                onClick={() => signUp("google")}
                type='button'
                className='flex items-center justify-center w-full px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none focus:ring focus:ring-blue-500'
              >
                Sign up with Google
                <svg
                  className='w-6 h-6 mr-2'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fill='currentColor'
                    d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3h-2v-3H8v-2h3V8h2v3h3v2z'
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
