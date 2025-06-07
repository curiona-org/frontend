import Button from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className='grid min-h-screen place-items-center bg-white px-6 py-24 lg:px-8'>
      <div className='text-center'>
        <p className='text-base font-semibold text-blue-500'>404</p>
        <h1 className='mt-4 text-5xl font-semibold tracking-tight text-balance text-black-500 sm:text-display-1'>
          Page not found
        </h1>
        <p className='mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-heading-4'>
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className='mt-10 flex flex-col-reverse md:flex-row items-center justify-center gap-y-6 md:gap-y-0 md:gap-x-6'>
          <Link href='/'>
            <Button
              type='submit'
              className='text-mobile-body-1-medium lg:text-body-1-medium py-4 px-6 text-white-500 bg-gray-500 hover:bg-gray-900 flex justify-center items-center'
            >
              Go Back home 🏠
            </Button>
          </Link>
          <Link href='/community'>
            <Button
              type='submit'
              className='text-mobile-body-1-medium lg:text-body-1-medium py-4 px-6 text-white-500 bg-blue-500 hover:bg-blue-900 flex justify-center items-center'
            >
              Browse the Community 🌟
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
