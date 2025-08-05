'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'AccessDenied':
        return {
          title: 'Access Not Granted',
          message: 'Your account is not authorized to access this system.',
          description: 'Please contact the administrator to request access.',
        };
      case 'Signin':
        return {
          title: 'Sign In Error',
          message: 'There was a problem signing you in.',
          description:
            'Please try again or contact support if the problem persists.',
        };
      default:
        return {
          title: 'Authentication Error',
          message: 'An error occurred during authentication.',
          description:
            'Please try again or contact support if the problem persists.',
        };
    }
  };

  const errorInfo = getErrorMessage();

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
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h1 className='mt-6 text-3xl font-bold text-gray-900'>
            {errorInfo.title}
          </h1>
          <p className='mt-2 text-lg text-gray-600'>{errorInfo.message}</p>
          <p className='mt-4 text-sm text-gray-500'>{errorInfo.description}</p>
        </div>

        <div className='space-y-3'>
          <button
            onClick={() => router.push('/')}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-white'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
