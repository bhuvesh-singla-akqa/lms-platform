'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Training {
  id: string;
  title: string;
  category: 'FE' | 'BE' | 'QA' | 'General';
  conductedBy: string;
  dateTime: string;
  description?: string;
  meetingLink?: string;
}

interface TrainingCalendarProps {
  trainings: Training[];
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'FE':
      return 'bg-blue-500';
    case 'BE':
      return 'bg-green-500';
    case 'QA':
      return 'bg-purple-500';
    case 'General':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
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

export default function TrainingCalendar({ trainings }: TrainingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clickedDay, setClickedDay] = useState<number | null>(null);
  const [clickedTrainings, setClickedTrainings] = useState<Training[]>([]);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // Create array of days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => null);

  // Group trainings by day
  const trainingsByDay = trainings.reduce(
    (acc, training) => {
      const trainingDate = new Date(training.dateTime);
      if (
        trainingDate.getMonth() === month &&
        trainingDate.getFullYear() === year
      ) {
        const day = trainingDate.getDate();
        if (!acc[day]) acc[day] = [];
        acc[day].push(training);
      }
      return acc;
    },
    {} as Record<number, Training[]>
  );

  const handleDayClick = (day: number) => {
    if (clickedDay === day) {
      // If same day is clicked, close the popup
      setClickedDay(null);
      setClickedTrainings([]);
    } else {
      // Open popup for the clicked day
      setClickedDay(day);
      setClickedTrainings(trainingsByDay[day] || []);
    }
  };

  const handleClosePopup = () => {
    setClickedDay(null);
    setClickedTrainings([]);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        clickedDay &&
        !target.closest('.calendar-popup') &&
        !target.closest('.calendar-day')
      ) {
        handleClosePopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clickedDay]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1));
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className='relative'>
      <div className='bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6'>
        {/* Calendar Header */}
        <div className='flex items-center justify-between mb-6'>
          <motion.button
            onClick={() => navigateMonth('prev')}
            className='p-2 rounded-lg hover:bg-gray-100 transition-colors duration-100'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <svg
              className='w-5 h-5 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </motion.button>

          <h3 className='text-lg font-semibold text-gray-800'>
            {monthNames[month]} {year}
          </h3>

          <motion.button
            onClick={() => navigateMonth('next')}
            className='p-2 rounded-lg hover:bg-gray-100 transition-colors duration-100'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <svg
              className='w-5 h-5 text-gray-600'
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
          </motion.button>
        </div>

        {/* Day Names */}
        <div className='grid grid-cols-7 gap-1 mb-2'>
          {dayNames.map(day => (
            <div
              key={day}
              className='text-center text-xs font-medium text-gray-500 py-2'
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className='grid grid-cols-7 gap-1'>
          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className='h-10'></div>
          ))}

          {/* Days of the month */}
          {days.map(day => {
            const hasTrainings = trainingsByDay[day]?.length > 0;
            const isToday =
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year;
            const isClicked = clickedDay === day;

            return (
              <motion.div
                key={day}
                className={`
                  calendar-day relative h-10 flex items-center justify-center text-sm cursor-pointer rounded-lg transition-all duration-100
                  ${isToday ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-700'}
                  ${hasTrainings ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300' : 'hover:bg-gray-50'}
                  ${isClicked ? 'ring-2 ring-blue-400 bg-blue-100' : ''}
                `}
                onClick={() => handleDayClick(day)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                {day}
                {hasTrainings && (
                  <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-0.5'>
                    {trainingsByDay[day].slice(0, 3).map((training, index) => (
                      <div
                        key={training.id}
                        className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(training.category)}`}
                      />
                    ))}
                    {trainingsByDay[day].length > 3 && (
                      <div className='w-1.5 h-1.5 rounded-full bg-gray-400' />
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className='mt-4 pt-4 border-t border-gray-200'>
          <p className='text-xs text-gray-500 mb-2'>Categories:</p>
          <div className='flex flex-wrap gap-2 text-xs'>
            <div className='flex items-center gap-1'>
              <div className='w-2 h-2 rounded-full bg-blue-500'></div>
              <span className='text-gray-600'>FE 💻</span>
            </div>
            <div className='flex items-center gap-1'>
              <div className='w-2 h-2 rounded-full bg-green-500'></div>
              <span className='text-gray-600'>BE 🖥️</span>
            </div>
            <div className='flex items-center gap-1'>
              <div className='w-2 h-2 rounded-full bg-purple-500'></div>
              <span className='text-gray-600'>QA 🧪</span>
            </div>
            <div className='flex items-center gap-1'>
              <div className='w-2 h-2 rounded-full bg-orange-500'></div>
              <span className='text-gray-600'>General 📚</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popup for training details - Centered */}
      {clickedTrainings.length > 0 && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25'
          onClick={handleClosePopup}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='calendar-popup bg-white rounded-lg shadow-xl border p-4 max-w-sm mx-4'
            onClick={e => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-3'>
              <h4 className='font-semibold text-gray-800'>
                Trainings on {monthNames[month]} {clickedDay}
              </h4>
              <button
                onClick={handleClosePopup}
                className='text-gray-400 hover:text-gray-600 transition-colors duration-150'
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
            <div className='space-y-2'>
              {clickedTrainings.map(training => {
                const trainingDate = new Date(training.dateTime);
                const isUpcoming = trainingDate >= today;

                return (
                  <div
                    key={training.id}
                    className='border-b border-gray-100 pb-2 last:border-b-0'
                  >
                    <div className='flex items-start gap-2'>
                      <span className='text-lg'>
                        {getCategoryIcon(training.category)}
                      </span>
                      <div className='flex-1'>
                        <p className='font-medium text-sm text-gray-800'>
                          {training.title}
                        </p>
                        <p className='text-xs text-gray-600'>
                          by {training.conductedBy}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {trainingDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {/* View Training link for all trainings */}
                        <a
                          href={`/training/${training.id}`}
                          className='inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1 transition-colors duration-150 whitespace-nowrap'
                        >
                          <svg
                            className='w-3 h-3'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                            />
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                            />
                          </svg>
                          View Training
                        </a>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(training.category)}`}
                      >
                        {training.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
