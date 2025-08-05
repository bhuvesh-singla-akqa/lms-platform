'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { VideoPlayer } from '@/components/VideoPlayer';
import { PresentationViewer } from '@/components/PresentationViewer';
import moment from 'moment';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { createEvent } from 'ics';
import { saveAs } from 'file-saver';
import { ChevronDown, Calendar, Download, ExternalLink } from 'lucide-react';

interface Training {
  id: string;
  title: string;
  description: string;
  category: 'FE' | 'BE' | 'QA' | 'General';
  conductedBy: string;
  dateTime: string;
  meetingLink: string;
  videoUrl?: string;
  pptUrl?: string;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  summary?: string;
}

export default function TrainingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [training, setTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [editMessage, setEditMessage] = useState('');
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const trainingId = params.slug as string;

  const isUpcoming = training
    ? new Date(training.dateTime) > new Date()
    : false;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  const fetchTraining = useCallback(async () => {
    try {
      const response = await fetch(`/api/trainings/${trainingId}`);
      if (response.ok) {
        const data = await response.json();
        setTraining(data);
      } else if (response.status === 404) {
        setError('Training not found');
      } else {
        setError('Failed to load training');
      }
    } catch (error) {
      console.error('Error fetching training:', error);
      setError('Failed to load training');
    } finally {
      setIsLoading(false);
    }
  }, [trainingId]);

  useEffect(() => {
    if (user && trainingId) {
      fetchTraining();
    }
  }, [user, trainingId, fetchTraining]);

  useEffect(() => {
    if (
      training &&
      user &&
      !isUpcoming &&
      (user.role === 'contentAdmin' || user.role === 'admin')
    ) {
      setEditData({
        title: training.title,
        description: training.description,
        category: training.category,
        conductedBy: training.conductedBy,
        dateTime: training.dateTime,
        meetingLink: training.meetingLink,
        videoUrl: training.videoUrl || '',
        pptUrl: training.pptUrl || '',
        summary: training.summary || '',
      });
    }
  }, [training, user, isUpcoming]);

  const getCategoryColor = (category: string) => {
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

  const getCategoryDisplayName = (category: string) => {
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

  const handleEditChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/trainings/${trainingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (response.ok) {
        toast.success('Training updated successfully!');
        fetchTraining();
        setIsEditing(false);
      } else {
        const err = await response.json();
        toast.error(err.message || 'Failed to update training');
      }
    } catch (err) {
      toast.error('Failed to update training');
    }
  };

  const handleEnrollClick = () => {
    setShowCalendarOptions(!showCalendarOptions);
  };

  const handleICSDownload = async () => {
    if (!training) return;
    setIsDownloading(true);

    try {
      const startDate = new Date(training.dateTime);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

      const event = {
        title: training.title,
        description: `${training.description}\n\nConducted by: ${training.conductedBy}\n\nMeeting Link: ${training.meetingLink}`,
        start: [
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes(),
        ] as [number, number, number, number, number],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes(),
        ] as [number, number, number, number, number],
        location: training.meetingLink,
        url: training.meetingLink,
        organizer: {
          name: training.conductedBy,
          email: 'training@lms-platform.com',
        },
        productId: 'LMS-Platform',
        uid: `training-${training.id}-${Date.now()}`,
      };

      createEvent(event, (error, value) => {
        if (error) {
          console.error('Error creating calendar event:', error);
          toast.error('Failed to create calendar event');
          return;
        }

        const blob = new Blob([value || ''], {
          type: 'text/calendar;charset=utf-8',
        });
        const fileName = `${training.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_training.ics`;
        saveAs(blob, fileName);

        toast.success('Calendar event downloaded! 📅', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: 'white',
            fontWeight: '600',
          },
        });
      });
    } catch (error) {
      console.error('Error enrolling in training:', error);
      toast.error('Failed to enroll in training');
    } finally {
      setIsDownloading(false);
      setShowCalendarOptions(false);
    }
  };

  const handleGoogleCalendar = () => {
    if (!training) return;
    const startDate = new Date(training.dateTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatGoogleDate = (date: Date) => {
      return date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');
    };

    const googleCalendarUrl = new URL(
      'https://calendar.google.com/calendar/render'
    );
    googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.set('text', training.title);
    googleCalendarUrl.searchParams.set(
      'dates',
      `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`
    );
    googleCalendarUrl.searchParams.set(
      'details',
      `${training.description}\n\nConducted by: ${training.conductedBy}\n\nMeeting Link: ${training.meetingLink}`
    );
    googleCalendarUrl.searchParams.set('location', training.meetingLink);

    window.open(googleCalendarUrl.toString(), '_blank');
    setShowCalendarOptions(false);

    toast.success('Opening Google Calendar! 📅', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#4285F4',
        color: 'white',
        fontWeight: '600',
      },
    });
  };

  const handleOutlookCalendar = () => {
    if (!training) return;
    const startDate = new Date(training.dateTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    // Format dates for Outlook (remove milliseconds and Z from ISO string)
    const formatOutlookDate = (date: Date) => {
      return date.toISOString().split('.')[0];
    };

    const outlookUrl = new URL(
      'https://outlook.office.com/calendar/deeplink/compose'
    );
    outlookUrl.searchParams.set('subject', training.title);
    outlookUrl.searchParams.set('startdt', formatOutlookDate(startDate));
    outlookUrl.searchParams.set('enddt', formatOutlookDate(endDate));
    outlookUrl.searchParams.set(
      'body',
      `${training.description}\n\nConducted by: ${training.conductedBy}\n\nMeeting Link: ${training.meetingLink}`
    );
    outlookUrl.searchParams.set('location', training.meetingLink);

    window.open(outlookUrl.toString(), '_blank');
    setShowCalendarOptions(false);

    toast.success('Opening Outlook Calendar! 📅', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#0078D4',
        color: 'white',
        fontWeight: '600',
      },
    });
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

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-600 text-xl font-semibold mb-4'>{error}</div>
          <button
            onClick={() => router.push('/dashboard')}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-gray-600 text-xl font-semibold mb-4'>
            Training not found
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen relative flex flex-col items-center justify-start px-4 overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100'>
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
          {/* Header */}
          <div className='mb-8 bg-white/80 rounded-lg shadow p-6 backdrop-blur-md'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex-1'>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                  {training.title}
                </h1>
                <p className='text-gray-600 text-lg'>{training.description}</p>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${getCategoryColor(training.category)}`}
              >
                {getCategoryDisplayName(training.category)}
              </span>
            </div>

            {/* Enhanced Training Details Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {/* Instructor Card */}
              <motion.div
                className='bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200'
                whileHover={{ y: -2 }}
              >
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
                      <svg
                        className='w-5 h-5 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='ml-3'>
                    <div className='text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1'>
                      Instructor
                    </div>
                    <div className='text-sm font-bold text-gray-900'>
                      {training.conductedBy}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Date & Time Card */}
              <motion.div
                className='bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200'
                whileHover={{ y: -2 }}
              >
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center'>
                      <svg
                        className='w-5 h-5 text-white'
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
                  <div className='ml-3'>
                    <div className='text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1'>
                      Date & Time
                    </div>
                    <div className='text-sm font-bold text-gray-900'>
                      {moment(training.dateTime).format('MMM DD, YYYY')}
                    </div>
                    <div className='text-xs text-gray-600'>
                      {moment(training.dateTime).format('h:mm A')}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Status Card */}
              <motion.div
                className={`bg-gradient-to-br ${isUpcoming ? 'from-amber-50 to-orange-100 border-amber-200' : 'from-green-50 to-emerald-100 border-green-200'} border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200`}
                whileHover={{ y: -2 }}
              >
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div
                      className={`w-10 h-10 ${isUpcoming ? 'bg-amber-500' : 'bg-green-500'} rounded-full flex items-center justify-center`}
                    >
                      <svg
                        className='w-5 h-5 text-white'
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
                  </div>
                  <div className='ml-3'>
                    <div
                      className={`text-xs font-semibold ${isUpcoming ? 'text-amber-600' : 'text-green-600'} uppercase tracking-wider mb-1`}
                    >
                      Status
                    </div>
                    <div
                      className={`text-sm font-bold ${isUpcoming ? 'text-amber-700' : 'text-green-700'}`}
                    >
                      {isUpcoming ? 'Upcoming' : 'Completed'}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Card */}
              <motion.div
                className='bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200'
                whileHover={{ y: -2 }}
              >
                <div className='flex items-center h-full'>
                  {isUpcoming ? (
                    <div className='w-full relative'>
                      <button
                        onClick={handleEnrollClick}
                        className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold w-full text-center flex items-center justify-center gap-2 whitespace-nowrap shadow-md transition-all duration-200 transform hover:scale-105'
                      >
                        <Calendar size={16} />
                        Enroll Now
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${showCalendarOptions ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  ) : (
                    <div className='flex items-center w-full'>
                      <div className='flex-shrink-0'>
                        <div className='w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center'>
                          <svg
                            className='w-5 h-5 text-white'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                          </svg>
                        </div>
                      </div>
                      <div className='ml-3'>
                        <div className='text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1'>
                          Training
                        </div>
                        <div className='text-sm font-bold text-purple-700'>
                          Completed
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Show summary, video, ppt for completed trainings */}
        {!isUpcoming && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className='mb-8 bg-white rounded-lg shadow p-6'>
              {training.summary && (
                <div className='mb-4'>
                  <h2 className='text-xl font-semibold mb-2'>Summary</h2>
                  <p className='text-gray-700'>{training.summary}</p>
                </div>
              )}
              {training.videoUrl && (
                <div className='mb-4'>
                  <h2 className='text-xl font-semibold mb-2'>Training Video</h2>
                  <VideoPlayer url={training.videoUrl} />
                </div>
              )}
              {training.pptUrl && (
                <div className='mb-4'>
                  <h2 className='text-xl font-semibold mb-2'>Presentation</h2>
                  <PresentationViewer url={training.pptUrl} />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Edit form for contentAdmin on completed trainings */}
        {!isUpcoming &&
          (user.role === 'contentAdmin' || user.role === 'admin') && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className='mb-8 bg-white rounded-lg shadow p-6'>
                <button
                  className='mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Training'}
                </button>
                {isEditing && editData && (
                  <form onSubmit={handleEditSubmit} className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Title
                      </label>
                      <input
                        type='text'
                        value={editData.title}
                        onChange={e =>
                          handleEditChange('title', e.target.value)
                        }
                        className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Description
                      </label>
                      <textarea
                        value={editData.description}
                        onChange={e =>
                          handleEditChange('description', e.target.value)
                        }
                        className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Category
                      </label>
                      <select
                        value={editData.category}
                        onChange={e =>
                          handleEditChange('category', e.target.value)
                        }
                        className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3'
                      >
                        <option value='FE'>Frontend (FE)</option>
                        <option value='BE'>Backend (BE)</option>
                        <option value='QA'>Quality Assurance (QA)</option>
                        <option value='General'>General</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Conducted By
                      </label>
                      <input
                        type='text'
                        value={editData.conductedBy}
                        onChange={e =>
                          handleEditChange('conductedBy', e.target.value)
                        }
                        className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Date & Time
                      </label>
                      <input
                        type='datetime-local'
                        value={editData.dateTime.slice(0, 16)}
                        onChange={e =>
                          handleEditChange('dateTime', e.target.value)
                        }
                        className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Meeting Link
                      </label>
                      <input
                        type='url'
                        value={editData.meetingLink}
                        onChange={e =>
                          handleEditChange('meetingLink', e.target.value)
                        }
                        className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Video URL
                      </label>
                      <input
                        type='url'
                        value={editData.videoUrl}
                        onChange={e =>
                          handleEditChange('videoUrl', e.target.value)
                        }
                        className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        PPT URL
                      </label>
                      <input
                        type='url'
                        value={editData.pptUrl}
                        onChange={e =>
                          handleEditChange('pptUrl', e.target.value)
                        }
                        className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Summary
                      </label>
                      <textarea
                        value={editData.summary}
                        onChange={e =>
                          handleEditChange('summary', e.target.value)
                        }
                        className='mt-1 block w-full border border-gray-300 rounded-md py-2 px-3'
                      />
                    </div>
                    <div>
                      <button
                        type='submit'
                        className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className='mt-8 flex justify-center'>
            <button
              onClick={() => router.back()}
              className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium'
            >
              Go Back
            </button>
          </div>
        </motion.div>
      </div>

      {/* Calendar Options Modal - Centered */}
      {showCalendarOptions && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
          onClick={() => setShowCalendarOptions(false)}
        >
          <div
            className='bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4 w-full'
            onClick={e => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>
                Add to Calendar
              </h3>
              <button
                onClick={() => setShowCalendarOptions(false)}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='space-y-3'>
              <button
                onClick={handleGoogleCalendar}
                className='w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors'
              >
                <div className='w-6 h-6 bg-blue-500 rounded flex items-center justify-center'>
                  <span className='text-white text-sm font-bold'>G</span>
                </div>
                <span className='font-medium'>Add to Google Calendar</span>
                <ExternalLink size={16} className='ml-auto text-gray-400' />
              </button>

              <button
                onClick={handleOutlookCalendar}
                className='w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors'
              >
                <div className='w-6 h-6 bg-blue-600 rounded flex items-center justify-center'>
                  <span className='text-white text-sm font-bold'>O</span>
                </div>
                <span className='font-medium'>Add to Outlook</span>
                <ExternalLink size={16} className='ml-auto text-gray-400' />
              </button>

              <button
                onClick={handleICSDownload}
                disabled={isDownloading}
                className='w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors disabled:opacity-50'
              >
                <Download size={18} className='text-gray-500' />
                <span className='font-medium'>
                  {isDownloading ? 'Downloading...' : 'Download .ics file'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
