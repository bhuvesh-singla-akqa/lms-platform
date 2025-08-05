'use client';

import { useRouter } from 'next/navigation';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full space-y-8 text-center'>
        <div>
          <div className='mx-auto h-24 w-24 text-red-500'>
            <svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h1 className='mt-6 text-3xl font-bold text-gray-900'>
            Access Denied
          </h1>
          <p className='mt-2 text-lg text-gray-600'>
            You do not have permission to access this page.
          </p>
          <p className='mt-4 text-sm text-gray-500'>
            Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className='space-y-3'>
          <button
            onClick={() => router.push('/dashboard')}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.back()}
            className='w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
