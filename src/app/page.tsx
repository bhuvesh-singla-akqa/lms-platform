'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Training {
  id: string;
  title: string;
  category: 'FE' | 'BE' | 'QA' | 'General';
  conductedBy: string;
  dateTime: string;
}

export default function Home() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [upcoming, setUpcoming] = useState<Training[]>([]);
  const [recent, setRecent] = useState<Training[]>([]);

  useEffect(() => {
    fetch('/api/trainings')
      .then(res => res.json())
      .then(data => {
        setTrainings(data);
        const now = new Date();
        setUpcoming(
          data.filter((t: Training) => new Date(t.dateTime) >= now).slice(0, 5)
        );
        setRecent(
          data
            .filter((t: Training) => new Date(t.dateTime) < now)
            .sort(
              (a: Training, b: Training) =>
                new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
            )
            .slice(0, 3)
        );
      });
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  const handleSignIn = () => {
    signIn();
  };

  return (
    <div className='min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100'>
      {/* Animated background shapes */}
      <div className='absolute inset-0 pointer-events-none z-0'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.25, y: 0 }}
          transition={{ duration: 1.2 }}
          className='absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse'
        />
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1.5 }}
          className='absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-400 to-yellow-300 rounded-full blur-3xl opacity-30 animate-pulse'
        />
        <motion.img
          src='/globe.svg'
          alt='Learning Globe'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 1.8 }}
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] object-contain select-none pointer-events-none'
        />
      </div>
      <div className='max-w-md w-full space-y-8 z-10'>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className='text-center'
        >
          <div className='flex justify-center mb-4'>
            <Image
              src='/logo.svg'
              alt='LMS Platform'
              width={200}
              height={80}
              className='h-16 w-auto drop-shadow-xl'
              priority
            />
          </div>
          <p className='text-gray-700 mb-8 text-lg font-medium tracking-wide animate-fade-in'>
            Welcome to{' '}
            <span className='text-blue-600 font-bold'>
              Learning Management System
            </span>
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className='bg-white/80 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-blue-100'
        >
          <h2 className='text-2xl font-semibold text-center mb-6 text-blue-700 animate-fade-in'>
            Sign In
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignIn}
            className='w-full flex items-center justify-center px-4 py-3 border border-blue-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-semibold text-white hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-200'
          >
            {/* Google G logo with official colors */}
            <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
              <g>
                <path
                  d='M21.805 12.082c0-.638-.057-1.252-.163-1.837H12v3.481h5.509a4.71 4.71 0 0 1-2.044 3.09v2.56h3.305c1.936-1.785 3.035-4.415 3.035-7.294z'
                  fill='#4285F4'
                />
                <path
                  d='M12 22c2.7 0 4.963-.89 6.617-2.41l-3.305-2.56c-.917.614-2.088.98-3.312.98-2.547 0-4.705-1.72-5.477-4.037H3.09v2.573A9.997 9.997 0 0 0 12 22z'
                  fill='#34A853'
                />
                <path
                  d='M6.523 13.973A5.997 5.997 0 0 1 6 12c0-.684.117-1.346.323-1.973V7.454H3.09A9.997 9.997 0 0 0 2 12c0 1.57.377 3.055 1.09 4.546l3.433-2.573z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 6.5c1.47 0 2.78.507 3.81 1.5l2.857-2.857C16.96 3.89 14.7 3 12 3 7.58 3 3.77 5.94 2.09 9.454l3.433 2.573C7.295 8.22 9.453 6.5 12 6.5z'
                  fill='#EA4335'
                />
              </g>
            </svg>
            Continue with Google
          </motion.button>
          <p className='mt-4 text-sm text-gray-600 text-center animate-fade-in'>
            Only authorized users can access this system.
            <br />
            Contact your administrator if you need access.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
