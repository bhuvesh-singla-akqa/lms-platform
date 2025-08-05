'use client';
import { useState, useEffect } from 'react';
import { TrainingCard } from '@/components/TrainingCard';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Training } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { trainingCategories } from '@/lib/categories';

const categories = ['FE', 'BE', 'QA', 'General'] as const;
type Category = (typeof categories)[number];

export default function CategoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<Category | 'All'>('All');
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTrainings();
    }
  }, [user]);

  const fetchTrainings = async () => {
    try {
      const response = await fetch('/api/trainings');
      if (response.ok) {
        const data = await response.json();
        setTrainings(data);
      }
    } catch (error) {
      console.error('Error fetching trainings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered =
    selected === 'All'
      ? trainings
      : trainings.filter(t => t.category === selected);

  const getCategoryDisplayName = (category: Category) => {
    switch (category) {
      case 'FE':
        return 'Frontend';
      case 'BE':
        return 'Backend';
      case 'QA':
        return 'Quality Assurance';
      case 'General':
        return 'General';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case 'FE':
        return 'bg-blue-100 text-blue-800';
      case 'BE':
        return 'bg-green-100 text-green-800';
      case 'QA':
        return 'bg-amber-100 text-amber-800';
      case 'General':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2 drop-shadow-lg'>
              Trainings by Category
            </h1>
            <p className='text-gray-600'>
              Browse training content organized by categories
            </p>
          </div>
        </motion.div>
        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className='mb-8 bg-white/80 p-4 rounded-lg shadow backdrop-blur-md'
        >
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Filter by Category
          </h3>
          <div className='flex flex-wrap gap-2'>
            <motion.button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setSelected('All')}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.96 }}
            >
              All ({trainings.length})
            </motion.button>
            {categories.map(category => {
              const count = trainings.filter(
                t => t.category === category
              ).length;
              return (
                <motion.button
                  key={category}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setSelected(category)}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {getCategoryDisplayName(category)} ({count})
                </motion.button>
              );
            })}
          </div>
        </motion.div>
        {/* Training Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center py-12 bg-white/80 rounded-lg shadow backdrop-blur-md'
          >
            <div className='text-gray-500 text-lg'>
              {selected === 'All'
                ? 'No trainings available yet.'
                : `No trainings available in ${getCategoryDisplayName(selected as Category)} category.`}
            </div>
            {(user.role === 'contentAdmin' || user.role === 'admin') && (
              <motion.button
                onClick={() => router.push('/add-training')}
                className='mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow'
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.96 }}
              >
                Add First Training
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filtered.map(training => (
              <motion.div
                key={training.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                }}
                whileTap={{ scale: 0.97 }}
                className='backdrop-blur-md'
              >
                <TrainingCard
                  training={training}
                  categoryColor={getCategoryColor(training.category)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
