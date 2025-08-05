'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className='min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100'>
      {/* Animated background shapes */}
      <div className='absolute inset-0 pointer-events-none z-0'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.18, y: 0 }}
          transition={{ duration: 1.2 }}
          className='absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse'
        />
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1.5 }}
          className='absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-400 to-yellow-300 rounded-full blur-3xl opacity-30 animate-pulse'
        />
        <motion.img
          src='/globe.svg'
          alt='Under Construction'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.18, scale: 1 }}
          transition={{ duration: 1.8 }}
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] object-contain select-none pointer-events-none'
        />
      </div>
      <div className='z-10 flex flex-col items-center'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className='bg-white/80 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-blue-100 flex flex-col items-center'
        >
          <Image
            src='/globe.svg'
            alt='Page Not Found'
            width={120}
            height={120}
            className='mb-4'
          />
          <h1 className='text-4xl font-bold text-blue-700 mb-2'>Oops! 404</h1>
          <p className='text-lg text-gray-700 mb-4 text-center'>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <motion.button
            onClick={() => router.push('/')}
            className='mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold'
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
          >
            Go to Homepage
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
