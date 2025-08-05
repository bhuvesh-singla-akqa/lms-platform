'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TrainingCalendar from '@/components/TrainingCalendar';
import { Training } from '@/types';

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'FE':
      return 'bg-blue-500 text-white';
    case 'BE':
      return 'bg-green-500 text-white';
    case 'QA':
      return 'bg-purple-500 text-white';
    case 'General':
      return 'bg-orange-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'FE':
      return '💻';
    case 'BE':
      return '🖥️';
    case 'QA':
      return '🧪';
    case 'General':
      return '📚';
    default:
      return '📖';
  }
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [upcoming, setUpcoming] = useState<Training[]>([]);
  const [recent, setRecent] = useState<Training[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch('/api/trainings')
      .then(res => res.json())
      .then(data => {
        setTrainings(data);
        const now = new Date();
        // Sort upcoming trainings by nearest date and limit to 3
        const upcomingTrainings = data
          .filter((t: Training) => new Date(t.dateTime) >= now)
          .sort(
            (a: Training, b: Training) =>
              new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
          )
          .slice(0, 3);
        setUpcoming(upcomingTrainings);
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

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userRole = user.role;
  const canAddUsers = userRole === 'admin';
  const canAddTraining = userRole === 'admin' || userRole === 'contentAdmin';

  return (
    <div className='min-h-screen relative flex flex-col px-4 overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100'>
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
          alt='Learning Globe'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.8 }}
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] object-contain select-none pointer-events-none'
        />
      </div>

      <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2 drop-shadow-lg'>
              LMS Dashboard
            </h1>
            <p className='text-gray-600'>
              Welcome back, <span className='font-medium'>{user.name}</span>!
              You are logged in as{' '}
              <span className='font-medium capitalize text-blue-600'>
                {userRole}
              </span>
              .
            </p>
          </div>
        </motion.div>

        {/* Top Priority Section - Calendar & Recent Trainings */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          {/* Training Calendar - 2/3 width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='lg:col-span-2'
          >
            <div className='bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300'>
              <div className='p-6'>
                <div className='flex items-center mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-indigo-100 rounded-lg'>
                      <svg
                        className='h-6 w-6 text-indigo-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                    <h3 className='text-xl font-bold text-gray-800'>
                      Training Calendar
                    </h3>
                  </div>
                </div>
                <TrainingCalendar trainings={trainings} />
              </div>
            </div>
          </motion.div>

          {/* Upcoming Trainings Card - 1/3 width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className='lg:col-span-1'
          >
            <div className='bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300'>
              <div className='p-6'>
                <div className='flex items-center mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-blue-100 rounded-lg'>
                      <svg
                        className='h-6 w-6 text-blue-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                    <h3 className='text-xl font-bold text-gray-800'>
                      Upcoming Trainings
                    </h3>
                  </div>
                </div>

                <div className='space-y-3 min-h-[280px]'>
                  {upcoming.length === 0 ? (
                    <div className='text-gray-500 text-center py-8 text-sm'>
                      No upcoming trainings scheduled
                    </div>
                  ) : (
                    upcoming.map(training => (
                      <motion.div
                        key={training.id}
                        className='flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-all cursor-pointer'
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => router.push(`/training/${training.id}`)}
                      >
                        <div className='flex-shrink-0'>
                          <span className='text-2xl'>
                            {getCategoryIcon(training.category)}
                          </span>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h4 className='text-sm font-semibold text-gray-800 line-clamp-2'>
                            {training.title}
                          </h4>
                          <p className='text-xs text-gray-600 mb-1'>
                            by {training.conductedBy}
                          </p>
                          <div className='flex items-center gap-2'>
                            <span className='text-xs text-blue-600 font-medium'>
                              {new Date(training.dateTime).toLocaleDateString()}{' '}
                              •{' '}
                              {new Date(training.dateTime).toLocaleTimeString(
                                [],
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(training.category)}`}
                        >
                          {training.category}
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Commented out Upcoming Trainings for now */}
        {/* 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Upcoming Trainings</h3>
                </div>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {upcoming.length === 0 ? (
                  <div className="text-gray-500 text-center py-4 text-sm">No upcoming trainings scheduled</div>
                ) : (
                  upcoming.map(training => (
                    <motion.div 
                      key={training.id} 
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-all cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{getCategoryIcon(training.category)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 truncate">{training.title}</h4>
                        <p className="text-xs text-gray-600 mb-1">by {training.conductedBy}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-blue-600 font-medium">
                            {new Date(training.dateTime).toLocaleDateString()} • {new Date(training.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(training.category)}`}>
                        {training.category}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
        */}

        {/* Training Calendar Section - Moved to top */}
        {/* This section is now moved to the top priority section above */}

        {/* Action Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {/* Browse Training Content */}
          <div
            className='force-cursor-pointer'
            onClick={() => router.push('/category')}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className='bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300'
            >
              <div className='p-6'>
                <div className='flex items-center mb-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <svg
                      className='h-8 w-8 text-blue-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                      />
                    </svg>
                  </div>
                </div>
                <h3 className='text-lg font-bold text-gray-800 mb-2'>
                  Browse Training Content
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  Access all available training materials and resources
                </p>
                <div className='flex items-center text-blue-600 text-sm font-medium'>
                  Explore Content
                  <svg
                    className='ml-1 h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Training Calendar */}
          <div
            className='force-cursor-pointer'
            onClick={() => router.push('/calendar')}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className='bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300'
            >
              <div className='p-6'>
                <div className='flex items-center mb-4'>
                  <div className='p-3 bg-green-100 rounded-xl'>
                    <svg
                      className='h-8 w-8 text-green-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                </div>
                <h3 className='text-lg font-bold text-gray-800 mb-2'>
                  Full Training Calendar
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  View detailed schedule of all training sessions
                </p>
                <div className='flex items-center text-green-600 text-sm font-medium'>
                  View Full Calendar
                  <svg
                    className='ml-1 h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {/* User Role Management - Only for admin */}
          {canAddUsers && (
            <div
              className='force-cursor-pointer'
              onClick={() => router.push('/add-user')}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className='bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300'
              >
                <div className='p-6'>
                  <div className='flex items-center mb-4'>
                    <div className='p-3 bg-purple-100 rounded-xl'>
                      <svg
                        className='h-8 w-8 text-purple-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className='text-lg font-bold text-gray-800 mb-2'>
                    User Role Management
                  </h3>
                  <p className='text-sm text-gray-600 mb-4'>
                    Assign and manage user roles and permissions
                  </p>
                  <div className='flex items-center text-purple-600 text-sm font-medium'>
                    Manage Users
                    <svg
                      className='ml-1 h-4 w-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Content Management - Only for contentAdmin */}
          {canAddTraining && (
            <div
              className='force-cursor-pointer'
              onClick={() => router.push('/add-training')}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className='bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300'
              >
                <div className='p-6'>
                  <div className='flex items-center mb-4'>
                    <div className='p-3 bg-orange-100 rounded-xl'>
                      <svg
                        className='h-8 w-8 text-orange-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className='text-lg font-bold text-gray-800 mb-2'>
                    Content Management
                  </h3>
                  <p className='text-sm text-gray-600 mb-4'>
                    Add new training content and manage resources
                  </p>
                  <div className='flex items-center text-orange-600 text-sm font-medium'>
                    Add Training
                    <svg
                      className='ml-1 h-4 w-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
