'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { trainingCategories } from '@/lib/categories';

export default function AddTraining() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'FE',
    conductedBy: '',
    dateTime: '',
    meetingLink: '',
    videoUrl: '',
    pptUrl: '',
    summary: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/');
      return;
    }

    if (user.role !== 'contentAdmin' && user.role !== 'admin') {
      router.push('/unauthorized');
      return;
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const trainingData = {
        ...formData,
        dateTime: new Date(formData.dateTime).toISOString(),
        instructorId: user?.id,
      };

      const response = await fetch('/api/trainings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainingData),
      });

      if (response.ok) {
        toast.success('Training added successfully!');
        setFormData({
          title: '',
          description: '',
          category: 'FE',
          conductedBy: '',
          dateTime: '',
          meetingLink: '',
          videoUrl: '',
          pptUrl: '',
          summary: '',
        });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add training');
      }
    } catch (error) {
      toast.error('Error: Failed to add training');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          alt='Learning Globe'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.8 }}
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] object-contain select-none pointer-events-none'
        />
      </div>
      <div className='max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full z-10'>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className='mb-6'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2 drop-shadow-lg'>
              Add Training
            </h1>
            <p className='text-gray-600'>
              Create new training content for the Learning Management System
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='bg-white/80 shadow rounded-lg backdrop-blur-md'
        >
          <div className='px-6 py-6'>
            <h2 className='text-lg font-medium text-gray-900 mb-6'>
              Training Details
            </h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='title'
                  className='block text-sm font-medium text-gray-700'
                >
                  Training Title *
                </label>
                <input
                  type='text'
                  id='title'
                  required
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Enter training title'
                />
              </div>

              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700'
                >
                  Description *
                </label>
                <textarea
                  id='description'
                  rows={4}
                  required
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Enter training description'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='category'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Category *
                  </label>
                  <select
                    id='category'
                    value={formData.category}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        category: e.target.value as any,
                      })
                    }
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  >
                    {trainingCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor='conductedBy'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Conducted By *
                  </label>
                  <input
                    type='text'
                    id='conductedBy'
                    required
                    value={formData.conductedBy}
                    onChange={e =>
                      setFormData({ ...formData, conductedBy: e.target.value })
                    }
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Instructor name'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='dateTime'
                  className='block text-sm font-medium text-gray-700'
                >
                  Date & Time *
                </label>
                <input
                  type='datetime-local'
                  id='dateTime'
                  required
                  value={formData.dateTime}
                  onChange={e =>
                    setFormData({ ...formData, dateTime: e.target.value })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div>
                <label
                  htmlFor='meetingLink'
                  className='block text-sm font-medium text-gray-700'
                >
                  Meeting Link *
                </label>
                <input
                  type='url'
                  id='meetingLink'
                  required
                  value={formData.meetingLink}
                  onChange={e =>
                    setFormData({ ...formData, meetingLink: e.target.value })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='https://your-meeting-platform.com/meeting-link'
                />
              </div>

              <div>
                <label
                  htmlFor='videoUrl'
                  className='block text-sm font-medium text-gray-700'
                >
                  Video URL
                </label>
                <input
                  type='url'
                  id='videoUrl'
                  value={formData.videoUrl}
                  onChange={e =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='https://drive.google.com/file/d/your-file-id/view'
                />
              </div>

              <div>
                <label
                  htmlFor='pptUrl'
                  className='block text-sm font-medium text-gray-700'
                >
                  PPT URL (Google Slides or Google Drive URL)
                </label>
                <input
                  type='url'
                  id='pptUrl'
                  value={formData.pptUrl}
                  onChange={e =>
                    setFormData({ ...formData, pptUrl: e.target.value })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='https://docs.google.com/presentation/d/your-presentation-id/edit'
                />
              </div>

              <div>
                <label
                  htmlFor='summary'
                  className='block text-sm font-medium text-gray-700'
                >
                  Summary
                </label>
                <textarea
                  id='summary'
                  rows={2}
                  value={formData.summary}
                  onChange={e =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Brief summary of the training'
                />
              </div>

              <div className='flex justify-end space-x-3'>
                <motion.button
                  type='button'
                  onClick={() => router.push('/dashboard')}
                  className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {isSubmitting ? 'Adding Training...' : 'Add Training'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
