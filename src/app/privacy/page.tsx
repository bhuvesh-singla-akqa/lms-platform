'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PrivacyPage() {
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
          alt='Privacy'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.8 }}
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] object-contain select-none pointer-events-none'
        />
      </div>
      <div className='z-10 w-full max-w-2xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className='bg-white/80 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-blue-100'
        >
          <h1 className='text-3xl font-bold text-blue-700 mb-4'>
            Privacy Policy
          </h1>
          <p className='text-gray-700 mb-4'>
            Your privacy is important to us. This privacy policy outlines how we
            handle your information.
          </p>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Information We Collect
          </h2>
          <p className='text-gray-600 mb-2'>
            We may collect information such as your name, email address, and
            usage data to provide and improve our services.
          </p>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            How We Use Information
          </h2>
          <p className='text-gray-600 mb-2'>
            We use your information to operate, maintain, and enhance the
            features of our platform. We do not sell your personal data to third
            parties.
          </p>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Contact Us
          </h2>
          <p className='text-gray-600'>
            If you have any questions about this privacy policy, please contact
            your system administrator.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
